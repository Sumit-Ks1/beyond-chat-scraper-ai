
import mongoose from 'mongoose';

const { Schema } = mongoose;

const articleSchema = new Schema(
  {

    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [500, 'Title cannot exceed 500 characters'],
      index: true,
    },

    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      lowercase: true,
      index: true,
    },

    author: {
      type: String,
      trim: true,
      default: 'Unknown',
    },

    publish_date: {
      type: Date,
      index: true,
    },

    content: {
      type: String,
      required: [true, 'Content is required'],
    },


    original_url: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
    },

    
    parent_article_id: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      default: null,
      index: true,
    },

   
    article_type: {
      type: String,
      enum: ['original', 'enhanced'],
      default: 'original',
      index: true,
    },

   
    references: [
      {
        title: String,
        url: String,
        source: String,
      },
    ],

   
    meta: {
      description: {
        type: String,
        maxlength: [300, 'Meta description cannot exceed 300 characters'],
      },
      keywords: [String],
    },


    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


articleSchema.virtual('enhanced_version', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'parent_article_id',
  justOne: true,
});


articleSchema.index({ article_type: 1, publish_date: -1 });
articleSchema.index({ isDeleted: 1, article_type: 1 });


articleSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});


articleSchema.statics.findActive = function (filter = {}) {
  return this.find({ ...filter, isDeleted: false });
};


articleSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  return this.save();
};

const Article = mongoose.model('Article', articleSchema);

export default Article;
