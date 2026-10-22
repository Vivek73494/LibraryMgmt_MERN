import React, { useState, useEffect } from 'react';
import { fetchBooks, issueBook } from '../services/api';

const IssueBook = ({ setActiveTab }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    studentRollNumber: '',
    bookId: '',
    issueDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  });

  const loadBooks = async () => {
    try {
      setLoading(true);
      const res = await fetchBooks();
      if (res.success) {
        setBooks(res.data);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to load books catalog',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    if (!formData.studentName.trim() || !formData.studentRollNumber.trim() || !formData.bookId) {
      setFeedback({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    const selectedBook = books.find((b) => b._id === formData.bookId);
    if (!selectedBook) {
      setFeedback({ type: 'error', message: 'Selected book not found' });
      return;
    }

    if (selectedBook.availableQuantity <= 0) {
      setFeedback({
        type: 'error',
        message: `Cannot issue "${selectedBook.title}". No copies are currently available in the library!`,
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await issueBook(formData);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Book "${selectedBook.title}" issued successfully to ${formData.studentName} (Roll No: ${formData.studentRollNumber})!`,
        });
        // Reset form
        setFormData({
          studentName: '',
          studentRollNumber: '',
          bookId: '',
          issueDate: new Date().toISOString().split('T')[0],
        });
        // Refresh books list to reflect updated available quantity
        loadBooks();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to issue book',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedBook = books.find((b) => b._id === formData.bookId);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Issue Book to Student</h1>
          <p className="page-subtitle">Assign an available library book to a student</p>
        </div>
        <button className="btn btn-secondary" onClick={() => setActiveTab('issued')}>
          📋 View Issued Records
        </button>
      </div>

      {feedback.message && (
        <div className={`alert alert-${feedback.type}`}>
          <span>{feedback.message}</span>
          <button className="alert-close" onClick={() => setFeedback({ type: '', message: '' })}>
            &times;
          </button>
        </div>
      )}

      <div className="card-form-container">
        <form onSubmit={handleSubmit} className="standard-form">
          <div className="form-group">
            <label htmlFor="studentName">Student Full Name *</label>
            <input
              id="studentName"
              type="text"
              name="studentName"
              className="form-control"
              placeholder="e.g. Rahul Sharma"
              value={formData.studentName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="studentRollNumber">Student Roll Number / Enrollment ID *</label>
            <input
              id="studentRollNumber"
              type="text"
              name="studentRollNumber"
              className="form-control"
              placeholder="e.g. MCA2024001"
              value={formData.studentRollNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bookId">Select Book to Issue (Grouped by Section) *</label>
            {loading ? (
              <p className="text-muted">Loading available books from all sections...</p>
            ) : books.length === 0 ? (
              <p className="text-danger">No books available in library catalog. Please add books first.</p>
            ) : (
              <select
                id="bookId"
                name="bookId"
                className="form-control"
                value={formData.bookId}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose a book to issue (64 books across 8 sections) --</option>
                {/* Group books by section */}
                {Object.entries(
                  books.reduce((acc, book) => {
                    const sec = book.section || book.category || 'General';
                    if (!acc[sec]) acc[sec] = [];
                    acc[sec].push(book);
                    return acc;
                  }, {})
                ).sort(([a], [b]) => a.localeCompare(b)).map(([secName, secBooks]) => (
                  <optgroup key={secName} label={`📁 SECTION: ${secName} (${secBooks.length} titles)`}>
                    {secBooks.map((b) => (
                      <option
                        key={b._id}
                        value={b._id}
                        disabled={b.availableQuantity <= 0}
                      >
                        {b.title} — by {b.author} [Avail: {b.availableQuantity}/{b.quantity}]
                        {b.availableQuantity <= 0 ? ' (OUT OF STOCK)' : ''}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </div>

          {selectedBook && (
            <div className={`book-status-banner ${selectedBook.availableQuantity > 0 ? 'status-ok' : 'status-warn'}`}>
              <div>
                <strong>Selected Book:</strong> {selectedBook.title}
              </div>
              <div>
                <strong>Section:</strong> <span className="badge badge-category">{selectedBook.section || selectedBook.category}</span>
              </div>
              <div className="mt-1">
                <strong>Author:</strong> {selectedBook.author} | <strong>ISBN:</strong> {selectedBook.ISBN}
              </div>
              <div className="mt-1">
                <strong>Available Stock:</strong> {selectedBook.availableQuantity} of {selectedBook.quantity} copies
              </div>
              {selectedBook.availableQuantity <= 0 && (
                <div className="text-danger mt-1">
                  ⚠️ This book cannot be issued right now because all copies are currently checked out.
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="issueDate">Issue Date *</label>
            <input
              id="issueDate"
              type="date"
              name="issueDate"
              className="form-control"
              value={formData.issueDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={submitting || (selectedBook && selectedBook.availableQuantity <= 0)}
            >
              {submitting ? 'Issuing Book...' : '📤 Confirm & Issue Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueBook;
