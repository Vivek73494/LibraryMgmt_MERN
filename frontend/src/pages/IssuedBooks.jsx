import React, { useState, useEffect } from 'react';
import { fetchBorrowRecords, returnBook } from '../services/api';

const IssuedBooks = ({ setActiveTab }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'Issued', 'Returned'
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [returnConfirmModal, setReturnConfirmModal] = useState({ open: false, record: null });

  const loadRecords = async () => {
    try {
      setLoading(true);
      const res = await fetchBorrowRecords();
      if (res.success) {
        setRecords(res.data);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to fetch borrowing records',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleReturnClick = (record) => {
    if (record.status === 'Returned') {
      setFeedback({ type: 'error', message: 'This book has already been returned!' });
      return;
    }
    setReturnConfirmModal({ open: true, record });
  };

  const handleConfirmReturn = async () => {
    if (!returnConfirmModal.record) return;
    setFeedback({ type: '', message: '' });

    try {
      const res = await returnBook(returnConfirmModal.record._id);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Book "${returnConfirmModal.record.bookId?.title || 'Book'}" has been marked as returned! Stock updated.`,
        });
        setReturnConfirmModal({ open: false, record: null });
        loadRecords();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to process return',
      });
      setReturnConfirmModal({ open: false, record: null });
    }
  };

  const filteredRecords = records.filter((r) => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Issued Books & Returns</h1>
          <p className="page-subtitle">Track issued books and process returns</p>
        </div>
        <button className="btn btn-primary" onClick={() => setActiveTab('issue')}>
          📤 Issue Another Book
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

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All Records ({records.length})
        </button>
        <button
          className={`filter-tab ${filter === 'Issued' ? 'active' : ''}`}
          onClick={() => setFilter('Issued')}
        >
          Currently Issued ({records.filter((r) => r.status === 'Issued').length})
        </button>
        <button
          className={`filter-tab ${filter === 'Returned' ? 'active' : ''}`}
          onClick={() => setFilter('Returned')}
        >
          Returned ({records.filter((r) => r.status === 'Returned').length})
        </button>
      </div>

      {/* Records Table */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading borrowing history...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No records found</h3>
          <p>
            {filter === 'ALL'
              ? 'No books have been issued yet.'
              : `No records currently in "${filter}" status.`}
          </p>
          <button className="btn btn-primary" onClick={() => setActiveTab('issue')}>
            📤 Issue First Book
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Book Title</th>
                <th>ISBN</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => {
                const isReturned = record.status === 'Returned';
                return (
                  <tr key={record._id}>
                    <td>{index + 1}</td>
                    <td className="font-semibold">{record.studentName}</td>
                    <td><code>{record.studentRollNumber}</code></td>
                    <td>
                      {record.bookId ? (
                        <div>
                          <div className="font-semibold">{record.bookId.title}</div>
                          <div className="text-muted text-xs">by {record.bookId.author}</div>
                        </div>
                      ) : (
                        <span className="text-muted">[Deleted Book]</span>
                      )}
                    </td>
                    <td><code>{record.bookId?.ISBN || '—'}</code></td>
                    <td>{formatDate(record.issueDate)}</td>
                    <td>{formatDate(record.returnDate)}</td>
                    <td>
                      <span className={`badge ${isReturned ? 'badge-returned' : 'badge-issued'}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>
                      {isReturned ? (
                        <span className="text-muted text-sm font-semibold">✅ Completed</span>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleReturnClick(record)}
                        >
                          ↩️ Return Book
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Return Confirmation Modal */}
      {returnConfirmModal.open && (
        <div className="modal-backdrop">
          <div className="modal-content modal-sm">
            <div className="modal-header">
              <h2>↩️ Confirm Book Return</h2>
              <button
                className="modal-close"
                onClick={() => setReturnConfirmModal({ open: false, record: null })}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>
                Confirm return of <strong>"{returnConfirmModal.record?.bookId?.title || 'Book'}"</strong>?
              </p>
              <div className="return-meta mt-2">
                <div><strong>Student:</strong> {returnConfirmModal.record?.studentName}</div>
                <div><strong>Roll No:</strong> {returnConfirmModal.record?.studentRollNumber}</div>
              </div>
              <p className="text-muted text-sm mt-3">
                This will mark the record as Returned and increase the available book quantity by 1.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setReturnConfirmModal({ open: false, record: null })}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleConfirmReturn}
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuedBooks;
