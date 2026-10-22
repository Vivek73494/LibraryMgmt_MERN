import React, { useState, useEffect } from 'react';
import { fetchBooks, fetchSections, createBook, updateBook, deleteBook } from '../services/api';

const DEFAULT_SECTIONS = [
  'Computer Science & Programming',
  'Artificial Intelligence & Machine Learning',
  'Data Science & Big Data',
  'Web Development & Cloud Computing',
  'Cybersecurity & Networking',
  'Database Systems & Architecture',
  'Mathematics & Discrete Algorithms',
  'Business, Management & Startups'
];

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isCustomSection, setIsCustomSection] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    ISBN: '',
    section: DEFAULT_SECTIONS[0],
    category: DEFAULT_SECTIONS[0],
    quantity: 1,
  });

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, book: null });

  const loadSections = async () => {
    try {
      const res = await fetchSections();
      if (res.success) {
        setSections(res.data);
      }
    } catch (err) {
      console.error('Failed to load sections:', err);
    }
  };

  const loadBooks = async (searchTerm = search, sectionFilter = selectedSection) => {
    try {
      setLoading(true);
      const res = await fetchBooks(searchTerm, sectionFilter);
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
    loadSections();
    loadBooks('', 'ALL');
  }, []);

  const handleSectionChange = (sectionName) => {
    setSelectedSection(sectionName);
    loadBooks(search, sectionName);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadBooks(search, selectedSection);
  };

  const handleSearchReset = () => {
    setSearch('');
    loadBooks('', selectedSection);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setIsCustomSection(false);
    setFormData({
      title: '',
      author: '',
      ISBN: '',
      section: DEFAULT_SECTIONS[0],
      category: DEFAULT_SECTIONS[0],
      quantity: 5,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setIsEditing(true);
    setEditingId(book._id);
    const bookSec = book.section || book.category || DEFAULT_SECTIONS[0];
    const isCustom = !DEFAULT_SECTIONS.includes(bookSec);
    setIsCustomSection(isCustom);
    setFormData({
      title: book.title,
      author: book.author,
      ISBN: book.ISBN,
      section: bookSec,
      category: bookSec,
      quantity: book.quantity,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'sectionSelect') {
      if (value === '__CUSTOM__') {
        setIsCustomSection(true);
        setFormData((prev) => ({ ...prev, section: '', category: '' }));
      } else {
        setIsCustomSection(false);
        setFormData((prev) => ({ ...prev, section: value, category: value }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'quantity' ? Number(value) : value,
        ...(name === 'section' ? { category: value } : {}),
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    const finalSection = (formData.section || formData.category || '').trim();

    if (!formData.title.trim() || !formData.author.trim() || !formData.ISBN.trim() || !finalSection) {
      setFeedback({ type: 'error', message: 'Please fill in all required fields (Title, Author, ISBN, Section)' });
      return;
    }

    if (formData.quantity < 1) {
      setFeedback({ type: 'error', message: 'Total quantity must be at least 1' });
      return;
    }

    const payload = {
      ...formData,
      section: finalSection,
      category: finalSection,
    };

    try {
      if (isEditing) {
        const res = await updateBook(editingId, payload);
        if (res.success) {
          setFeedback({ type: 'success', message: 'Book updated successfully!' });
          closeModal();
          loadBooks();
          loadSections();
        }
      } else {
        const res = await createBook(payload);
        if (res.success) {
          setFeedback({ type: 'success', message: 'Book added to catalog successfully!' });
          closeModal();
          loadBooks();
          loadSections();
        }
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Operation failed. Please try again.',
      });
    }
  };

  const confirmDelete = (book) => {
    setDeleteModal({ open: true, book });
  };

  const handleDeleteBook = async () => {
    if (!deleteModal.book) return;
    setFeedback({ type: '', message: '' });

    try {
      const res = await deleteBook(deleteModal.book._id);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Book deleted successfully!' });
        setDeleteModal({ open: false, book: null });
        loadBooks();
        loadSections();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete book',
      });
      setDeleteModal({ open: false, book: null });
    }
  };

  // Compute total books count across all sections
  const totalBooksCount = sections.reduce((acc, curr) => acc + curr.count, 0) || books.length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Books</h1>
          <p className="page-subtitle">Organized by academic sections (around 7–10 books per section)</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          ➕ Add New Book
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

      {/* Section Filter Pills */}
      <div className="section-pills-container">
        <div className="section-pills-header">
          <span className="section-pills-label">📂 Browse by Section:</span>
          {selectedSection !== 'ALL' && (
            <button className="btn-link" onClick={() => handleSectionChange('ALL')}>
              Show All Sections
            </button>
          )}
        </div>
        <div className="filter-tabs section-tabs">
          <button
            className={`filter-tab ${selectedSection === 'ALL' ? 'active' : ''}`}
            onClick={() => handleSectionChange('ALL')}
          >
            All Sections ({totalBooksCount})
          </button>
          {sections.map((sec) => (
            <button
              key={sec.name}
              className={`filter-tab ${selectedSection === sec.name ? 'active' : ''}`}
              onClick={() => handleSectionChange(sec.name)}
            >
              {sec.name} ({sec.count})
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar & Section Dropdown Filter */}
      <div className="search-bar-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            className="input-search"
            placeholder="Search books by title, author, or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input-select-section"
            value={selectedSection}
            onChange={(e) => handleSectionChange(e.target.value)}
          >
            <option value="ALL">All Sections</option>
            {sections.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} ({s.count})
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-secondary">
            🔍 Search
          </button>
          {(search || selectedSection !== 'ALL') && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setSearch('');
                handleSectionChange('ALL');
              }}
            >
              Reset Filters
            </button>
          )}
        </form>
      </div>

      {/* Current Active Filter Indicator */}
      {selectedSection !== 'ALL' && (
        <div className="active-filter-banner">
          <span>
            Showing books in Section: <strong>{selectedSection}</strong> ({books.length} books found)
          </span>
          <button className="btn-link" onClick={() => handleSectionChange('ALL')}>
            View All Sections
          </button>
        </div>
      )}

      {/* Books Table */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading books list...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <h3>No books found</h3>
          <p>
            {search
              ? 'No books matched your search query in this section.'
              : selectedSection !== 'ALL'
              ? `No books currently found in section "${selectedSection}".`
              : 'The library catalog is currently empty. Add your first book!'}
          </p>
          {search || selectedSection !== 'ALL' ? (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearch('');
                handleSectionChange('ALL');
              }}
            >
              Clear All Filters
            </button>
          ) : (
            <button className="btn btn-primary" onClick={openAddModal}>
              ➕ Add First Book
            </button>
          )}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Section</th>
                <th>Total Qty</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book._id}>
                  <td>{index + 1}</td>
                  <td className="font-semibold">{book.title}</td>
                  <td>{book.author}</td>
                  <td><code>{book.ISBN}</code></td>
                  <td>
                    <span
                      className="badge badge-category cursor-pointer"
                      onClick={() => handleSectionChange(book.section || book.category)}
                      title={`Filter by section "${book.section || book.category}"`}
                    >
                      {book.section || book.category}
                    </span>
                  </td>
                  <td>{book.quantity}</td>
                  <td>
                    <span className={`badge ${book.availableQuantity > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {book.availableQuantity} / {book.quantity}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => openEditModal(book)}
                        title="Edit Book"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => confirmDelete(book)}
                        title="Delete Book"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Book Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditing ? '✏️ Edit Book Details' : '➕ Add New Book'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-group">
                <label>Book Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g. Operating System Concepts"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Author *</label>
                <input
                  type="text"
                  name="author"
                  className="form-control"
                  placeholder="e.g. Silberschatz & Galvin"
                  value={formData.author}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ISBN Number *</label>
                  <input
                    type="text"
                    name="ISBN"
                    className="form-control"
                    placeholder="e.g. 978-1118063330"
                    value={formData.ISBN}
                    onChange={handleFormChange}
                    required
                  />
                  <small className="form-help">Must be unique for each book.</small>
                </div>

                <div className="form-group">
                  <label>Section / Category *</label>
                  <select
                    name="sectionSelect"
                    className="form-control"
                    value={isCustomSection ? '__CUSTOM__' : (formData.section || DEFAULT_SECTIONS[0])}
                    onChange={handleFormChange}
                  >
                    {DEFAULT_SECTIONS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                    <option value="__CUSTOM__">➕ Other / Custom Section...</option>
                  </select>
                </div>
              </div>

              {isCustomSection && (
                <div className="form-group">
                  <label>Custom Section Name *</label>
                  <input
                    type="text"
                    name="section"
                    className="form-control"
                    placeholder="e.g. Mobile Application Development"
                    value={formData.section}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Total Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  className="form-control"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Update Book' : 'Save Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="modal-backdrop">
          <div className="modal-content modal-sm">
            <div className="modal-header">
              <h2>⚠️ Confirm Book Deletion</h2>
              <button className="modal-close" onClick={() => setDeleteModal({ open: false, book: null })}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete <strong>"{deleteModal.book?.title}"</strong>?
              </p>
              <p className="text-muted text-sm mt-2">
                Note: Books currently issued to students cannot be deleted.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteModal({ open: false, book: null })}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteBook}
              >
                Yes, Delete Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
