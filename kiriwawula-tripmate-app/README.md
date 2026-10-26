# Kiriwawula TripMate

## Project Overview

Kiriwawula TripMate is a local tourist day-visit planner and information system developed to help visitors discover tourist attractions around Kiriwawula, Pilimathalawa, and Kandy, Sri Lanka.

The application provides information about tourist places, their facilities, entrance fees, locations, and other useful details to help users plan day visits.

## Main Features

- Browse tourist attractions.
- Search and filter tourist places.
- View descriptions and details about tourist destinations.
- Explore place images and available media.
- View tourist locations on an interactive map.
- View information about facilities and entrance fees.
- Manage tourist place information through administrative features.
- Create and manage trip itineraries.

## Technologies Used

**Frontend**
- React.js
- HTML5
- CSS3
- JavaScript
- Vite

**Backend**
- Node.js
- Express.js

**Database**
- MySQL

**Mapping**
- Leaflet.js
- OpenStreetMap

## Project Structure

- `kiriwawula-tripmate-app/` — React frontend application.
- `backend/` — Backend server, API routes, models, and database-related code.

## How to Run the Project

### 1. Start the Backend

Open a terminal in the backend folder:

```bash
cd backend
npm install
```

Configure the required environment variables in your local `.env` file, then start the backend using the appropriate script defined in `package.json`.

### 2. Start the Frontend

Open another terminal in the frontend folder:

```bash
cd kiriwawula-tripmate-app
npm install
npm run dev
```

Open the local URL displayed in the terminal.

Ensure MySQL is configured and running before using features that require the database.

## Academic Project

Developed as part of the University of Moratuwa Bachelor of Information Technology (BIT) Programming Group Project.

## Security

Database credentials, passwords, and other sensitive configuration values should never be committed to the repository.