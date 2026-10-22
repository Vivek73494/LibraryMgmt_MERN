# Simple Library Management System (MERN Stack)

A complete, clean, and working Library Management System developed for an MCA college project using the **MERN (MongoDB, Express.js, React.js, Node.js)** stack.

---

## 🚀 Features

### 1. Dashboard
- **Total Unique Books:** Count of distinct titles in the library catalog (64 books).
- **Book Sections:** 8 distinct academic sections with around 7 to 10 books per section.
- **Academic Sections Breakdown:** Visual cards showing each section, book count, and available copies.
- **Total Available Copies:** Real-time count of book copies currently available on shelves.
- **Currently Issued Copies:** Number of books currently borrowed by students.
- **Total Borrowing Records:** Historical log of all borrowings and returns.
- *All statistics are dynamically calculated from the MongoDB database.*

### 2. Manage Books (Organized by Academic Sections)
- **8 Dedicated Sections (8 books in each section):**
  1. `Computer Science & Programming` (8 books)
  2. `Artificial Intelligence & Machine Learning` (8 books)
  3. `Data Science & Big Data` (8 books)
  4. `Web Development & Cloud Computing` (8 books)
  5. `Cybersecurity & Networking` (8 books)
  6. `Database Systems & Architecture` (8 books)
  7. `Mathematics & Discrete Algorithms` (8 books)
  8. `Business, Management & Startups` (8 books)
- **Section Filter Pills:** Quick one-click tabs to view books by section with real-time count tags.
- **Section & Search Filtering:** Filter by section, search by title, author, or ISBN.
- **Add / Edit with Section Selector:** Choose from standard library sections or input a custom section.
- **Stock Tracking & Safe Deletion:** Automatic duplicate ISBN prevention and deletion guards.

### 3. Issue Book
- **Section Grouping in Selector:** Books in the issue dropdown are organized by section (`<optgroup>`).
- Issue available books to students with Student Name and Roll Number.
- Checks availability in real time and decrements stock upon confirmation.

### 4. Issued Records & Returns
- View all borrow records with student details, book info, issue date, and return status.
- Filter records by: **All**, **Currently Issued**, and **Returned**.
- One-click **Return Book** action that updates the record and automatically increments available stock.
- Prevents returning the same record twice.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Axios, Custom Clean CSS
- **Backend:** Node.js, Express.js, Mongoose, CORS, Dotenv
- **Database:** MongoDB Atlas (Cloud)

---

## 📁 Project Structure

```
c:\LibraryManagement_MernStack\
├── backend/
│   ├── controllers/
│   │   ├── bookController.js       # Book CRUD and validation logic
│   │   ├── borrowController.js     # Issue and Return logic with quantity updates
│   │   └── dashboardController.js  # Real-time statistics aggregation
│   ├── models/
│   │   ├── Book.js                 # Book Mongoose schema
│   │   └── BorrowRecord.js         # BorrowRecord Mongoose schema
│   ├── routes/
│   │   ├── bookRoutes.js           # /api/books routes
│   │   ├── borrowRoutes.js         # /api/borrow routes
│   │   └── dashboardRoutes.js      # /api/dashboard route
│   ├── .env                        # Environment variables (PORT, MONGO_URI)
│   ├── package.json
│   └── server.js                   # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx          # Top navigation bar
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Real-time statistics dashboard
│   │   │   ├── ManageBooks.jsx     # Add, search, edit, delete books
│   │   │   ├── IssueBook.jsx       # Issue book to student form
│   │   │   └── IssuedBooks.jsx     # Records table & return handler
│   │   ├── services/
│   │   │   └── api.js              # Axios REST API client
│   │   ├── App.jsx                 # Main layout and tab router
│   │   ├── App.css                 # Clean, modern UI styling
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- Internet connection for MongoDB Atlas access

---

## 🏃 Setup & Running Instructions

### 1. Backend Setup

Open a terminal and navigate to the `backend` folder:

```bash
cd backend
npm install
```

Configure your environment variables in `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://vivek:Vivek%402004@cluster1.r5nza1p.mongodb.net/library_db?retryWrites=true&w=majority
```

Start the backend server:

```bash
# Optional: To re-seed or reset the 8 sections & 64 books in MongoDB anytime:
npm run seed

# Production / standard mode:
npm start

# Or development mode with auto-reload:
npm run dev
```

The backend server will run on: **`http://localhost:5000`**

---

### 2. Frontend Setup

Open a second terminal and navigate to the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will run on: **`http://localhost:3000`**

---

## 🧪 Testing the APIs & Edge Cases

The project includes an automated test script (`backend/test-api.js`) that verifies:
1. Dashboard calculation from MongoDB
2. Adding new books
3. Duplicate ISBN prevention
4. Book search by author / title
5. Updating book details & safe quantity adjustment
6. Issuing books & decreasing available stock
7. Preventing issuing when copies reach 0
8. Preventing deletion of currently issued books
9. Returning books & restocking available copies
10. Preventing duplicate returns

To execute the test suite:

```bash
cd backend
node test-api.js
```
