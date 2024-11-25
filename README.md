# Stock Tracking and Portfolio Management System

[![Node.js Version](https://img.shields.io/badge/node.js-v14%2B-brightgreen)](https://nodejs.org/)

---

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [System Architecture](#system-architecture)
4. [Setup Instructions](#setup-instructions)
   - [Prerequisites](#prerequisites)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
5. [Directory Structure](#directory-structure)
6. [API Endpoints](#api-endpoints)
7. [Limitations](#limitations)
8. [Future Enhancements](#future-enhancements)
9. [Technologies Used](#technologies-used)
10. [Contact](#contact)

---

## Overview
This project is a stock tracking and portfolio management application, designed to simplify portfolio management and provide insights into stock performance. The system consists of:
1. **Frontend**: A React-based interface for users.
2. **Backend**: A Node.js server with Express.js and SQLite to handle business logic, API requests, and data storage.

---

## Features

### Frontend
- Intuitive React-based interface.
- User authentication (login, sign-up, password recovery).
- Portfolio management: Add, view, remove stocks.
- Stock list with search, sorting, and graphical representation.
- Admin panel for user and stock management.

### Backend
- RESTful API for stock and portfolio management.
- Real-time stock price updates via WebSocket.
- SQLite database for data storage.
- Authentication with JWT tokens.
- Robust error handling for seamless interaction.

---

## System Architecture
The system architecture consists of:
- **Frontend**: Dynamic UI with React and Axios for API communication.
- **Backend**: Express.js for APIs and WebSocket server.
- **Database**: SQLite for reliable data persistence.
- **External API**: Finnhub for stock data.

> **Note**: Future versions may incorporate additional services for scalability and advanced analytics.

---

## Setup Instructions

### Prerequisites
- **Node.js**: Version 14 or higher.
- **SQLite**: Installed locally.
- **API Key**: A valid API key from Finnhub.

### Backend Setup
1. Install dependencies:
   - Run `npm install` in the backend directory.
2. Create a `.env` file with the following variables:
   - `FINNHUB_API_KEY`: Your Finnhub API key.
   - `PORT`: 3001.
   - `DEFAULT_THROTTLE_INTERVAL`: 3000.
   - `ENABLE_TRADE_LOGGING`: true.
   - `GMAIL_APP_PASSWORD`: "yaqy rrbl uxcs exjq".
   - `GMAIL_USER`: stocktracker609@gmail.com.
3. Start the server:
   - Run `npm start`. The server will be accessible at `http://localhost:3001`.

### Frontend Setup
1. Navigate to the frontend directory.
2. Install dependencies:
   - Run `npm install`.
3. Start the application:
   - Run `npm start`. The app will be accessible at `http://localhost:3000`.

---

## Directory Structure

### Backend
- **config**:
  - `config.json`: Configuration for the database.
  - `db.js`: Initializes Sequelize.
- **controllers**: Handles business logic.
- **middleware**: Implements authentication and role-based checks.
- **models**: Defines Sequelize data models.
- **routes**: API route handlers.
- `app.js`: Main entry point.

### Frontend
- **src**:
  - `components`: UI components for the application.
  - `globals`: Global utilities and variables.
  - `services`: Axios service for API communication.
  - `App.js`: Root application component.
  - `index.js`: Application entry point.
- **public**: Contains static assets.

---

## API Endpoints

### Stock Routes
- `GET /api/stocks`: Retrieve all stocks.
- `POST /api/stocks`: Add a new stock (admin only).
- `PUT /api/stocks/:id`: Update stock information by ID.
- `DELETE /api/stocks/:id`: Remove a stock by ID.

### User Routes
- `POST /api/users/register`: Register a new user.
- `POST /api/users/login`: Log in a user and return a JWT token.

### Portfolio Routes
- `GET /api/user-stocks`: View the current user’s portfolio.
- `POST /api/user-stocks`: Add a stock to the user’s portfolio.
- `DELETE /api/user-stocks/:id`: Remove a stock from the portfolio.

---

## Limitations
- **Manual Stock Entry**: Adding a stock requires manual input of details like symbol and market cap.
- **Basic Portfolio Analytics**: Advanced analytics such as risk assessments are not yet implemented.
- **Database Scalability**: For larger datasets, migration to a scalable solution (e.g., PostgreSQL) may be required.

---

## Future Enhancements
- Automate stock data entry using Finnhub API.
- Introduce real-time notifications for price changes.
- Add advanced portfolio analytics (profit/loss, risk).
- Transition to a scalable database for enterprise-level performance.

---

## Technologies Used
- **Frontend**: React, Axios, HTML/CSS.
- **Backend**: Node.js, Express.js, Sequelize ORM.
- **Database**: SQLite.
- **External APIs**: Finnhub.

---

## Contact
For support or inquiries, contact:
- **Moses Kayuni**: [kayunilow11@gmail.com](mailto:kayunilow11@gmail.com)
- **Michael Seavers**: [michaelseavers@hotmail.com](mailto:michaelseavers@hotmail.com)
