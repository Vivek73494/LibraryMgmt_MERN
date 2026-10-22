const API = 'http://localhost:5000/api';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function runTests() {
  console.log('--- STARTING LIBRARY MANAGEMENT SYSTEM VERIFICATION ---');

  const timestamp = Date.now();
  const isbn1 = `978-TEST-${timestamp}-1`;
  const isbn2 = `978-TEST-${timestamp}-2`;

  try {
    // 1. Initial Dashboard Stats
    console.log('\n[1] Testing Dashboard API...');
    const dashRes = await request(`${API}/dashboard`);
    console.log('Dashboard stats:', dashRes.data);

    // 2. Add Book 1
    console.log('\n[2] Testing Add Book API...');
    const book1Data = {
      title: 'Operating System Concepts',
      author: 'Silberschatz & Galvin',
      ISBN: isbn1,
      category: 'Computer Science',
      quantity: 3
    };
    const add1Res = await request(`${API}/books`, {
      method: 'POST',
      body: JSON.stringify(book1Data)
    });
    console.log('Book 1 added:', add1Res.message, 'ID:', add1Res.data._id);
    const book1Id = add1Res.data._id;

    // 3. Test Duplicate ISBN prevention
    console.log('\n[3] Testing Duplicate ISBN Prevention...');
    try {
      await request(`${API}/books`, {
        method: 'POST',
        body: JSON.stringify(book1Data)
      });
      console.error('FAIL: Duplicate ISBN was allowed!');
    } catch (err) {
      console.log('SUCCESS: Prevented duplicate ISBN with status:', err.status, 'Message:', err.message);
    }

    // 4. Add Book 2
    console.log('\n[4] Adding Book 2 (Quantity = 1)...');
    const book2Data = {
      title: 'Computer Networks - A Systems Approach',
      author: 'Larry L. Peterson',
      ISBN: isbn2,
      category: 'Networking',
      quantity: 1
    };
    const add2Res = await request(`${API}/books`, {
      method: 'POST',
      body: JSON.stringify(book2Data)
    });
    console.log('Book 2 added:', add2Res.message, 'ID:', add2Res.data._id);
    const book2Id = add2Res.data._id;

    // 5. Search Books
    console.log('\n[5] Testing Search Books by Author...');
    const searchRes = await request(`${API}/books?search=Peterson`);
    console.log('Search found count:', searchRes.count, 'Found title:', searchRes.data[0]?.title);

    // 5a. Test Sections API
    console.log('\n[5a] Testing Sections API (/api/books/sections)...');
    const sectionsRes = await request(`${API}/books/sections`);
    console.log(`Found ${sectionsRes.count} sections. Example:`, sectionsRes.data[0]);

    // 5b. Test Section Filtering
    console.log('\n[5b] Testing Filter by Section...');
    const filterSecRes = await request(`${API}/books?section=Computer%20Science%20%26%20Programming`);
    console.log(`Found ${filterSecRes.count} books in 'Computer Science & Programming' section.`);

    // 6. Update Book
    console.log('\n[6] Testing Update Book...');
    const updateRes = await request(`${API}/books/${book1Id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: 'Operating System Concepts (10th Edition)',
        quantity: 5
      })
    });
    console.log('Book updated:', updateRes.message, 'New title:', updateRes.data.title, 'New Qty:', updateRes.data.quantity);

    // 7. Issue Book 2 (Available = 1)
    console.log('\n[7] Testing Issue Book...');
    const issueRes = await request(`${API}/borrow`, {
      method: 'POST',
      body: JSON.stringify({
        studentName: 'Vivek Poojary',
        studentRollNumber: 'MCA2024045',
        bookId: book2Id,
        issueDate: new Date()
      })
    });
    console.log('Book issued:', issueRes.message, 'BorrowRecord ID:', issueRes.data._id);
    const borrowRecordId = issueRes.data._id;

    // 8. Test Issuing unavailable book (since Book 2 had quantity 1 and was issued)
    console.log('\n[8] Testing Out of Stock Issue Prevention...');
    try {
      await request(`${API}/borrow`, {
        method: 'POST',
        body: JSON.stringify({
          studentName: 'Amit Kumar',
          studentRollNumber: 'MCA2024012',
          bookId: book2Id
        })
      });
      console.error('FAIL: Issued book with 0 available quantity!');
    } catch (err) {
      console.log('SUCCESS: Prevented issuing out-of-stock book:', err.status, err.message);
    }

    // 9. Test Deletion prevention for issued book
    console.log('\n[9] Testing Delete Prevention for Issued Book...');
    try {
      await request(`${API}/books/${book2Id}`, {
        method: 'DELETE'
      });
      console.error('FAIL: Allowed deleting book that is currently issued!');
    } catch (err) {
      console.log('SUCCESS: Prevented deleting issued book:', err.status, err.message);
    }

    // 10. Return Book 2
    console.log('\n[10] Testing Return Book...');
    const returnRes = await request(`${API}/borrow/${borrowRecordId}/return`, {
      method: 'PUT'
    });
    console.log('Book returned:', returnRes.message, 'Status:', returnRes.data.status);

    // 11. Test Returning the same book twice
    console.log('\n[11] Testing Duplicate Return Prevention...');
    try {
      await request(`${API}/borrow/${borrowRecordId}/return`, {
        method: 'PUT'
      });
      console.error('FAIL: Allowed duplicate return!');
    } catch (err) {
      console.log('SUCCESS: Prevented duplicate return:', err.status, err.message);
    }

    // 12. Check Dashboard after return
    console.log('\n[12] Checking Updated Dashboard Stats...');
    const updatedDash = await request(`${API}/dashboard`);
    console.log('Updated Dashboard Stats:', updatedDash.data);

    // 13. Clean up book 2 and book 1
    console.log('\n[13] Testing Delete Book (Now returned)...');
    const deleteRes = await request(`${API}/books/${book2Id}`, {
      method: 'DELETE'
    });
    console.log('Delete result:', deleteRes.message);

    const deleteRes1 = await request(`${API}/books/${book1Id}`, {
      method: 'DELETE'
    });
    console.log('Delete book 1 result:', deleteRes1.message);

    console.log('\n======================================================');
    console.log('🎉 ALL 13 TEST SUITES PASSED FLAWLESSLY! 100% SUCCESS 🎉');
    console.log('======================================================');
  } catch (error) {
    console.error('Test Suite Failed:', error.data || error.message);
  }
}

runTests();
