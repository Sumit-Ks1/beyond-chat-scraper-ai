# BeyondChat Assignment

A full-stack article scraping, AI enhancement, and display application built with Node.js, Express, MongoDB, React, and Groq LLM.

![Project Architecture](./docs/architecture.png)

## 📋 Table of Contents

- [Overview](#-overview)
- [Local Setup Instructions](#-local-setup-instructions)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Data Flow Diagram](#-data-flow-diagram)
- [Assumptions](#-assumptions)
- [Live Demo](#-live-demo)

## 🎯 Overview

This project consists of three phases:

1. **Phase 1**: Web scraper that fetches the 5 oldest articles from BeyondChats blog and stores them in MongoDB with REST CRUD APIs
2. **Phase 2**: Enhancement script that uses Google Search API and Groq LLM to rewrite articles with improved structure and SEO
3. **Phase 3**: React frontend to display original and AI-enhanced article versions

## 🚀 Local Setup Instructions

## 1. Clone the Repository

```bash
git clone <repository-url>
cd beyondChatAssignment
```

### 2. Install Dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
cd ../scripts && npm install
```

### 3. Configure Environment Variables

**Backend** (`backend/.env`):
Add mongoDB url string to store blogs
and keep other stuff same for development mode
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/beyondchat_articles
FRONTEND_URL=http://localhost:5173
```


**Scripts** (`scripts/.env`):
add mongoDB URI here too and google api key(with google search api allowed ) and search engine id and groq api
```env
API_BASE_URL=http://localhost:5000/api
MONGODB_URI=mongodb://localhost:27017/beyondchat_articles
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
GROQ_API_KEY=your_groq_api_key
```

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start MongoDB

```bash
# Use MongoDB Atlas connection string in .env
```

### 5. Start the Backend Server

```bash
cd backend
npm run dev

# Server starts at http://localhost:5000
```

### 6. Run the Scraper (Phase 1)

```bash
cd scripts
npm run scrape

# This will scrape 5 oldest articles from BeyondChats blog and will store in mongoDB database
```

### 7. Enhance Articles (Phase 2)

```bash
cd scripts

# Enhance a specific article (RECOMENDED TO BEGIN TESTING WITH)
npm run enhance <article_id>

# Enhance all original articles
npm run enhance:all
```

### 8. Start the Frontend (Phase 3)

```bash
cd frontend
npm run dev
```


## ✨ Features

### Backend (Phase 1)
- ✅ Puppeteer-based web scraper with pagination support
- ✅ MongoDB storage with Mongoose ODM
- ✅ RESTful CRUD APIs using Express.js
- ✅ MVC architecture with clean separation of concerns
- ✅ Zod validation for request data
- ✅ Error handling middleware
- ✅ Rate limiting and security headers

### Enhancement Script (Phase 2)
- ✅ Google Custom Search API integration
- ✅ Web scraping of related articles
- ✅ Groq LLM integration for content rewriting
- ✅ SEO-optimized content generation
- ✅ Reference tracking and linking
- ✅ Parent-child article relationship

### Frontend (Phase 3)
- ✅ React with Vite for fast development
- ✅ Responsive Tailwind CSS design
- ✅ Article list with pagination
- ✅ Article detail with Original/Enhanced sections
- ✅ Loading states and error handling
- ✅ Clean component architecture

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│    ┌──────────┐    ┌──────────────┐    ┌──────────────┐        │
│    │ Article  │    │   Article    │    │   Shared     │        │
│    │   List   │    │   Detail     │    │ Components   │        │
│    └────┬─────┘    └──────┬───────┘    └──────────────┘        │
│         │                 │                                      │
│         └────────┬────────┘                                     │
│                  ▼                                               │
│         ┌──────────────┐                                        │
│         │  API Service │                                        │
│         └──────┬───────┘                                        │
└────────────────┼────────────────────────────────────────────────┘
                 │ HTTP
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express.js)                        │
│    ┌────────────────────────────────────────────────────────┐   │
│    │                      Routes Layer                       │   │
│    └────────────────────────┬───────────────────────────────┘   │
│                             ▼                                    │
│    ┌────────────────────────────────────────────────────────┐   │
│    │                   Middleware Layer                      │   │
│    │  (Validation, Error Handling, Rate Limiting, CORS)     │   │
│    └────────────────────────┬───────────────────────────────┘   │
│                             ▼                                    │
│    ┌────────────────────────────────────────────────────────┐   │
│    │                   Controller Layer                      │   │
│    └────────────────────────┬───────────────────────────────┘   │
│                             ▼                                    │
│    ┌────────────────────────────────────────────────────────┐   │
│    │                    Service Layer                        │   │
│    │              (Business Logic)                           │   │
│    └────────────────────────┬───────────────────────────────┘   │
│                             ▼                                    │
│    ┌────────────────────────────────────────────────────────┐   │
│    │                     Model Layer                         │   │
│    │                (Mongoose Schemas)                       │   │
│    └────────────────────────┬───────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MongoDB                                  │
│                    (Articles Collection)                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    SCRIPTS (Enhancement)                         │
│                                                                  │
│  ┌──────────────┐    ┌─────────────────┐    ┌───────────────┐  │
│  │   Scraper    │    │ Google Search   │    │    Groq LLM   │  │
│  │   Service    │    │    API          │    │    Service    │  │
│  └──────┬───────┘    └────────┬────────┘    └───────┬───────┘  │
│         │                     │                     │           │
│         └─────────────────────┼─────────────────────┘           │
│                               ▼                                  │
│                    ┌─────────────────┐                          │
│                    │   Enhancer      │                          │
│                    │   Script        │                          │
│                    └────────┬────────┘                          │
│                             │                                    │
└─────────────────────────────┼───────────────────────────────────┘
                              │ HTTP
                              ▼
                         Backend API
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

### Scripts
- **Web Scraping**: Puppeteer, Cheerio
- **Search**: Google Custom Search API
- **LLM**: Groq (Llama 3.1 70B)
- **HTTP Client**: Axios

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher) - Local or MongoDB Atlas
- **npm** or **yarn**

### API Keys Required

1. **Google Custom Search API** (Optional for enhancement)
   - Create project at [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Custom Search API
   - Create credentials (API Key)
   - Create a [Programmable Search Engine](https://programmablesearchengine.google.com/)

2. **Groq API Key** (For AI enhancement)
   - Sign up at [Groq Console](https://console.groq.com/)
   - Create an API key (Free tier available, no credit card required)


# App starts at http://localhost:5173


## 📁 Project Structure

```
beyondChatAssignment/
├── backend/                    # Express.js API Server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   ├── validators/        # Zod validation schemas
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
│   ├── .env.example
│   └── package.json
│
├── scripts/                    # Utility scripts
│   ├── src/
│   │   ├── services/          # Service modules
│   │   │   ├── apiService.js
│   │   │   ├── contentScraper.js
│   │   │   ├── googleSearch.js
│   │   │   └── llmService.js
│   │   ├── config.js
│   │   ├── scraper.js         # Blog scraper
│   │   ├── enhancer.js        # Article enhancer
│   │   └── enhanceAll.js      # Batch enhancer
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── config/            # App configuration
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # Page layouts
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── .env.example
│   └── package.json
│
├── docs/                       # Documentation
│   └── architecture.png
│
|
└── README.md                  # This file
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```



## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 1: SCRAPING
═══════════════════

    BeyondChats Blog          Scraper           MongoDB          Express API
         │                       │                  │                 │
         │   1. Navigate to      │                  │                 │
         │      last page        │                  │                 │
         │◄──────────────────────┤                  │                 │
         │                       │                  │                 │
         │   2. Scrape 5         │                  │                 │
         │      oldest articles  │                  │                 │
         │──────────────────────►│                  │                 │
         │                       │                  │                 │
         │                       │  3. POST to API  │                 │
         │                       │─────────────────────────────────────►
         │                       │                  │                 │
         │                       │                  │◄───4. Store────┤
         │                       │                  │                 │


PHASE 2: ENHANCEMENT
═════════════════════

   Express API        Enhancer         Google API        Groq LLM
        │                 │                 │                │
        │                 │                 │                │
        │◄──1. GET article                  │                │
        │        by ID    │                 │                │
        │                 │                 │                │
        │   2. Article    │                 │                │
        │      data       │                 │                │
        │────────────────►│                 │                │
        │                 │                 │                │
        │                 │  3. Search for  │                │
        │                 │     related     │                │
        │                 │     articles    │                │
        │                 │────────────────►│                │
        │                 │                 │                │
        │                 │◄───4. Results───┤                │
        │                 │                 │                │
        │                 │   5. Scrape related articles     │
        │                 │──────────────────────────────────┤
        │                 │                                  │
        │                 │   6. Send to LLM for rewriting   │
        │                 │─────────────────────────────────►│
        │                 │                                  │
        │                 │◄──7. Enhanced content────────────┤
        │                 │                                  │
        │◄──8. POST enhanced article (with parent_article_id)│
        │                 │                                  │


PHASE 3: DISPLAY
═════════════════

    React App          Express API          MongoDB
        │                   │                   │
        │  1. GET /articles │                   │
        │──────────────────►│                   │
        │                   │                   │
        │                   │◄────2. Query─────┤
        │                   │                   │
        │◄──3. Articles─────┤                   │
        │                   │                   │
        │  4. GET /articles │                   │
        │     /:id/with-    │                   │
        │     enhanced      │                   │
        │──────────────────►│                   │
        │                   │                   │
        │◄──5. Original +   │                   │
        │      Enhanced     │                   │
        │      Articles     │                   │
        │                   │                   │
```

## 🤔 Assumptions

1. **Article Age Determination**: Since the blog pagination shows newest first, we navigate to the last page to find the oldest articles.

2. **Content Extraction**: The scraper handles various HTML structures for content extraction and basically extracts all dontent of blog

3. **LLM Output Quality**: The Groq LLM (Llama 3.1 70B) is assumed to produce high-quality, plagiarism-free content when given proper prompts.

4. **Google Search Results**: We assume the first 2 organic results from Google Search are relevant blog articles that can be scraped.

5. **Rate Limiting**: Default rate limits are set to 100 requests per 15 minutes. Adjust based on expected traffic.



## 🌐 Live Demo

- **Frontend**: [https://beyondchat-frontend.vercel.app](https://beyondchat-frontend.vercel.app) *(deploy and update link)*
- **Backend API**: [https://beyondchat-api.onrender.com](https://beyondchat-api.onrender.com) *(deploy and update link)*




## 📝 License

AGPL-3.0 license

## 👤 Author

Created by SUMIT KUMAR SINGH
