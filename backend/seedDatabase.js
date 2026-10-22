const mongoose = require('mongoose');
require('dotenv').config();
const Book = require('./models/Book');
const BorrowRecord = require('./models/BorrowRecord');

const sectionsData = [
  {
    section: 'Computer Science & Programming',
    books: [
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        quantity: 6,
        rackLocation: 'Rack CS-101',
        publishedYear: 2021
      },
      {
        title: 'The Pragmatic Programmer: Your Journey to Mastery',
        author: 'David Thomas and Andrew Hunt',
        isbn: '978-0135957059',
        quantity: 5,
        rackLocation: 'Rack CS-102',
        publishedYear: 2020
      },
      {
        title: 'Cracking the Coding Interview: 189 Programming Questions',
        author: 'Gayle Laakmann McDowell',
        isbn: '978-0984782857',
        quantity: 10,
        rackLocation: 'Rack CS-103',
        publishedYear: 2021
      },
      {
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
        isbn: '978-0201633610',
        quantity: 6,
        rackLocation: 'Rack CS-104',
        publishedYear: 2020
      },
      {
        title: 'Code Complete: A Practical Handbook of Software Construction',
        author: 'Steve McConnell',
        isbn: '978-0735619678',
        quantity: 5,
        rackLocation: 'Rack CS-105',
        publishedYear: 2019
      },
      {
        title: 'Refactoring: Improving the Design of Existing Code',
        author: 'Martin Fowler',
        isbn: '978-0134757599',
        quantity: 5,
        rackLocation: 'Rack CS-106',
        publishedYear: 2022
      },
      {
        title: 'Structure and Interpretation of Computer Programs',
        author: 'Harold Abelson and Gerald Jay Sussman',
        isbn: '978-0262510875',
        quantity: 4,
        rackLocation: 'Rack CS-107',
        publishedYear: 2021
      },
      {
        title: "You Don't Know JS Yet: Get Started",
        author: 'Kyle Simpson',
        isbn: '978-1617292859',
        quantity: 6,
        rackLocation: 'Rack CS-108',
        publishedYear: 2020
      }
    ]
  },
  {
    section: 'Artificial Intelligence & Machine Learning',
    books: [
      {
        title: 'Artificial Intelligence: A Modern Approach',
        author: 'Stuart Russell and Peter Norvig',
        isbn: '978-0134610993',
        quantity: 6,
        rackLocation: 'Rack AI-201',
        publishedYear: 2023
      },
      {
        title: 'Deep Learning with Python',
        author: 'François Chollet',
        isbn: '978-1617296864',
        quantity: 5,
        rackLocation: 'Rack AI-202',
        publishedYear: 2021
      },
      {
        title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow',
        author: 'Aurélien Géron',
        isbn: '978-1492032649',
        quantity: 7,
        rackLocation: 'Rack AI-203',
        publishedYear: 2022
      },
      {
        title: 'Pattern Recognition and Machine Learning',
        author: 'Christopher M. Bishop',
        isbn: '978-0387310732',
        quantity: 4,
        rackLocation: 'Rack AI-204',
        publishedYear: 2020
      },
      {
        title: 'Deep Learning (Adaptive Computation and Machine Learning)',
        author: 'Ian Goodfellow, Yoshua Bengio, and Aaron Courville',
        isbn: '978-0262035613',
        quantity: 5,
        rackLocation: 'Rack AI-205',
        publishedYear: 2021
      },
      {
        title: 'Reinforcement Learning: An Introduction',
        author: 'Richard S. Sutton and Andrew G. Barto',
        isbn: '978-0262039246',
        quantity: 5,
        rackLocation: 'Rack AI-206',
        publishedYear: 2020
      },
      {
        title: 'Speech and Language Processing',
        author: 'Daniel Jurafsky and James H. Martin',
        isbn: '978-0131873216',
        quantity: 4,
        rackLocation: 'Rack AI-207',
        publishedYear: 2023
      },
      {
        title: 'Computer Vision: Algorithms and Applications',
        author: 'Richard Szeliski',
        isbn: '978-3030343712',
        quantity: 4,
        rackLocation: 'Rack AI-208',
        publishedYear: 2022
      }
    ]
  },
  {
    section: 'Data Science & Big Data',
    books: [
      {
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        isbn: '978-1449373320',
        quantity: 6,
        rackLocation: 'Rack DS-301',
        publishedYear: 2022
      },
      {
        title: 'Python for Data Analysis',
        author: 'Wes McKinney',
        isbn: '978-1491957660',
        quantity: 6,
        rackLocation: 'Rack DS-302',
        publishedYear: 2022
      },
      {
        title: 'Storytelling with Data: A Data Visualization Guide',
        author: 'Cole Nussbaumer Knaflic',
        isbn: '978-1119002253',
        quantity: 5,
        rackLocation: 'Rack DS-303',
        publishedYear: 2020
      },
      {
        title: 'Big Data: Principles and Best Practices of Scalable Systems',
        author: 'Nathan Marz and James Warren',
        isbn: '978-1617290343',
        quantity: 5,
        rackLocation: 'Rack DS-304',
        publishedYear: 2021
      },
      {
        title: 'Practical Statistics for Data Scientists',
        author: 'Peter Bruce, Andrew Bruce, and Peter Gedeck',
        isbn: '978-1492072942',
        quantity: 5,
        rackLocation: 'Rack DS-305',
        publishedYear: 2021
      },
      {
        title: 'Data Science from Scratch: First Principles with Python',
        author: 'Joel Grus',
        isbn: '978-1492041139',
        quantity: 6,
        rackLocation: 'Rack DS-306',
        publishedYear: 2020
      },
      {
        title: 'Streaming Systems: The What, Where, When, and How of Large-Scale Data',
        author: 'Tyler Akidau, Slava Chernyak, and Reuven Lax',
        isbn: '978-1491983874',
        quantity: 4,
        rackLocation: 'Rack DS-307',
        publishedYear: 2021
      },
      {
        title: 'Learning Spark: Lightning-Fast Data Analytics',
        author: 'Jules S. Damji, Brooke Wenig, Tathagata Das, Denny Lee',
        isbn: '978-1492050049',
        quantity: 5,
        rackLocation: 'Rack DS-308',
        publishedYear: 2022
      }
    ]
  },
  {
    section: 'Web Development & Cloud Computing',
    books: [
      {
        title: 'Full Stack Development with React and Node.js',
        author: 'Jonathan Wexler and Alex Banks',
        isbn: '978-1484271827',
        quantity: 6,
        rackLocation: 'Rack WEB-401',
        publishedYear: 2022
      },
      {
        title: 'Learning React: Modern Patterns for Developing React Apps',
        author: 'Alex Banks and Eve Porcello',
        isbn: '978-1492051725',
        quantity: 7,
        rackLocation: 'Rack WEB-402',
        publishedYear: 2021
      },
      {
        title: 'Node.js Design Patterns (3rd Edition)',
        author: 'Mario Casciaro and Luciano Mammino',
        isbn: '978-1839214110',
        quantity: 5,
        rackLocation: 'Rack WEB-403',
        publishedYear: 2021
      },
      {
        title: 'Cloud Native Patterns: Designing Cloud-Native Applications',
        author: 'Cornelia Davis',
        isbn: '978-1617294297',
        quantity: 5,
        rackLocation: 'Rack WEB-404',
        publishedYear: 2020
      },
      {
        title: 'Docker Deep Dive: Zero to Docker in a Single Book',
        author: 'Nigel Poulton',
        isbn: '978-1521822807',
        quantity: 6,
        rackLocation: 'Rack WEB-405',
        publishedYear: 2023
      },
      {
        title: 'Kubernetes in Action (Second Edition)',
        author: 'Marko Lukša',
        isbn: '978-1617293726',
        quantity: 5,
        rackLocation: 'Rack WEB-406',
        publishedYear: 2022
      },
      {
        title: 'Microservices Patterns: With Examples in Java',
        author: 'Chris Richardson',
        isbn: '978-1617294549',
        quantity: 4,
        rackLocation: 'Rack WEB-407',
        publishedYear: 2021
      },
      {
        title: 'Modern Full-Stack Development: TypeScript, React, and Node',
        author: 'Frank Zammetti',
        isbn: '978-1484280195',
        quantity: 6,
        rackLocation: 'Rack WEB-408',
        publishedYear: 2022
      }
    ]
  },
  {
    section: 'Cybersecurity & Networking',
    books: [
      {
        title: 'Computer Networking: A Top-Down Approach (8th Edition)',
        author: 'James F. Kurose and Keith W. Ross',
        isbn: '978-0133594140',
        quantity: 7,
        rackLocation: 'Rack SEC-501',
        publishedYear: 2022
      },
      {
        title: "The Web Application Hacker's Handbook: Finding and Exploiting Security Flaws",
        author: 'Dafydd Stuttard and Marcus Pinto',
        isbn: '978-1118026472',
        quantity: 5,
        rackLocation: 'Rack SEC-502',
        publishedYear: 2020
      },
      {
        title: 'Network Security Essentials: Applications and Standards',
        author: 'William Stallings',
        isbn: '978-0134444284',
        quantity: 6,
        rackLocation: 'Rack SEC-503',
        publishedYear: 2021
      },
      {
        title: 'Practical Malware Analysis: The Hands-On Guide',
        author: 'Michael Sikorski and Andrew Honig',
        isbn: '978-1593272906',
        quantity: 4,
        rackLocation: 'Rack SEC-504',
        publishedYear: 2021
      },
      {
        title: 'Hacking: The Art of Exploitation (2nd Edition)',
        author: 'Jon Erickson',
        isbn: '978-1593271442',
        quantity: 5,
        rackLocation: 'Rack SEC-505',
        publishedYear: 2020
      },
      {
        title: 'TCP/IP Illustrated, Volume 1: The Protocols',
        author: 'W. Richard Stevens and Kevin R. Fall',
        isbn: '978-0321336316',
        quantity: 4,
        rackLocation: 'Rack SEC-506',
        publishedYear: 2021
      },
      {
        title: 'Applied Cryptography: Protocols, Algorithms, and Source Code in C',
        author: 'Bruce Schneier',
        isbn: '978-1119096726',
        quantity: 4,
        rackLocation: 'Rack SEC-507',
        publishedYear: 2020
      },
      {
        title: 'Blue Team Handbook: Incident Response Edition',
        author: 'Don Murdoch',
        isbn: '978-1500734756',
        quantity: 5,
        rackLocation: 'Rack SEC-508',
        publishedYear: 2022
      }
    ]
  },
  {
    section: 'Database Systems & Architecture',
    books: [
      {
        title: 'Database System Concepts (Seventh Edition)',
        author: 'Abraham Silberschatz, Henry F. Korth, and S. Sudarshan',
        isbn: '978-0078022159',
        quantity: 6,
        rackLocation: 'Rack DB-601',
        publishedYear: 2021
      },
      {
        title: 'MongoDB: The Definitive Guide (3rd Edition)',
        author: 'Shannon Bradshaw, Eoin Brazil, and Kristina Chodorow',
        isbn: '978-1491954461',
        quantity: 6,
        rackLocation: 'Rack DB-602',
        publishedYear: 2022
      },
      {
        title: 'High Performance MySQL: Optimization, Backups, and Replication',
        author: 'Silvia Botros and Jeremy Tinley',
        isbn: '978-1492080510',
        quantity: 5,
        rackLocation: 'Rack DB-603',
        publishedYear: 2022
      },
      {
        title: 'Database Internals: How Distributed Data Systems Work',
        author: 'Alex Petrov',
        isbn: '978-1492040347',
        quantity: 5,
        rackLocation: 'Rack DB-604',
        publishedYear: 2021
      },
      {
        title: 'SQL Antipatterns: Avoiding the Pitfalls of Database Programming',
        author: 'Bill Karwin',
        isbn: '978-1934356555',
        quantity: 5,
        rackLocation: 'Rack DB-605',
        publishedYear: 2020
      },
      {
        title: 'Seven Databases in Seven Weeks: A Guide to Modern Databases',
        author: 'Luc Perkins and Eric Redmond',
        isbn: '978-1680502534',
        quantity: 4,
        rackLocation: 'Rack DB-606',
        publishedYear: 2020
      },
      {
        title: 'Fundamentals of Database Systems (7th Edition)',
        author: 'Ramez Elmasri and Shamkant B. Navathe',
        isbn: '978-0133970777',
        quantity: 5,
        rackLocation: 'Rack DB-607',
        publishedYear: 2021
      },
      {
        title: 'Redis in Action',
        author: 'Josiah L. Carlson',
        isbn: '978-1617290855',
        quantity: 5,
        rackLocation: 'Rack DB-608',
        publishedYear: 2021
      }
    ]
  },
  {
    section: 'Mathematics & Discrete Algorithms',
    books: [
      {
        title: 'Introduction to Algorithms (Fourth Edition)',
        author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest',
        isbn: '978-0262046305',
        quantity: 8,
        rackLocation: 'Rack MTH-701',
        publishedYear: 2022
      },
      {
        title: 'Discrete Mathematics and Its Applications (Eighth Edition)',
        author: 'Kenneth H. Rosen',
        isbn: '978-1259676512',
        quantity: 6,
        rackLocation: 'Rack MTH-702',
        publishedYear: 2021
      },
      {
        title: 'Algorithms (4th Edition)',
        author: 'Robert Sedgewick and Kevin Wayne',
        isbn: '978-0321573513',
        quantity: 6,
        rackLocation: 'Rack MTH-703',
        publishedYear: 2021
      },
      {
        title: 'Grokking Algorithms: An Illustrated Guide',
        author: 'Aditya Bhargava',
        isbn: '978-1617292231',
        quantity: 8,
        rackLocation: 'Rack MTH-704',
        publishedYear: 2022
      },
      {
        title: 'The Algorithm Design Manual (Third Edition)',
        author: 'Steven S. Skiena',
        isbn: '978-3030542559',
        quantity: 5,
        rackLocation: 'Rack MTH-705',
        publishedYear: 2021
      },
      {
        title: 'Linear Algebra and Its Applications',
        author: 'Gilbert Strang',
        isbn: '978-0030105678',
        quantity: 6,
        rackLocation: 'Rack MTH-706',
        publishedYear: 2020
      },
      {
        title: 'Concrete Mathematics: A Foundation for Computer Science',
        author: 'Ronald L. Graham, Donald E. Knuth, and Oren Patashnik',
        isbn: '978-0201558029',
        quantity: 4,
        rackLocation: 'Rack MTH-707',
        publishedYear: 2020
      },
      {
        title: 'Introduction to the Theory of Computation (3rd Edition)',
        author: 'Michael Sipser',
        isbn: '978-1133187790',
        quantity: 5,
        rackLocation: 'Rack MTH-708',
        publishedYear: 2021
      }
    ]
  },
  {
    section: 'Business, Management & Startups',
    books: [
      {
        title: 'Zero to One: Notes on Startups, or How to Build the Future',
        author: 'Peter Thiel and Blake Masters',
        isbn: '978-0804139298',
        quantity: 5,
        rackLocation: 'Rack MGT-801',
        publishedYear: 2020
      },
      {
        title: 'The Lean Startup: How Today’s Entrepreneurs Use Continuous Innovation',
        author: 'Eric Ries',
        isbn: '978-0307887894',
        quantity: 6,
        rackLocation: 'Rack MGT-802',
        publishedYear: 2021
      },
      {
        title: 'Hooked: How to Build Habit-Forming Products',
        author: 'Nir Eyal',
        isbn: '978-1591847786',
        quantity: 5,
        rackLocation: 'Rack MGT-803',
        publishedYear: 2020
      },
      {
        title: 'The Hard Thing About Hard Things: Building a Business When There Are No Easy Answers',
        author: 'Ben Horowitz',
        isbn: '978-0062273208',
        quantity: 5,
        rackLocation: 'Rack MGT-804',
        publishedYear: 2021
      },
      {
        title: 'Good to Great: Why Some Companies Make the Leap... and Others Don’t',
        author: 'Jim Collins',
        isbn: '978-0066620992',
        quantity: 5,
        rackLocation: 'Rack MGT-805',
        publishedYear: 2020
      },
      {
        title: 'Measure What Matters: How Google and Bono Rock the World with OKRs',
        author: 'John Doerr',
        isbn: '978-0525536222',
        quantity: 5,
        rackLocation: 'Rack MGT-806',
        publishedYear: 2021
      },
      {
        title: 'Sprint: How to Solve Big Problems and Test New Ideas in Just Five Days',
        author: 'Jake Knapp, John Zeratsky, and Braden Kowitz',
        isbn: '978-1501121746',
        quantity: 5,
        rackLocation: 'Rack MGT-807',
        publishedYear: 2020
      },
      {
        title: 'Start with Why: How Great Leaders Inspire Everyone to Take Action',
        author: 'Simon Sinek',
        isbn: '978-1591846444',
        quantity: 6,
        rackLocation: 'Rack MGT-808',
        publishedYear: 2021
      }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully.\n');

    console.log('--- SEEDING & STRUCTURING LIBRARY SECTIONS ---');
    console.log(`Configuring ${sectionsData.length} distinct sections (around 8 books per section)...`);

    // Clean up duplicate non-standard legacy entries if any
    await Book.deleteOne({ ISBN: '978-0262033848' });

    let updatedCount = 0;
    let createdCount = 0;

    for (const sectionGroup of sectionsData) {
      const sectionName = sectionGroup.section;
      console.log(`\n📂 Processing Section: "${sectionName}" (${sectionGroup.books.length} books)`);

      for (const item of sectionGroup.books) {
        const cleanISBN = item.isbn.trim();

        // Check if book exists by ISBN
        const existingBook = await Book.findOne({
          $or: [{ ISBN: cleanISBN }, { isbn: cleanISBN }]
        });

        if (existingBook) {
          // Check how many copies are currently issued in active borrow records
          const issuedCount = await BorrowRecord.countDocuments({
            $or: [
              { bookId: existingBook._id, status: 'Issued' },
              { book: existingBook._id, status: 'issued' }
            ]
          });

          const totalQty = Math.max(item.quantity, issuedCount + 1);
          const availQty = Math.max(0, totalQty - issuedCount);

          existingBook.title = item.title;
          existingBook.author = item.author;
          existingBook.ISBN = cleanISBN;
          existingBook.isbn = cleanISBN;
          existingBook.category = sectionName;
          existingBook.section = sectionName;
          existingBook.quantity = totalQty;
          existingBook.totalCopies = totalQty;
          existingBook.availableQuantity = availQty;
          existingBook.availableCopies = availQty;
          existingBook.rackLocation = item.rackLocation;
          existingBook.publishedYear = item.publishedYear;

          await existingBook.save();
          console.log(`  🔄 Updated: "${item.title}" [Available: ${availQty}/${totalQty}]`);
          updatedCount++;
        } else {
          // Create new book
          await Book.create({
            title: item.title,
            author: item.author,
            ISBN: cleanISBN,
            isbn: cleanISBN,
            category: sectionName,
            section: sectionName,
            quantity: item.quantity,
            totalCopies: item.quantity,
            availableQuantity: item.quantity,
            availableCopies: item.quantity,
            rackLocation: item.rackLocation,
            publishedYear: item.publishedYear
          });
          console.log(`  ➕ Added: "${item.title}" [Quantity: ${item.quantity}]`);
          createdCount++;
        }
      }
    }

    console.log('\n======================================================');
    console.log(`🎉 DATABASE SEEDING COMPLETED!`);
    console.log(`Total sections: ${sectionsData.length}`);
    console.log(`Total books configured: ${sectionsData.length * 8}`);
    console.log(`Updated existing entries: ${updatedCount}`);
    console.log(`Newly inserted books: ${createdCount}`);
    console.log('======================================================\n');

    // Verification summary
    const allBooks = await Book.find({});
    const sectionMap = {};
    allBooks.forEach(b => {
      const s = b.section || b.category || 'General';
      sectionMap[s] = (sectionMap[s] || 0) + 1;
    });

    console.log('📊 Current Section Breakdown in Database:');
    for (const [sec, count] of Object.entries(sectionMap)) {
      console.log(`  • ${sec}: ${count} books`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
