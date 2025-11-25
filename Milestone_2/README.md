# Milestone 2 Simple – Prototype: Frontend + Backend Foundations

##  Overview

This is a job application sugestion application. It demonstrates a functional prototype linking a ReactJS frontend and Spring Boot backend using REST endpoints.

### Simple Architecture Diagram

```
+------------------+        HTTP Requests       +---------------------------+
|     ReactJS      | -------------------------> |      Spring Boot API      |
|  (Frontend UI)   | <------------------------- |     /api/suggestions      |
+------------------+      JSON Responses        +---------------------------+
          |
          | State-based Navigation (useState)
          v
+---------------------+
| Components:         |
| - Home              |
| - DataDisplay       |
| - FormPage          |
+---------------------+

```

### Key Differences from Advanced Version

- **No React Router** - Uses simple state-based page switching in App.js
- **Simple fetch()** - No Axios library, uses native fetch API
- **Basic Components** - Simpler component structure
- **Straightforward Backend** - Basic controller/service/model pattern

## Running the Application

### Prerequisites

- Java 17+
- Maven 3.6+
- Node.js 16+ and npm

### Step-by-Step Instructions

#### Step 1: Start the Backend Server

   ```
   cd Milestone_2
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

#### Step 2: Start the Frontend Server

 **Open a NEW terminal** 


   ```
   cd Milestone_2
   cd frontend
   npm install
   npm run dev
   
   ```

#### Step 3: Use the Application

1. **Open browser:** `http://localhost:5173/`

2. **You'll see:**
   - Navigation buttons (Home, Data Display, Form)
   - Click buttons to switch between pages

3. **Test the application:**
   - Click "Form" → Fill out and submit
   - Click "Data Display" → See your submissions
   - Click "Home" → View overview

## Features

### Frontend
-  Three pages (Home, Data Display, Form)
-  Simple state-based navigation (no React Router)
-  useState for state management
-  fetch() for API calls
-  Basic styling

### Backend
-  REST API endpoints (GET, POST, PUT, DELETE)
-  Controller → Service → Model structure
-  In-memory storage (HashMap)
-  HTTP status codes
-  JSON responses

##  Adding New Pages

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

## Code Structure

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

## API Endpoint Table
Method          Route                     Action
------------------------------------------------------------------------------

Get    | /api/suggestions      | Get all job suggestions

------------------------------------------------------------------------------

Post   | /api/suggestions      | Create a new job suggestion

------------------------------------------------------------------------------

Delete | /api/suggestions/(id) | Delete a job suggestions

------------------------------------------------------------------------------


## AI Usage Log
**Project Information:**
- Course: COP 3060 – Full Stack Web Development
- Milestone #: 2
- Team Name: Group X
- Team Members: Caleb Parker, Clemenceau Senatus, Jamal Person, Jordan Monts
- Date Submitted: November 25,2025
-------------------------------------------------------------------------------------------------------------------------------------------
**Date:** November 24, 2025
**AI Tool:** ChatGPT
**Prompt Summary:** Error Handling
**Purpose:** Fixing errors within our code, so that we could properly run our program.
**Output used but modified**
**Human Revision:** Removed irrelevant lines that AI suggested and tested how code would work in different parts of program.
**Ethical Reflection:** Used responsibly to resolve errors without replacing our own coding work, only modifying it if neccesary.

-------------------------------------------------------------------------------------------------------------------------------------------
**Date:** November 24, 2025
**AI Tool:** ChatGPT
**Prompt Summary:** Notation/Documentation/Formatting Assistance
**Purpose:** To make our ideas, methods, and how to run our program more clear to those who did not work on the project.
**Output used but modified**
**Human Revision:** Reformatted notation, documentation, and formatting based on AI suggestions.
**Ethical Reflection:** Used ethically to improve readability and understanding of our work and documentation.

-------------------------------------------------------------------------------------------------------------------------------------------


Summary of AI Use: AI tools were used to assist with debugging, documentation clarity, and front and backend integration troubleshooting.
Most of the usage focused on identifying frontend bugs causing it not to display properly, reformatting our README, and improving clarity in our project explanations and comments. 

Ethical Reflection: We used AI responsibily throughout this milestone as a copilot/support system when we ran into bugs and wanted to display our work in a way that's understandable to more than just those who worked on it. The majority of our usage dealt with understanding the  issue at hand, rather than looking for a quick fix solution. The outputs that we did use have modified to better fit our project.

Verification Statement: By signing, we confirm all AI usage has been logged accurately and ethically.
Group Signatures: Caleb Parker, Clemenceau Senatus, Jamal Person, Jordan Monts
