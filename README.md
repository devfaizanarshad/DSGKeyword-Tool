# DSG Keyword Tool
DSG Keyword Tool is a full-stack web application designed to help businesses generate relevant, long-tail SEO keywords. The application features a public-facing, multi-step keyword generator and a complete admin panel for managing the system's data, including sectors, services, and customer-generated keywords.

## Features

### Public Keyword Generator
- **Multi-Step Form**: Guides users through a seamless process of providing their business details.
- **Dynamic Selections**: Select a business sector to dynamically load relevant business disciplines, and then select a discipline to load associated services.
- **Location-Based Keywords**: Users can specify their country, state, zip code, and service radius to generate location-specific keywords.
- **Keyword Generation**: Automatically creates a comprehensive list of long-tail keywords based on the user's services and location.
- **CSV Export**: Allows users to download their generated keywords as a CSV file.

### Admin Dashboard
- **Authentication**: Secure login for administrators.
- **Statistics**: A dashboard view with key statistics, including the total number of sectors, customers, and services.
- **Sector Management**: Full CRUD (Create, Read, Update, Delete) functionality for business sectors and their associated disciplines.
- **Service Management**: Full CRUD functionality for services, linking them to specific sectors and business disciplines.
- **Customer Management**: View a list of all customers who have used the keyword generator, see their full details in a modal, and manage their records.
- **Keyword Management**: View, manage, and delete keywords generated for each customer.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React, CoreUI, React Router, Redux, Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)

## Getting Started

### Prerequisites
- Node.js and npm (or yarn)
- MongoDB instance (local or cloud-based like MongoDB Atlas)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/devfaizanarshad/DSGKeyword-Tool.git
    cd DSGKeyword-Tool
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create an environment file:**
    Create a `.env` file in the root directory and add your MongoDB connection string:
    ```env
    CONNECTION_STRING=your_mongodb_connection_string
    ```
4.  **Start the backend server:**
    ```bash
    npm start
    ```
    The server will run on `http://localhost:4000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create an environment file:**
    Create a `.env` file in the `frontend` directory and add the backend API URL:
    ```env
    REACT_APP_API_BASE_URL=http://localhost:4000
    ```
4.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    The React app will be available at `http://localhost:3000`.

### Running Both Concurrently

You can run both the frontend and backend servers with a single command from the root directory:
```bash
npm run start:both
```

## Usage

### Keyword Generator

1.  Navigate to `http://localhost:3000`.
2.  Follow the multi-step form:
    - Choose a Sector.
    - Choose a Business Discipline.
    - Select the services you offer.
    - Enter your name, email, and website.
    - Specify your location details (country, state, radius, zip code).
3.  Click "Submit" to save your information and generate keywords.

### Admin Panel

1.  Navigate to `http://localhost:3000/auth/login`.
2.  Log in using administrator credentials. The `Users` collection in the database identifies admins with `role: 0`.
3.  Once logged in, you will be redirected to the admin dashboard where you can manage sectors, services, and customers.

## Project Structure
```
DSGKeyword-Tool/
├── controllers/          # Backend logic for handling API requests
├── frontend/             # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/   # CoreUI reusable components
│   │   ├── layout/
│   │   ├── views/        # Application pages and views
│   │   └── ...
│   └── ...
├── models/               # Mongoose schemas for MongoDB
├── public/               # Static assets for the backend
├── routes/               # Express API route definitions
├── server.js             # Backend server entry point
└── package.json          # Backend dependencies and scripts
