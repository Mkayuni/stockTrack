# StockTrack: Portfolio Management System

<div align="center">

[![Node.js Version](https://img.shields.io/badge/node.js-v14%2B-brightgreen)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## 📊 Application Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/37fb4e7a-96c4-4f4d-b33d-d349ddb59759" width="400" alt="Login Screen"/>
        <br /><em>Terminal</em>
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/1930b03b-7ab9-4cce-932b-e6842186ebee" width="400" alt="Dashboard"/>
        <br /><em>Admin Dashboard</em>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/03e5268f-19a3-4bcc-bfb7-7c1b610fa3e2" width="400" alt="Portfolio View"/>
        <br /><em>Portfolio Sectors</em>
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/76ef429b-b53d-4468-90d9-45332d82f3a5" width="400" alt="Stock Details"/>
        <br /><em>Stock Details</em>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/8b7153d3-7aec-43a6-8e27-c9b0ebebf2c4" width="400" alt="Admin Panel"/>
        <br /><em>Main Page</em>
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/09c5f319-1b77-4cde-a83a-03c86213c1bb" width="400" alt="User Management"/>
        <br /><em>User Management</em>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/513617a1-bf65-4da9-b5d7-3a5ca185e11c" width="400" alt="Analytics"/>
        <br /><em>Structure</em>
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/1ef47e0f-6749-4045-ba36-3228b9ffe707" width="400" alt="Mobile View"/>
        <br /><em>Admin Management</em>
      </td>
    </tr>
  </table>
</div>

## 📋 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Current Limitations](#-current-limitations)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Authors](#-authors)

## 🔍 Overview

StockTrack is a comprehensive stock tracking and portfolio management application designed to simplify the investment experience. The system enables users to manage their stock portfolios, track performance, and make informed investment decisions through a clean, intuitive interface.

Our application combines real-time market data with personal portfolio tracking to deliver a seamless experience for both casual investors and investment professionals.

## 🌟 Key Features

### For Investors
- **Secure User Authentication** — Robust login system with password recovery
- **Personalized Portfolio Dashboard** — Track all your investments in one place
- **Real-time Stock Updates** — Get the latest market data via WebSocket technology
- **Data Visualization** — Understand performance trends with interactive charts
- **Search & Filter** — Quickly find stocks by name, symbol, or performance metrics
- **Mobile Responsive Design** — Access your portfolio from any device

### For Administrators
- **User Management** — Create, view, update, and remove user accounts
- **Stock Database Control** — Maintain the stock database with admin privileges
- **System Monitoring** — Track application performance and user activity
- **Data Export** — Generate and download portfolio reports

## 🏗 System Architecture

The system follows a modern three-tier architecture:

1. **Presentation Layer** (Frontend)
   - React-based single-page application
   - Responsive design using modern CSS frameworks
   - State management for a fluid user experience

2. **Application Layer** (Backend)
   - RESTful API implemented with Express.js
   - WebSocket server for real-time data updates
   - JWT-based authentication system
   - Business logic for portfolio management

3. **Data Layer**
   - SQLite database for persistent storage
   - ORM integration for database operations
   - External API integration for market data

## 💻 Technology Stack

### Frontend
- **React** — UI library for building interactive interfaces
- **Axios** — Promise-based HTTP client for API requests
- **Chart.js** — Data visualization library
- **WebSocket** — Real-time communication
- **CSS/SCSS** — Styling with preprocessor support

### Backend
- **Node.js** — JavaScript runtime environment
- **Express.js** — Web application framework
- **Sequelize** — ORM for database operations
- **JWT** — Secure authentication
- **WebSocket** — Server for real-time updates

### Database
- **SQLite** — Lightweight, file-based relational database
- **Migrations** — Version control for database schema

### External Services
- **Finnhub API** — Stock market data provider
- **Yahoo Finance API** — Additional financial information
- **RapidAPI** — API marketplace for additional integrations

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- NPM or Yarn package manager
- SQLite database
- A valid API key from Finnhub

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stocktrack.git
   cd stocktrack/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the server root with the following variables:
   ```
   PORT=3001
   FINNHUB_API_KEY=your_finnhub_api_key
   JWT_SECRET=your_jwt_secret_key
   DEFAULT_THROTTLE_INTERVAL=3000
   ENABLE_TRADE_LOGGING=true
   GMAIL_APP_PASSWORD=your_gmail_app_password
   GMAIL_USER=your_gmail_address
   ```

4. **Initialize the database**
   ```bash
   npm run migrate
   npm run seed  # Optional: populate with sample data
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   The server will be available at `http://localhost:3001`

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

## 📂 Project Structure

```
stocktrack/
├── frontend/                   # React frontend application
│   ├── node_modules/           # Node.js dependencies
│   ├── public/                 # Static files
│   ├── src/                    # Source files
│   │   ├── components/         # UI components
│   │   │   └── StockList_Components/  # Stock listing components
│   │   │       ├── SearchFields.js    # Search functionality
│   │   │       ├── StockCard.js       # Individual stock display
│   │   │       └── StockGraph.js      # Stock performance charts
│   │   ├── globals/            # Global utilities and state
│   │   │   ├── globalUser.js   # User state management
│   │   │   └── validationFunctions.js # Input validation
│   │   ├── services/           # API communication services
│   │   ├── adminPanel.js       # Admin control panel
│   │   ├── App.css             # Main stylesheet
│   │   ├── App.js              # Main application component
│   │   ├── App.test.js         # Testing suite
│   │   ├── ForgotPassword.js   # Password recovery
│   │   ├── Home.js             # Dashboard view
│   │   ├── index.css           # Global styles
│   │   ├── index.js            # Application entry point
│   │   ├── LoginComponent.js   # Authentication
│   │   ├── logo.svg            # Application logo
│   │   ├── Portfolio.js        # User portfolio view
│   │   ├── ProfileIcon.js      # User profile component
│   │   ├── reportWebVitals.js  # Performance measurement
│   │   ├── Settings.js         # User preferences
│   │   ├── setupTests.js       # Test configuration
│   │   ├── SignUp.js           # Registration
│   │   └── StockList.js        # Stock listing page
│   └── package.json            # Frontend dependencies
│
├── server/                     # Node.js/Express backend
│   ├── config/                 # Configuration files
│   ├── controllers/            # Request handlers
│   ├── middleware/             # Express middleware
│   │   ├── authenticateToken.js  # JWT validation
│   │   ├── emailSender.js      # Email service
│   │   └── isAdmin.js          # Admin role check
│   ├── migrations/             # Database migrations
│   ├── models/                 # Sequelize models
│   ├── node_modules/           # Node.js dependencies
│   ├── routes/                 # API routes
│   │   ├── adminRoutes.js      # Admin endpoints
│   │   ├── emailRoutes.js      # Email service endpoints
│   │   ├── stockPriceRoutes.js # Stock price endpoints
│   │   ├── stockRoutes.js      # Stock management endpoints
│   │   ├── userRoutes.js       # User management endpoints
│   │   └── userStocksRoutes.js # Portfolio management endpoints
│   ├── scripts/                # Utility scripts
│   ├── seeders/                # Database seed data
│   ├── utils/                  # Utility functions
│   ├── .env                    # Environment variables
│   ├── database.sqlite         # SQLite database file
│   ├── package-lock.json       # Dependency tree
│   ├── package.json            # Backend dependencies
│   └── server.js               # Server entry point
│
└── README.md                   # Project documentation
```

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint             | Description                  | Request Body                        | Auth Required |
|--------|----------------------|------------------------------|----------------------------------|--------------|
| POST   | `/api/users/register`| Register a new user          | `{name, email, password}`        | No           |
| POST   | `/api/users/login`   | Authenticate user            | `{email, password}`              | No           |
| POST   | `/api/users/refresh` | Refresh authentication token | `{refreshToken}`                 | No           |
| POST   | `/api/users/forgot-password` | Request password reset | `{email}`                      | No           |
| POST   | `/api/users/reset-password` | Reset password        | `{token, newPassword}`           | No           |

### Stock Management Endpoints

| Method | Endpoint             | Description                  | Request Body                        | Auth Required |
|--------|----------------------|------------------------------|----------------------------------|--------------|
| GET    | `/api/stocks`        | Get all stocks               | -                                | Yes          |
| GET    | `/api/stocks/:id`    | Get stock by ID              | -                                | Yes          |
| POST   | `/api/stocks`        | Add new stock                | `{symbol, name, marketCap, etc}` | Yes (Admin)  |
| PUT    | `/api/stocks/:id`    | Update stock                 | `{symbol, name, marketCap, etc}` | Yes (Admin)  |
| DELETE | `/api/stocks/:id`    | Delete stock                 | -                                | Yes (Admin)  |

### Portfolio Management Endpoints

| Method | Endpoint             | Description                  | Request Body                        | Auth Required |
|--------|----------------------|------------------------------|----------------------------------|--------------|
| GET    | `/api/user-stocks`   | Get user's portfolio         | -                                | Yes          |
| POST   | `/api/user-stocks`   | Add stock to portfolio       | `{stockId, shares, buyPrice}`    | Yes          |
| PUT    | `/api/user-stocks/:id` | Update portfolio entry     | `{shares, buyPrice}`             | Yes          |
| DELETE | `/api/user-stocks/:id` | Remove from portfolio      | -                                | Yes          |

### Admin Endpoints

| Method | Endpoint             | Description                  | Request Body                        | Auth Required |
|--------|----------------------|------------------------------|----------------------------------|--------------|
| GET    | `/api/admin/users`   | Get all users                | -                                | Yes (Admin)  |
| PUT    | `/api/admin/users/:id` | Update user role           | `{role}`                         | Yes (Admin)  |
| DELETE | `/api/admin/users/:id` | Delete user                | -                                | Yes (Admin)  |

## 🔒 Security

StockTrack implements several security measures:

- **JWT Authentication** — Secure token-based authentication
- **Password Hashing** — Bcrypt for secure password storage
- **Input Validation** — Request validation to prevent injection attacks
- **Rate Limiting** — Protection against brute-force attacks
- **CORS Configuration** — Controlled access to API resources
- **HTTP-only Cookies** — Secure token storage

## ⚠️ Current Limitations

- **Manual Stock Entry** — Adding stocks requires manual input of details
- **Limited Analytics** — Basic analytics without advanced metrics
- **Database Scalability** — SQLite may have performance limitations for very large datasets
- **Single Currency** — Currently supports USD-based stocks only
- **Limited External API Integration** — Relies primarily on Finnhub API

## 🛣 Roadmap

### Short-term Goals (1-3 months)
- [ ] Automated stock data entry via API
- [ ] Email notifications for significant price changes
- [ ] Enhanced mobile responsiveness
- [ ] Additional authentication methods (OAuth)

### Mid-term Goals (3-6 months)
- [ ] Advanced portfolio analytics (risk assessment, diversification metrics)
- [ ] Custom watchlists and alerts
- [ ] Historical performance tracking
- [ ] Data export to various formats (PDF, CSV)

### Long-term Goals (6+ months)
- [ ] Migration to PostgreSQL for improved scalability
- [ ] Machine learning-based stock recommendations
- [ ] Social features (sharing portfolios, following investors)
- [ ] Multi-currency support
- [ ] Integration with trading platforms


## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Moses Kayuni** - [kayunilow11@gmail.com](mailto:kayunilow11@gmail.com)
- **Michael Seavers** - [michaelseavers@hotmail.com](mailto:michaelseavers@hotmail.com)

---

<p align="center">
  <b>StockTrack</b> — Your investment portfolio, simplified
  <br>
  <small>Made with ❤️ for investors everywhere</small>
</p>
