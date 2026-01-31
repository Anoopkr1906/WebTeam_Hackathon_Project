# Web Team Induction Hackathon Project

## This system models real evidence lifecycle — from seizure to disposal — while maintaining chain of custody logs and state transitions. I designed separate collections for cases, properties, custody logs, and disposal records to maintain data integrity.

# Digital e-Malkhana 🚓📦

**Digital e-Malkhana** is a MERN-stack web application designed to digitize the management of seized evidence (Malkhana) for police stations. It simulates the real-world lifecycle of evidence from seizure to disposal, ensuring a secure and transparent Chain of Custody.

## 🚀 Key Features

### 1. 🔐 Role-Based Authentication
*   **Police (Admin/Officer)**: Full access to create cases, manage evidence, transfer custody, and dispose items.
*   **User (Public/View-only)**: Restricted access to search and view case status.

### 2. 📊 Interactive Dashboard
*   Real-time statistics: **Total Cases**, **Pending**, and **Disposed**.
*   View recent case activity at a glance.

### 3. 📝 Smart Case Entry
*   **Multi-step Wizard**: Streamlined process to register FIR details and Property info.
*   **Cloud Storage**: Evidence images uploaded securely to **Cloudinary**.
*   **Auto-QR Generation**: Generates a unique QR code for every seized item for easy tracking.

### 4. 🔗 Chain of Custody (Track & Trace)
*   **Visual Timeline**: A clear vertical timeline showing every movement of the evidence (e.g., Storage → Court → Lab).
*   **Custody Updates**: Officers can log transfers with remarks and locations.

### 5. 🗑️ Disposal Management
*   Structured process to dispose of evidence (Returned, Destroyed, Auctioned).
*   Automatically closes the case and updates inventory.

---

## 🛠️ Tech Stack

*   **Frontend**: React.js (Vite), React Router, Vanilla CSS (Glassmorphism UI).
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose).
*   **Utilities**: 
    *   **Cloudinary**: Image storage.
    *   **QRCode**: QR code generation.
    *   **JWT**: Secure authentication.

---

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js installed.
*   MongoDB installed and running locally (or a MongoDB Atlas URI).
*   Cloudinary Account (Cloud Name, API Key, API Secret).

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Web team Project"
```

### 2. Backend Setup
```bash
cd backend
npm install
```
*   Create a `.env` file in the `backend` folder:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/emalkhana
    JWT_SECRET=your_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```
*   Run the server:
    ```bash
    npm run dev
    # or
    npm start
    ```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Running the App
The database is initially empty.
1.  Navigate to the **Login Page**.
2.  Click **"Register here"** to create a new Police or User account.
3.  Log in with your new credentials.

---

## 📸 Screenshots
*(Add screenshots of your Dashboard, Case Entry, and Timeline here)*

---

**Built for NIT Jamshedpur Web Team Induction Hackathon**