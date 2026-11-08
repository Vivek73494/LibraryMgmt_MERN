const { useState, useEffect } = React;

function App() {
  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const loadData = () => {
    fetch('http://localhost:5000/api/books')
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch(() => {});

    fetch('http://localhost:5000/api/issued')
      .then((res) => res.json())
      .then((data) => setIssuedBooks(data))
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIssue = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !rollNumber.trim() || !selectedBook) {
      setMessage('Please enter all details.');
      setIsError(true);
      return;
    }

    fetch('http://localhost:5000/api/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: studentName.trim(),
        rollNumber: rollNumber.trim(),
        bookTitle: selectedBook,
        issueDate
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBooks(data.books);
          setIssuedBooks(data.issuedBooks);
          setMessage(data.message);
          setIsError(false);
          setStudentName('');
          setRollNumber('');
          setSelectedBook('');
        } else {
          setMessage(data.message);
          setIsError(true);
        }
      })
      .catch(() => {
        setMessage('Failed to connect to backend.');
        setIsError(true);
      });
  };

  const handleReturn = (id) => {
    fetch('http://localhost:5000/api/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBooks(data.books);
          setIssuedBooks(data.issuedBooks);
          setMessage(data.message);
          setIsError(false);
        } else {
          setMessage(data.message);
          setIsError(true);
        }
      })
      .catch(() => {
        setMessage('Failed to connect to backend.');
        setIsError(true);
      });
  };

  return (
    <div className="container">
      <h1>Library Management System</h1>

      <h2>Issue Book</h2>
      {message && <p className={isError ? 'message-error' : 'message-success'}>{message}</p>}
      <form onSubmit={handleIssue}>
        <div className="form-group">
          <label>Student Name:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter Student Name"
          />
        </div>
        <div className="form-group">
          <label>Roll Number:</label>
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            placeholder="Enter Roll Number"
          />
        </div>
        <div className="form-group">
          <label>Book Name:</label>
          <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}>
            <option value="">Select a book</option>
            {books.map((book) => (
              <option key={book.id} value={book.title} disabled={book.available <= 0}>
                {book.title} (Available: {book.available})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Issue Date:</label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
        </div>
        <button type="submit">Issue Book</button>
      </form>

      <h2>Issued Books</h2>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Student Name</th>
            <th>Roll Number</th>
            <th>Book Name</th>
            <th>Issue Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {issuedBooks.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No books issued yet.</td>
            </tr>
          ) : (
            issuedBooks.map((record, index) => (
              <tr key={record.id}>
                <td>{index + 1}</td>
                <td>{record.studentName}</td>
                <td>{record.rollNumber}</td>
                <td>{record.bookTitle}</td>
                <td>{record.issueDate}</td>
                <td>
                  <button className="return-btn" onClick={() => handleReturn(record.id)}>
                    Return
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2>Books List</h2>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Book Name</th>
            <th>Total Copies</th>
            <th>Available Copies</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={book.id}>
              <td>{index + 1}</td>
              <td>{book.title}</td>
              <td>{book.total}</td>
              <td>{book.available}</td>
              <td>{book.available > 0 ? 'Available' : 'Out of Stock'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
