# Stock Tracking and Portfolio Management System

## Overview
This project is a stock tracking and portfolio management application consisting of two main parts:
1. **Frontend**: A React-based user interface that allows users to interact with the system.
2. **Backend**: A Node.js server with Express.js and SQLite database that handles business logic, API requests, and data storage.

---

## Features
### Frontend
- Responsive React-based user interface.
- User authentication with login, sign-up, and password recovery.
- Portfolio management: Add, view, and remove stocks.
- Stock list with search, sort, and graph capabilities.
- Admin panel to manage users and stock information.

### Backend
- RESTful API for managing stock data and user portfolios.
- WebSocket integration for real-time stock price updates.
- Database using SQLite for structured data storage.
- Authentication and role-based access control using JWT tokens.
- Error handling for API and WebSocket interactions.

---

## System Architecture
The system consists of the following components:
1. **Frontend**: React with Axios for API requests and dynamic UI updates.
2. **Backend**: Node.js and Express.js for API endpoints and WebSocket server.
3. **Database**: SQLite for data persistence.
4. **External APIs**: Finnhub for real-time and historical stock data.

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher recommended).
- SQLite database installed locally.
- API key from Finnhub.

### Backend Setup
1. Install dependencies using `npm install`.
2. Create a `.env` file and add the following variables:
   - **FINNHUB_API_KEY**: Your API key for Finnhub.
   - **PORT**: 3001.
   - **DEFAULT_THROTTLE_INTERVAL**: 3000.
   - **ENABLE_TRADE_LOGGING**: true.
   - **GMAIL_APP_PASSWORD**: "your app password".
   - **GMAIL_USER**: yourgmail@password.com.
3. Run the server using `npm start`. The server will run at `http://localhost:3001`.

---

### Frontend Setup
1. Navigate to the frontend directory.
2. Install dependencies using `npm install`.
3. Run the React application using `npm start`. The app will run at `http://localhost:3000`.

---

## Directory Structure

### Backend
- **config**:
  - `config.json`: Database configuration.
  - `db.js`: Sequelize initialization.
- **controllers**: Contains business logic.
- **middleware**: Handles authentication and admin checks.
- **models**: Defines Sequelize models.
- **routes**: Contains API routes.
- `server.js`: Main entry point.

### Frontend
- **src**:
  - `components`: React components.
  - `globals`: Global variables and utilities.
  - `services`: Axios API service.
  - `App.js`: Main application file.
  - `index.js`: Entry point.
- **public**: Static files.
- `package.json`: Project metadata and dependencies.

---

## API Endpoints

### Stock Routes
- Retrieve all stocks: `GET /api/stocks`
- Add a new stock (admin only): `POST /api/stocks`
- Update a stock by ID: `PUT /api/stocks/:id`
- Delete a stock by ID: `DELETE /api/stocks/:id`

### User Routes
- Register a new user: `POST /api/users/register`
- Authenticate a user and return a token: `POST /api/users/login`

### User Stock Routes
- Get the current user’s portfolio: `GET /api/user-stocks`
- Add a stock to the user’s portfolio: `POST /api/user-stocks`
- Remove a stock from the user’s portfolio: `DELETE /api/user-stocks/:id`

---

## Limitations

### Manual Stock Entry
Adding a stock requires entering all details manually, including symbol, sector, and market cap. Automation with Finnhub API is planned for future versions.

### Basic Portfolio Analytics
Advanced insights, such as profit/loss and risk assessments, are not implemented yet.

### Database Scalability
SQLite may require migration to a more scalable solution, such as PostgreSQL, for handling larger datasets.

---

## Future Enhancements
- Automate stock data entry by fetching details from Finnhub API.
- Add advanced portfolio analytics and insights.
- Implement real-time notifications for significant stock price changes.
- Migrate to a scalable database for improved performance with larger datasets.

---

## Technologies Used
- **Frontend**: React, Axios, HTML, and CSS.
- **Backend**: Node.js, Express.js, and Sequelize ORM.
- **Database**: SQLite.
- **External APIs**: Finnhub for stock data.

---

## Contact

For queries, reach out to:
- Moses Kayuni - [kayunilow11@gmail.com](mailto:kayunilow11@gmail.com)
- Michael Seavers - [michaelseavers@hotmail.com](mailto:michaelseavers@hotmail.com)
