# Automatic Certificate Generator

A full-stack web application that automates the creation, management, verification, and distribution of certificates. The system helps organizations generate certificates efficiently from participant data and provides an admin dashboard for managing events, records, and certificate operations.

## Features

* 🔐 Admin authentication and secure dashboard
* 📜 Automatic certificate generation
* 📄 PDF certificate generation
* 📊 Bulk certificate generation using Excel data
* 📧 Automated certificate delivery through email
* 🔍 Certificate verification
* 👥 Participant and record management
* 📅 Event management
* 📋 Email delivery and activity logs
* 📤 Excel data import and export
* 📱 Responsive and user-friendly interface
* 🧪 Automated component testing

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Nodemailer

### Testing & Tools

* Vitest
* React Testing Library
* Git & GitHub
* VS Code

## Project Architecture

```text
Automatic-Certificate-Generator/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
│
├── src/
│   ├── components/
│   ├── __tests__/
│   ├── setupTests.ts
│   └── ...
│
├── public/
├── .gitignore
├── package.json
└── README.md
```

## How It Works

```text
Admin
  │
  ▼
Admin Dashboard
  │
  ├── Create / Manage Events
  │
  ├── Upload Participant Data
  │
  ├── Generate Certificates
  │
  ├── Generate PDF
  │
  └── Send Certificates by Email
              │
              ▼
        Certificate Recipient
              │
              ▼
       Certificate Verification
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Sangeetha-ms5/Automatic-Certificate-Generator.git
```

### 2. Navigate to the project

```bash
cd Automatic-Certificate-Generator
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Install backend dependencies

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
```

**Do not upload `.env` files or passwords/API keys to GitHub.**

## Running the Application

### Start the backend

From the `backend` folder:

```bash
npm start
```

### Start the frontend

Open another terminal in the project root:

```bash
npm run dev
```

The application will then be available through the local development URL shown in the terminal.

## Testing

The project uses **Vitest** and **React Testing Library** for testing.

Run the test suite with:

```bash
npm test
```

Tests cover important components and functionality including:

* Admin login
* Admin header
* Sidebar
* Certificate type selection
* Email automation
* Event management
* Record management
* UI components

## Security

Sensitive configuration values are stored using environment variables and should not be committed to the repository.

The `.gitignore` file excludes files such as:

```text
.env
backend/.env
node_modules/
coverage/
test-report/
dist/
build/
```

## Future Enhancements

* Advanced certificate template customization
* QR-code based certificate verification
* Cloud-based certificate storage
* Role-based access control
* Analytics and reporting dashboard
* Improved email delivery tracking
* Certificate expiration and revocation management

## Author

**Sangeetha M S**

Computer Science and Engineering
BGS Institute of Technology

GitHub: [Sangeetha-ms5](https://github.com/Sangeetha-ms5)

---

⭐ If you find this project useful, consider giving the repository a star!

  # Automatic Certificate Generator System (Copy)

  This is a code bundle for Automatic Certificate Generator System (Copy). The original project is available at https://www.figma.com/design/pAnyffGfdUbnG9qXi8IeGI/Automatic-Certificate-Generator-System--Copy-.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
