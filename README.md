# 💰 Credit – Personal & Group Finance Tracker

[![GitHub last commit](https://img.shields.io/github/last-commit/pankajpareek026/credit)](https://github.com/pankajpareek026/credit/commits/main)
[![GitHub language count](https://img.shields.io/github/languages/count/pankajpareek026/credit)](https://github.com/pankajpareek026/credit)
[![GitHub top language](https://img.shields.io/github/languages/top/pankajpareek026/credit)](https://github.com/pankajpareek026/credit)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fcreditc.vercel.app)](https://creditc.vercel.app/)

**A powerful and user-friendly web application for effortlessly tracking transactions between friends and family, while simplifying personal finance management.** With an intuitive interface, interactive features, and collaborative capabilities, Credit provides a seamless financial tracking experience for groups and individuals alike.

🔗 **Live Demo:** [creditc.vercel.app](https://creditc.vercel.app/)

> 🧪 **Test Credentials:**  
> Email: `credit@gmail.com`  
> Password: `1234#@New`

---

## 📌 Overview

Credit is a full‑stack MERN application that solves the common challenge of tracking shared expenses and personal finances. Whether you're splitting a dinner bill with friends, managing household expenses, or tracking your personal spending, Credit makes it simple and transparent.

**Core Capabilities:**
- **Personal Finance Tracking** – Log income and expenses with categories
- **Group Expense Management** – Share transactions with friends and family
- **Collaborative Tracking** – Multiple users can view and manage shared transactions
- **Visual Analytics** – Interactive charts and dashboards for spending insights
- **User Profiles** – Personalized accounts with secure authentication

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **🔐 Secure Authentication** | JWT-based authentication with protected routes |
| **📝 Transaction Management** | Add, edit, and delete transactions with categories |
| **👥 Group Sharing** | Share transaction details with multiple users |
| **📊 Interactive Dashboard** | Visual overview of spending with Chart.js integration |
| **📱 Responsive Design** | Optimized for desktop and mobile devices |
| **👤 User Profiles** | Personalized user accounts and settings |
| **📈 Transaction History** | Complete log of all financial activities |
| **🏷️ Category Tracking** | Organize transactions by custom categories |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js
- **Language:** JavaScript (66.6%)
- **Styling:** CSS (32.2%)
- **Charts:** Chart.js
- **Icons:** React Icons
- **Notifications:** React Toastify

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)

### DevOps & Tooling
- **Package Manager:** npm
- **Version Control:** Git
- **Deployment:** Vercel (frontend) / Render / Cyclic (backend)

---

## 📁 Project Structure

```text
credit/
├── api/                        # Backend application
│   ├── controllers/            # Request handlers and business logic
│   ├── db/                     # Database configuration
│   │   └── config.js           # MongoDB connection setup
│   ├── models/                 # Mongoose models
│   │   ├── Transaction.js      # Transaction schema
│   │   └── User.js             # User schema
│   ├── routes/                 # API route definitions
│   ├── middleware/             # Custom middleware (auth, validation)
│   ├── index.js                # Backend entry point
│   └── package.json            # Backend dependencies
├── src/                        # Frontend application (React)
│   ├── components/             # Reusable React components
│   ├── pages/                  # Page components
│   ├── context/                # React Context for state management
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   ├── App.js                  # Main application component
│   └── index.js                # Frontend entry point
├── public/                     # Static assets
├── .gitignore                  # Git ignored files
├── index.js                    # Root entry (if applicable)
├── package.json                # Frontend dependencies
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** – v14.x or higher (v16+ recommended)
- **MongoDB** – local instance or MongoDB Atlas (cloud)
- **npm** – package manager

### Environment Variables

#### Backend Configuration (`api/.env`)

Create a `.env` file in the `api/` directory with the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/credit` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_secure_jwt_secret_key` |
| `NODE_ENV` | Environment mode | `development` or `production` |

> ⚠️ **Never commit the `.env` file.** Add it to `.gitignore` to keep your secrets safe.

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:pankajpareek026/credit.git
   cd credit
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd api
   npm install
   cd ..
   ```

4. **Configure MongoDB**
   
   **Option 1: Local MongoDB**
   - Install MongoDB locally
   - Start MongoDB service
   - Update connection string in `api/db/config.js`

   **Option 2: MongoDB Atlas (Recommended)**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster
   - Get your connection string
   - Update `api/db/config.js` with your Atlas URI

5. **Configure Database Connection**
   
   Open `api/db/config.js` and update the connection string:
   ```javascript
   const mongoose = require('mongoose');
   const url = 'YOUR_MONGODB_CONNECTION_STRING'; // Replace with your URI
   const connectionParams = {
     useNewUrlParser: true,
     useUnifiedTopology: true
   };
   mongoose.connect(url, connectionParams)
     .then(() => console.log("DB > connected"))
     .catch((err) => console.info("ERR: ", err));
   ```

6. **Start the application**

   **Start both servers (React + Node) from the root directory:**
   ```bash
   npm run start
   ```

   **Or start them separately:**

   *Frontend (from root directory):*
   ```bash
   npm start
   ```

   *Backend (from `api/` directory):*
   ```bash
   cd api
   npm run start
   ```

7. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

---

## 📖 API Documentation

The backend provides RESTful API endpoints for:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/transactions` | GET | Get all transactions |
| `/api/transactions` | POST | Create a new transaction |
| `/api/transactions/:id` | PUT | Update a transaction |
| `/api/transactions/:id` | DELETE | Delete a transaction |
| `/api/transactions/share` | POST | Share transaction with other users |
| `/api/user/profile` | GET | Get user profile |
| `/api/user/profile` | PUT | Update user profile |

> 📝 All protected routes require a valid JWT token in the `Authorization` header.

---

## 🔒 Security Features

- **JWT-based authentication** – Stateless, secure token-based auth
- **Password hashing** – bcrypt for secure password storage
- **Protected routes** – All API endpoints require authentication
- **Environment variable configuration** – All secrets stored in `.env`
- **Input validation** – Sanitized and validated user inputs

---

## 📸 Screenshots

- **Home Page** – Landing and overview
- **Dashboard** – Visual spending analytics with Chart.js
- **Add Transaction** – Intuitive transaction creation
- **Transactions Detail** – Complete transaction history
- **Share Transaction** – Collaborative expense sharing

---

## 🚀 Deployment

### Frontend (Vercel)

1. Push your code to a GitHub repository
2. Import the project into [Vercel](https://vercel.com)
3. Vercel automatically detects React and sets up the build
4. Deploy – your frontend will be live in minutes

**Live Demo:** [creditc.vercel.app](https://creditc.vercel.app)

### Backend (Render / Cyclic / Heroku)

1. Push your code to a GitHub repository
2. Set the required environment variables in your hosting platform
3. Use the following commands:
   ```bash
   cd api
   npm install
   npm start
   ```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code adheres to the existing style and includes relevant documentation updates.

---

## 📄 License

This project is currently **unlicensed**. All rights reserved.  
For usage rights or collaboration inquiries, please contact the author.

---

## 👤 Author

**Pankaj Pareek**

- GitHub: [pankajpareek026](https://github.com/pankajpareek026)
- Project Link: [https://github.com/pankajpareek026/credit](https://github.com/pankajpareek026/credit)

---

## 🙏 Acknowledgements

- [React.js](https://reactjs.org/) – UI library
- [Node.js](https://nodejs.org/) – JavaScript runtime
- [Express.js](https://expressjs.com/) – Web framework
- [MongoDB](https://www.mongodb.com/) – Database
- [Mongoose](https://mongoosejs.com/) – MongoDB ODM
- [JWT](https://jwt.io/) – JSON Web Tokens
- [Chart.js](https://www.chartjs.org/) – Interactive charts
- [React Toastify](https://fkhadra.github.io/react-toastify/) – Notifications
- [Vercel](https://vercel.com/) – Frontend hosting

---

## 🏷️ Topics

`react` `nodejs` `express` `mongodb` `mongoose` `jwt` `mern` `finance-tracker` `expense-tracker` `money-tracker` `group-expenses` `personal-finance` `chartjs` `rest-api`
