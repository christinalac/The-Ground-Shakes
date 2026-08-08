# The Ground Shakes

Live Demo: https://the-ground-shakes-app.vercel.app/

## Overview

The Ground Shakes is a real-time earthquake visualization tool powered by USGS seismic data. Earthquakes are synced to a secure backend, normalized, and displayed on an interactive map with detailed information popups.

You can explore recent seismic activity, view detailed earthquake information, and save important events for later review.

This project combines a modern React frontend, a Node and Express backend, MongoDB storage, and an earthy modern design system with optional dark mode support.

## Setup Instructions

### Prerequisites

* Node.js installed
* npm installed
* MongoDB running locally or a MongoDB connection string
* Git installed

### 1. Clone the Repository
```bash
git clone https://github.com/christinalac/The-Ground-Shakes
cd The-Ground-Shakes
```

### 2. Install Frontend Dependencies
From the project directory, run:
```bash
npm install
```

### 3. Configure the Backend
Open a new terminal and navigate to the server directory:
```bash
cd server
npm install
```
Create a local `.env` file in the `server` directory and add your MongoDB connection string.

### 4. Start the Backend
From the `server` directory, run:
```bash
node index.js
```

### 5. Start the Frontend
Open another terminal and navigate back to the project directory:
```bash
cd The-Ground-Shakes
npm start
```

The application will then open in your browser.

## API Documentation

The backend provides REST API endpoints for retrieving and synchronizing earthquake data.

Method   Endpoint           Description                              
GET      /api/quakes        Retrieves recent earthquake data            
POST     /api/quakes/sync   Syncs earthquake data from the USGS feed 

API requests require an `Authorization` header.
Example:
```http
Authorization: Bearer <value>
```
The current authentication middleware checks for the presence of an authorization header.

Earthquake data is provided by the USGS and is processed and stored in MongoDB before being served to the frontend

## User Roles + Workflows

There is only one user role
Users can view earthquake activity around the globe, view earthquake information, and favorite earthquakes

Workflow:
1. View earthquakes on the interactive map
2. Select an earthquake to see its details
3. Favorite chosen earthquakes
4. View and manage favorited earthquakes in the Favorites page

## AI Assistance Disclosure

AIs tools including Claude and ChatGPT were used in this project to help us code, debug our code, and help understand any problem we had. Everything that was generated was reviewed and also edited if necessary. We are able to understand and explain everything in our code

