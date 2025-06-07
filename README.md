# Taskly Frontend

Taskly Frontend is the user interface for the Taskly application, which provides features for task management and user authentication.

## Features
- User login and registration
- Task creation, editing, and deletion
- View and manage tasks

## Tech Stack
- **Framework**: React.js
- **State Management**: React Context API
- **Styling**: CSS, TailwindCSS (or your chosen styling method)
- **Routing**: React Router
- **HTTP Requests**: Axios for API calls
- **Environment Management**: Vite (if using Vite as bundler)

## Setup & Installation

### 1. Clone the Repository
Clone the repository to your local machine:

```bash
git clone https://github.com/harisankar705  /taskly-frontend.git
cd taskly-frontend
2. Install Dependencies
Run the following command to install the necessary dependencies:

bash
Copy
Edit
npm install
3. Configure Environment Variables
Create a .env file in the root of your project and add the following variables:

ini
Copy
Edit
VITE_BACKEND_URL=https://taskly-backend-ados.onrender.com   # Your backend URL
This variable stores the URL of your backend API, which will be used for making API requests to your backend.

4. Running the Development Server
Start the development server:

bash
Copy
Edit
npm run dev
This should start your frontend application at http://localhost:5173 (or the port specified in the Vite config).

5. Build and Deploy
To build the frontend for production, run:

bash
Copy
Edit
npm run build
You can deploy this build to platforms like Vercel or Netlify. Make sure to configure the environment variables on the deployment platform as well.

6. Troubleshooting
If you encounter any issues, ensure that:

The backend API is running and accessible.

The .env file is properly configured with the correct backend URL.

The React app is properly configured for production by checking your build settings.

Application Flow
Login Page: The user logs in with their credentials, receiving a JWT token for authorization.

Task Management: After logging in, users can view, create, update, and delete tasks. The frontend interacts with the backend via API requests.

Deployment
This frontend application can be deployed using platforms like Vercel or Netlify.

Vercel:

Connect the repository to Vercel.

Add the environment variable VITE_BACKEND_URL with the backend API URL.

Deploy!

Netlify:

Push the app to GitHub, then connect it to Netlify.

Add VITE_BACKEND_URL as an environment variable in the Netlify dashboard.

Deploy!

License
MIT License. See LICENSE for more information.
taskly-frontend/ ├── src/ │ ├── components/ │ ├── pages/ │ ├── context/ │ └── App.tsx ├── .env ├── package.json └── vite.config.ts


