const mongoose = require('mongoose');
require('dotenv').config();
const Book = require('./models/Book');
const BorrowRecord = require('./models/BorrowRecord');

const indianAndSubjectBooks = [
  // Computer Science & Engineering Textbooks
  {
    title: 'Programming in ANSI C',
    author: 'E. Balagurusamy',
    isbn: '978-9353165130',
    category: 'Computer Science',
    quantity: 6,
    availableQuantity: 5 // 1 issued
  },
  {
    title: 'Object Oriented Programming with C++',
    author: 'E. Balagurusamy',
    isbn: '978-9389949186',
    category: 'Computer Science',
    quantity: 6,
    availableQuantity: 6
  },
  {
    title: 'Data Structures Using C and C++',
    author: 'Reema Thareja',
    isbn: '978-0198099307',
    category: 'Computer Science',
    quantity: 5,
    availableQuantity: 5
  },
  {
    title: 'Core Java: An Integrated Approach',
    author: 'R. Nageswara Rao',
    isbn: '978-9351199274',
    category: 'Computer Science',
    quantity: 5,
    availableQuantity: 5
  },
  {
    title: 'Python Programming: Using Problem Solving Approach',
    author: 'Reema Thareja',
    isbn: '978-0199480176',
    category: 'Computer Science',
    quantity: 5,
    availableQuantity: 5
  },
  {
    title: 'Design and Analysis of Algorithms',
    author: 'S. Sridhar',
    isbn: '978-0198093695',
    category: 'Computer Science',
    quantity: 5,
    availableQuantity: 5
  },
  {
    title: 'Fundamentals of Computer Algorithms',
    author: 'Ellis Horowitz, Sartaj Sahni & Sanguthevar Rajasekaran',
    isbn: '978-8173716126',
    category: 'Computer Science',
    quantity: 4,
    availableQuantity: 4
  },
  {
    title: 'Software Engineering: A Precise Approach',
    author: 'Pankaj Jalote',
    isbn: '978-8126523115',
    category: 'Computer Science',
    quantity: 5,
    availableQuantity: 5
  },
  {
    title: 'Web Technologies: TCP/IP, Web Applications and Java',
    author: 'Achyut Godbole & Atul Kahate',
    isbn: '978-1259062711',
    category: 'Computer Science',
    quantity: 5,
    availableQuantity: 5
  },
  {
    title: 'Database Management Systems',
    author: 'Rajiv Chopra',
    isbn: '978-9385676345',
    category: 'Computer Science',
    quantity: 5,
    availableQuantity: 5
  },
  {
    title: 'Operating Systems: Principles and Design',
    author: 'Pal Choudhury',
    isbn: '978-8120338777',
    category: 'Computer Science',
    quantity: 4,
    availableQuantity: 4
  },
  {
    title: 'Cryptography and Network Security',
    author: 'Atul Kahate',
    isbn: '978-9353166465',
    category: 'Computer Science',
    quantity: 4,
    availableQuantity: 4
  },
  {
    title: 'Cloud Computing: Principles and Paradigms',
    author: 'Rajkumar Buyya, Christian Vecchiola & S. Thamarai Selvi',
    isbn: '978-8126541034',
    category: 'Computer Science',
    quantity: 4,
    availableQuantity: 4
  },
  {
    title: 'Artificial Intelligence and Soft Computing',
    author: 'Anandita Das Bhattacharjee',
    isbn: '978-9387472259',
    category: 'Computer Science',
    quantity: 4,
    availableQuantity: 4
  },

  // Mathematics & Engineering Sciences
  {
    title: 'Higher Engineering Mathematics',
    author: 'B.S. Grewal',
    isbn: '978-8193328491',
    category: 'Mathematics',
    quantity: 6,
    availableQuantity: 5 // 1 issued
  },
  {
    title: 'Advanced Engineering Mathematics',
    author: 'R.K. Jain & S.R.K. Iyengar',
    isbn: '978-1783325658',
    category: 'Mathematics',
    quantity: 5,
    availableQuantity: 5
  },
  {
    title: 'Discrete Mathematics',
    author: 'C.L. Liu & D.P. Mohapatra',
    isbn: '978-1259010804',
    category: 'Mathematics',
    quantity: 5,
    availableQuantity: 5
  },
  {
    title: 'Basic Electrical Engineering',
    author: 'D.P. Kothari & I.J. Nagrath',
    isbn: '978-9353165727',
    category: 'Engineering Science',
    quantity: 5,
    availableQuantity: 5
  },
  {
    title: 'A Textbook of Engineering Physics',
    author: 'M.N. Avadhanulu & P.G. Kshirsagar',
    isbn: '978-9352833993',
    category: 'Engineering Science',
    quantity: 5,
    availableQuantity: 5
  },
  {
    title: 'Engineering Chemistry',
    author: 'P.C. Jain & Monika Jain',
    isbn: '978-9352163090',
    category: 'Engineering Science',
    quantity: 4,
    availableQuantity: 4
  },

  // Indian Literature, Biographies & General Reading
  {
    title: 'Wings of Fire: An Autobiography',
    author: 'A.P.J. Abdul Kalam & Arun Tiwari',
    isbn: '978-8173711466',
    category: 'Indian Literature',
    quantity: 6,
    availableQuantity: 6
  },
  {
    title: 'Ignited Minds: Unleashing the Power Within India',
    author: 'A.P.J. Abdul Kalam',
    isbn: '978-0143424123',
    category: 'Indian Literature',
    quantity: 5,
    availableQuantity: 5
  },
  {
    title: 'India 2020: A Vision for the New Millennium',
    author: 'A.P.J. Abdul Kalam & Y.S. Rajan',
    isbn: '978-0143423683',
    category: 'Indian Literature',
    quantity: 4,
    availableQuantity: 4
  },
  {
    title: 'The Discovery of India',
    author: 'Jawaharlal Nehru',
    isbn: '978-0143031031',
    category: 'Indian Literature',
    quantity: 4,
    availableQuantity: 4
  },
  {
    title: 'Malgudi Days',
    author: 'R.K. Narayan',
    isbn: '978-8185986173',
    category: 'Indian Literature',
    quantity: 5,
    availableQuantity: 5
  },
  {
    title: 'The Guide',
    author: 'R.K. Narayan',
    isbn: '978-8185986074',
    category: 'Indian Literature',
    quantity: 4,
    availableQuantity: 4
  },
  {
    title: 'Train to Pakistan',
    author: 'Khushwant Singh',
    isbn: '978-0143065883',
    category: 'Indian Literature',
    quantity: 4,
    availableQuantity: 4
  },
  {
    title: 'Godan',
    author: 'Munshi Premchand',
    isbn: '978-8171676057',
    category: 'Indian Literature',
    quantity: 4,
    availableQuantity: 4
  },
  {
    title: 'Gitanjali',
    author: 'Rabindranath Tagore',
    isbn: '978-9386538192',
    category: 'Indian Literature',
    quantity: 4,
    availableQuantity: 4
  },
  {
    title: 'The Immortals of Meluha',
    author: 'Amish Tripathi',
    isbn: '978-9380658742',
    category: 'Indian Literature',
    quantity: 5,
    availableQuantity: 5
  }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected successfully!');

    // Clear existing books and borrow records to reset cleanly
    console.log('Clearing old books and records...');
    await Book.deleteMany({});
    await BorrowRecord.deleteMany({});

    // Insert new Indian author & subject books
    console.log(`Inserting ${indianAndSubjectBooks.length} Indian & Subject-related books...`);
    const insertedBooks = await Book.insertMany(indianAndSubjectBooks);
    console.log(`Inserted ${insertedBooks.length} books successfully!`);

    // Map inserted books for sample borrowing
    const balagurusamyBook = insertedBooks.find(b => b.title === 'Programming in ANSI C');
    const grewalBook = insertedBooks.find(b => b.title === 'Higher Engineering Mathematics');
    const kalamBook = insertedBooks.find(b => b.title.startsWith('Wings of Fire'));

    // Create realistic initial borrow records
    const sampleRecords = [
      {
        studentName: 'Vivek Poojary',
        studentRollNumber: 'MCA2024045',
        bookId: balagurusamyBook._id,
        issueDate: new Date('2026-10-15'),
        status: 'Issued'
      },
      {
        studentName: 'Rahul Sharma',
        studentRollNumber: 'MCA2024012',
        bookId: grewalBook._id,
        issueDate: new Date('2026-10-18'),
        status: 'Issued'
      },
      {
        studentName: 'Ananya Rao',
        studentRollNumber: 'MCA2024028',
        bookId: kalamBook._id,
        issueDate: new Date('2026-10-05'),
        returnDate: new Date('2026-10-16'),
        status: 'Returned'
      }
    ];

    await BorrowRecord.insertMany(sampleRecords);
    console.log('Inserted sample student borrowing records successfully!');

    console.log('\n=============================================');
    console.log('✅ DATABASE POPULATED WITH INDIAN & SUBJECT BOOKS!');
    console.log(`Total books: ${insertedBooks.length}`);
    console.log('Sample borrow records created: 3');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
