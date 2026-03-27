import { db } from '../firebase';
import { collection, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';

const initialYears = [
  { id: '1st-year', name: '1st Year', description: 'Foundation courses and basic engineering principles.', order: 1 },
  { id: '2nd-year', name: '2nd Year', description: 'Core departmental subjects and intermediate concepts.', order: 2 },
  { id: '3rd-year', name: '3rd Year', description: 'Advanced specialization and professional electives.', order: 3 },
  { id: '4th-year', name: '4th Year', description: 'Final year projects and industry-oriented subjects.', order: 4 },
];

const initialSubjects = [
  // 1st Year
  { id: 'maths-1', yearId: '1st-year', name: 'Mathematics I', code: 'MA101', description: 'Calculus, Linear Algebra, and Differential Equations.', order: 1 },
  { id: 'physics-1', yearId: '1st-year', name: 'Engineering Physics', code: 'PH101', description: 'Optics, Electromagnetism, and Quantum Mechanics.', order: 2 },
  { id: 'chem-1', yearId: '1st-year', name: 'Engineering Chemistry', code: 'CH101', description: 'Thermodynamics, Electrochemistry, and Materials.', order: 3 },
  { id: 'prog-1', yearId: '1st-year', name: 'Programming in C', code: 'CS101', description: 'Basic programming logic and syntax.', order: 4 },
  
  // 2nd Year
  { id: 'dsa', yearId: '2nd-year', name: 'Data Structures & Algorithms', code: 'CS201', description: 'Arrays, Linked Lists, Trees, and Sorting.', order: 1 },
  { id: 'dbms', yearId: '2nd-year', name: 'Database Management Systems', code: 'CS202', description: 'SQL, NoSQL, and Database Design.', order: 2 },
  { id: 'cn', yearId: '2nd-year', name: 'Computer Networks', code: 'CS203', description: 'TCP/IP, OSI Model, and Network Security.', order: 3 },
  { id: 'algo', yearId: '2nd-year', name: 'Design & Analysis of Algorithms', code: 'CS204', description: 'Complexity analysis and advanced algorithms.', order: 4 },

  // 3rd Year
  { id: 'os', yearId: '3rd-year', name: 'Operating Systems', code: 'CS301', description: 'Process management, Memory, and File systems.', order: 1 },
  { id: 'se', yearId: '3rd-year', name: 'Software Engineering', code: 'CS302', description: 'SDLC, Agile, and Software Testing.', order: 2 },
  { id: 'ai', yearId: '3rd-year', name: 'Artificial Intelligence', code: 'CS303', description: 'Search algorithms, Logic, and Neural Networks.', order: 3 },
  { id: 'web', yearId: '3rd-year', name: 'Web Development', code: 'CS304', description: 'HTML, CSS, JS, and Modern Frameworks.', order: 4 },

  // 4th Year
  { id: 'ml', yearId: '4th-year', name: 'Machine Learning', code: 'CS401', description: 'Supervised, Unsupervised, and Deep Learning.', order: 1 },
  { id: 'cloud', yearId: '4th-year', name: 'Cloud Computing', code: 'CS402', description: 'AWS, Azure, and Distributed Systems.', order: 2 },
  { id: 'cyber', yearId: '4th-year', name: 'Cyber Security', code: 'CS403', description: 'Cryptography, Network Security, and Ethical Hacking.', order: 3 },
  { id: 'fyp', yearId: '4th-year', name: 'Final Year Project', code: 'CS404', description: 'Major project implementation and documentation.', order: 4 },
];

const initialResources = [
  { 
    id: 'res-1', 
    subjectId: 'dsa', 
    title: 'DSA Complete Notes', 
    type: 'notes', 
    url: 'https://example.com/dsa-notes.pdf', 
    description: 'Comprehensive notes for Data Structures and Algorithms.'
  },
  { 
    id: 'res-2', 
    subjectId: 'dbms', 
    title: 'DBMS Textbook PDF', 
    type: 'book', 
    url: 'https://example.com/dbms-book.pdf', 
    description: 'Standard textbook for Database Management Systems.'
  },
  { 
    id: 'res-3', 
    subjectId: 'os', 
    title: 'OS Previous Year Paper', 
    type: 'paper', 
    url: 'https://example.com/os-paper.pdf', 
    description: '2023 University paper for Operating Systems.'
  }
];

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Seed Years
    for (const year of initialYears) {
      await setDoc(doc(db, 'years', year.id), year);
    }
    console.log('Years seeded successfully.');

    // Seed Subjects
    for (const subject of initialSubjects) {
      await setDoc(doc(db, 'subjects', subject.id), subject);
    }
    console.log('Subjects seeded successfully.');

    // Seed Resources
    for (const resource of initialResources) {
      await setDoc(doc(db, 'resources', resource.id), resource);
    }
    console.log('Resources seeded successfully.');

    // Seed Admin User (Optional, but helpful)
    // Note: We use a fixed UID for the admin if we know it, or just create the doc
    // In this case, we'll let the user sign in first, then they can use this.
    // But we can pre-set the role for a specific email if we want.
    
    // Seed Extra Resources
    const extraResources = [
      { title: 'GeeksforGeeks', link: 'https://www.geeksforgeeks.org/', category: 'Website', description: 'A computer science portal for geeks.', createdAt: serverTimestamp() },
      { title: 'Apna College', link: 'https://www.youtube.com/c/ApnaCollegeOfficial', category: 'YouTube', description: 'Best YouTube channel for placement preparation.', createdAt: serverTimestamp() },
      { title: 'MDN Web Docs', link: 'https://developer.mozilla.org/', category: 'Documentation', description: 'The best documentation for web developers.', createdAt: serverTimestamp() }
    ];

    for (const resource of extraResources) {
      await addDoc(collection(db, 'extra_resources'), resource);
    }
    
    console.log('Database seeding completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }
};
