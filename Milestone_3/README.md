# Milestone 3 Simple – Database + External API + Authentication

## 📋 Overview

This is Milestone 3. It adds database persistence, basic external API integration, and simple authentication using session-based approach (simpler than JWT).


**Entity Relationships:**
- **User** (1) ──< (Many) **Suggestion**: One user can have many suggestions
- **Suggestion** (1) ──< (Many) **suggestion_answers**: One suggestion has many answer key-value pairs (stored as `@ElementCollection`)

**Key Fields:**
- `User.id`: Primary key, auto-generated
- `User.username`: Unique constraint
- `User.password`: BCrypt hashed
- `Suggestion.user_id`: Foreign key to User
- `Suggestion.external_api_data`: Stores JSON response from external API

## 🔌 External API Integration

- **API Used**: OpenAI ChatGPT API via OpenRouter (`https://openrouter.ai/api/v1`)
- **Model**: `openai/gpt-3.5-turbo` (ChatGPT)
- **Integration Point**: When creating/updating suggestions, the service calls OpenAI API to generate personalized job suggestions based on user's form answers
- **Error Handling**: Gracefully handles timeouts and API failures, falls back to simple suggestions if API fails
- **Data Storage**: API integration metadata stored as JSON string in `Suggestion.external_api_data`

**Example Flow:**
1. User submits form with answers (workHistory, skills, personality, location, rolePreference)
2. Backend calls OpenAI ChatGPT API with a prompt containing user's answers
3. AI generates personalized job suggestions based on the answers
4. Suggestions stored in database along with API integration metadata
5. Displayed in frontend when viewing suggestions

**API Key Configuration:**

The application supports using your own API key via environment variable to avoid quota issues:

1. **Using Environment Variable (Recommended):**
   - Set the `OPENROUTER_API_KEY` environment variable with your own API key
   - The application will automatically use this key if set
   - This is useful if you run into quota/billing issues with the default key

   **Windows (PowerShell):**
   ```powershell
   $env:OPENROUTER_API_KEY="your-api-key-here"
   ```

   **Windows (Command Prompt):**
   ```cmd
   set OPENROUTER_API_KEY=your-api-key-here
   ```

   **Linux/Mac:**
   ```bash
   export OPENROUTER_API_KEY="your-api-key-here"
   ```

2. **Default Key:**
   - If no environment variable is set, the application uses a default OpenRouter API key
   - Default key: `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`

**Note:** If you encounter quota errors (429 status code with "insufficient_quota"), set your own `OPENROUTER_API_KEY` environment variable before starting the backend.

## Authentication

- Simple session-based authentication (easier than JWT)
- User registration and login
- Protected routes using session
- Password hashing with BCrypt
- Session stored server-side, session ID in cookie
- All suggestion endpoints require authentication
- Users can only access their own suggestions

## Running the Application

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 16+ and npm

### Step-by-Step Instructions

#### Step 1: Start Backend

```bash
cd milestone-3-simple/backend
mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`


#### Step 2: Start Frontend

```bash
cd milestone-3-simple/frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

#### Step 3: Use Application

1. Register a new user
2. Login
3. Submit forms
4. View data

## API Endpoints

### Authentication Endpoints (Public)
The /api/auth/register endpoint lets a new user register with a username and password.
The /api/auth/login endpoint allows a user to log in using their username and password.
The /api/auth/logout endpoint logs out the currently authenticated user.
The /api/auth/Data Display endpoint returns the information of the currently logged-in user.

### Suggestion Endpoints (Protected)
The /api/suggestions GET endpoint returns all suggestions that belong to the authenticated user.
The /api/suggestions/{id} GET endpoint returns a specific suggestion by its ID.
The /api/suggestions POST endpoint creates a new suggestion using the answers provided in the request body.
The /api/suggestions/{id} PUT endpoint updates an existing suggestion with new answer data.
The /api/suggestions/{id} DELETE endpoint removes a suggestion using its ID.

**Note:** All `/api/suggestions/*` endpoints require authentication. Users can only access their own suggestions.

## Example API Responses

### Register User
**Request:**
```json
POST /api/auth/register
{
  "username": "john_doe",
  "password": "1"
}
```

**Response:**
```json
{
  "message": "Please lengthen this text to 3 characters or more...",
}
```

### Login
**Request:**
```json
POST /api/auth/login
{
  "username": "john_doe",
  "password": "1"
}
```

**Response:**
```json
{
  "message": "Invalid username or password",
}
```

### Create Suggestion
**Request:**
```json
POST /api/suggestions
{
  "answers": {
    {
  "skills": "CSS",
  "location": "On-site",
  "personality": "Hardworking, Polite",
  "workHistory": "Publix",
  "rolePreference": "Manager"
    }
  }
}
```

**Response:**
```json
{
  "id": 1,
  "answers": {
    "workHistory": "5 years software development",
    "skills": "Java, Spring Boot, React",
    "personality": "Analytical, Team player",
    "location": "Remote",
    "rolePreference": "developer"
  },
  "createdAt": "11/30/2025, 5:40:33 PM",
  "suggestions": "1. Job Title: Web Developer
   - This role matches your CSS skills from Publix and requires a hardworking attitude. As a Web Developer, you will be able to use your technical skills to create visually appealing and functional websites.
   Next Steps:
   - Enroll in online coding courses to expand your skills beyond CSS.
   - Build a portfolio of web development projects to showcase your capabilities...",
  "externalApiData": "{"integration": "OpenAI ChatGPT API", "model": "openai/gpt-3.5-turbo", "status": "success", "aiGenerated": true}",
}
```

### Get All Suggestions
**Request:**
```
GET /api/suggestions/Data Display
```

**Response:**
```json
[
  {
    "id": 1,
    "answers": {...},
    "suggestions": "...",
    "externalApiData": "...",
    "createdAt": "2024-01-15T10:30:00"
  },
  {
    "id": 2,
    "answers": {...},
    "suggestions": "...",
    "externalApiData": "...",
    "createdAt": "2024-01-15T11:00:00"
  }
]
```

### Error Response (Unauthorized)
**Request:**
```
GET /api/suggestions
```
(Without authentication)

**Response (401 Unauthorized):**
```json
{
  "error": "Authentication required"
}
```


## AI Usage Log

**Date:** [Add Date]

**AI Tool Used:** 

**Purpose:**
-

**Specific Assistance:**
- 

**Time Saved:** [Estimate if applicable]

**Learning Outcomes:**
- 

