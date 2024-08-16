# Google Drive Integration App
## Overview
This application is a web-based interface that allows users to interact with their Google Drive. The main features include:

Authentication: Users can log in using their Google account via OAuth 2.0.
File Listing: Displays a list of files stored in the user's Google Drive.
File Upload: Allows users to upload files directly to their Google Drive.
File Download: Users can download files from their Google Drive.
File Deletion: Users can delete files from their Google Drive.
The frontend is built with React and TypeScript, while the backend is an Express server that handles OAuth authentication and communicates with the Google Drive API.

## Development Environment Setup
### Prerequisites
Before setting up the development environment, ensure you have the following installed:

- Node.js (version 14.x or later)
npm or yarn
Google Cloud Project with OAuth 2.0 credentials configured
Google Cloud Project Setup
Create a Google Cloud Project:

- Go to the Google Cloud Console.
- Create a new project.
- Enable the Google Drive API:

- Navigate to "APIs & Services" > "Library".
- Search for "Google Drive API" and enable it for your project.
- Set Up OAuth 2.0 Credentials:

- Navigate to "APIs & Services" > "Credentials".
- Create OAuth 2.0 credentials and set the authorized redirect URI to http://localhost:3001/api/auth/callback.
- Obtain Client ID and Client Secret:

- After setting up OAuth credentials, note down the Client ID and Client Secret.
- Environment Variables
- Create a .env file in the root directory of the backend project and add the following environment variables:

```
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REDIRECT_URI=http://localhost:3001/api/auth/callback
REACT_APP_API_URL=http://localhost:3001/api
PORT=3001
```
- Replace your_google_client_id and your_google_client_secret with the credentials obtained from Google Cloud.

### Installing Dependencies
-  to the project root directory and install the necessary dependencies:


#### Install backend dependencies
```
cd backend
npm install
```

#### Install frontend dependencies
```
cd ./frontend
npm install
```

### Running the Application
#### Backend
- To start the backend server, navigate to the backend directory and run:

```
npm start
```
The backend server will start on http://localhost:3001.


#### Frontend
- To start the frontend development server, navigate to the frontend directory and run:

```
npm start
```
The frontend will start on http://localhost:3000.


## Assumptions and Design Decisions
#### Authentication Flow:

- The application uses OAuth 2.0 for authentication, redirecting the user to Google's login page. Upon successful authentication, the application receives an access token, which is used for subsequent API requests.
Frontend-Backend Communication:

- The frontend communicates with the backend via a REST API. The backend handles OAuth 2.0, interacts with Google Drive API, and returns the necessary data to the frontend.
Error Handling:

- Basic error handling is implemented throughout the application, with alerts shown to users for critical issues (e.g., failed uploads/downloads).
Token Storage:

- For simplicity, tokens are stored in memory during the session. In a production environment, you might want to persist these tokens in localStorage, sessionStorage, or a secure cookie.
CSS Styling:

- Basic CSS is used to style the components. Additional styling and improvements can be made according to project requirements.
No Console Logging in Production:

- While console logs can be useful during development, they are removed or minimized in the final production build to avoid exposing sensitive information and cluttering the console.