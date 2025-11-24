# Milestone 2 Simple – Prototype: Frontend + Backend Foundations

## 📋 Overview

This is a job application sugestion application. It demonstrates a functional prototype linking a ReactJS frontend and Spring Boot backend using REST endpoints.

### Simple Architecture

```
Frontend (React)
    ↓
App.js (Conditional Rendering - No Router)
    ↓
Components (Home, DataDisplay, FormPage)
    ↓
fetch() API calls
    ↓
Backend (Spring Boot)
    ↓
Controller → Service → Model
    ↓
In-Memory Storage (HashMap)
```

### Key Differences from Advanced Version

- **No React Router** - Uses simple state-based page switching in App.js
- **Simple fetch()** - No Axios library, uses native fetch API
- **Basic Components** - Simpler component structure
- **Straightforward Backend** - Basic controller/service/model pattern

## 🚀 Running the Application

### Prerequisites

- Java 17+
- Maven 3.6+
- Node.js 16+ and npm

### Step-by-Step Instructions

#### Step 1: Start the Backend Server

1. **Open a terminal/command prompt**

2. **Navigate to the backend directory:**
   ```bash
   cd "Milestone_2"
   cd backend
   ```

3. **Install Maven dependencies:**
   ```bash
   mvn clean install
   ```
   - Wait for "BUILD SUCCESS"

4. **Start the Spring Boot server:**
   ```bash
   mvn spring-boot:run
   ```
      - Wait for "(process running for X.XXX)"

5. **Wait for the server to start:**
   - Look for: `http://localhost:8080`
   - Should show "Whitelabel Error Page"
   - **Keep this terminal open!**

#### Step 2: Start the Frontend Server

1. **Open a NEW terminal** (keep backend running!)

2. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

3. **Install npm dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Wait for the server to start:**
   - Look for: `Local: http://localhost:5173/`
   - **Keep this terminal open!**

#### Step 3: Use the Application

1. **Open browser:** `http://localhost:5173/`

2. **You'll see:**
   - Navigation buttons (Home, Data Display, Form)
   - Click buttons to switch between pages

3. **Test the application:**
   - Click "Form" → Fill out and submit
   - Click "Data Display" → See your submissions
   - Click "Home" → View overview

## ✨ Features

### Frontend
- ✅ Three pages (Home, Data Display, Form)
- ✅ Simple state-based navigation (no React Router)
- ✅ useState for state management
- ✅ fetch() for API calls
- ✅ Basic styling

### Backend
- ✅ REST API endpoints (GET, POST, PUT, DELETE)
- ✅ Controller → Service → Model structure
- ✅ In-memory storage (HashMap)
- ✅ HTTP status codes
- ✅ JSON responses

## 📝 Adding New Pages

To add a new page to the application:

1. **Create a new component** in `frontend/src/components/`:
   ```js
   // NewPage.js
   import React from 'react'
   
   function NewPage() {
     return (
       <div className="page">
         <h2>New Page</h2>
         <p>Content here</p>
       </div>
     )
   }
   
   export default NewPage
   ```

2. **Import it in App.js:**
   ```js
   import NewPage from './components/NewPage'
   ```

3. **Add to pages object:**
   ```js
   const pages = {
     home: <Home />,
     data: <DataDisplay />,
     form: <FormPage />,
     newPage: <NewPage />  // Add here
   }
   ```

4. **Add navigation button:**
   ```js
   <button onClick={() => setCurrentPage('newPage')}>
     New Page
   </button>
   ```

## 🔧 Code Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── App.js           # Main app with page switching
│   ├── main.js          # Entry point
│   ├── styles.css       # Styling
│   └── components/
│       ├── Home.js
│       ├── DataDisplay.js
│       └── FormPage.js
```

### Backend Structure
```
backend/
├── src/main/java/com/example/jobsuggestions/
│   ├── controller/
│   │   └── SuggestionController.java
│   ├── service/
│   │   └── SuggestionService.java
│   ├── model/
│   │   ├── Suggestion.java
│   │   └── SuggestionRequest.java
│   └── JobSuggestionsApplication.java
```

## 📝 AI Usage Log

### Date: [Add Date]
**AI Tool:** [Tool Name]
**Prompt Summary:** [Description]
**Purpose:** [Purpose]

### Summary of AI Use:
AI tools were used for [describe usage]. All code was manually reviewed and understood.

### Ethical Reflection:
AI assistance was used responsibly. All code was reviewed and modified as needed.

