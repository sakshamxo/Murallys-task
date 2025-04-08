# ✈️ Travel Booking System

A full-stack web application for a **Home Repair & Travel Package Booking System** built using the **MERN Stack** with **real-time updates**, **role-based dashboards**, and **Razorpay payment integration**.

This app includes separate dashboards and flows for:
- **Customers** (search & book travel packages)
- **Agents** (add & manage travel packages, confirm bookings)

---

## 🚀 Implemented Features

1. ✅ **Agent Flow**  
   - Agents can **sign up**, **log in**, and **add travel packages** with destination, price, and description.

2. ✅ **Customer Flow**  
   - Customers can **sign up**, **log in**, and **view packages** based on their city.
   - Customers can **book a package anonymously** (without seeing agent details).

3. ✅ **Secure Bookings & Payments**  
   - **Booking and payment** are handled through the system.
   - No direct interaction between customers and agents.

4. ✅ **Real-Time Package Updates**  
   - When an agent adds a package, it **instantly appears** on the customer’s dashboard via **WebSockets**.

5. ✅ **Geolocation-Based Filtering**  
   - Customers **only see packages** uploaded by agents from **their city**.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js + Vite
- Tailwind CSS
- Socket.IO Client
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Socket.IO Server
- Razorpay Integration

---

## 📁 Folder Structure

### Frontend (`frontend/`)
<pre>
frontend/
└── src/
    ├── assets/
    ├── components/
    ├── context/
    ├── hooks/
    ├── pages/
    │   ├── AgentDashboard.jsx
    │   ├── CustomerDashboard.jsx
    │   ├── RegisterAgent.jsx
    │   └── RegisterCustomer.jsx
    ├── services/
    │   └── bookingService.js
    ├── utils/
    ├── App.jsx
    ├── main.jsx
    └── router.jsx
</pre>

### Backend (`backend/`)
<pre>
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── agentController.js
│   ├── authController.js
│   └── bookingController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── agentModel.js
│   ├── bookingModel.js
│   └── userModel.js
├── routes/
│   ├── agentRoutes.js
│   ├── authRoutes.js
│   └── bookingRoutes.js
├── utils/
│   └── razorpay.js
└── server.js
</pre>

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/sakshamxo/Murallys-task.git
cd travel-booking

2. Install Dependencies

Backend
bash

cd backend
npm install

Frontend
bash

cd ../frontend
npm install

3. Setup Environment Variables
Create a .env file in the backend/ folder with the following:

env

MONGO_URI=mongodb+srv://saksham:saksham@cluster0.zumas.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_very_strong_secret_key_123!@$_MY_SECRET
RAZORPAY_KEY_ID=rzp_test_5uDETacosZciqr
RAZORPAY_KEY_SECRET=XJciCscAT1rkgwGlrsMonKo8
OPENCAGE_API_KEY =766f37051eac4920ade837c5966d5dd4

4. Run the App

Start Backend:
bash

cd backend
npm run start

Start Frontend:
bash

cd frontend
npm run dev

📬 Contact
Developer: Saksham Soni
📧 Email: msakshams24@gmail.com
🌐 Portfolio: portfolio-zeta-opal-71.vercel.app

⭐️ Show your support
If you like this project, don’t forget to give it a ⭐️ on GitHub!

🪪 License
This project is licensed under the MIT License.
