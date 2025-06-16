import express from 'express';
import path from 'path';
const router = express.Router();

// Home - show next 3 events
router.get('/', async (req, res) => {
  const db = req.app.locals.db;
  const events = await db.all('SELECT * FROM events ORDER BY event_date LIMIT 3');
  res.render('home', { events });
});

// Courses
router.get('/courses', async (req, res) => {
  const db = req.app.locals.db;
  const courses = await db.all('SELECT * FROM courses');
  res.render('courses', { courses });
});

// Instructors
router.get('/instructors', async (req, res) => {
  const db = req.app.locals.db;
  const instructors = await db.all('SELECT * FROM instructors');
  res.render('instructors', { instructors });
});

// FAQ
router.get('/faq', (req, res) => {
  const faqs = [
    {q: 'How do I enroll?', a: 'Just contact us using the form.'},
    {q: 'Are the courses free?', a: 'Yes, all demo courses are free.'},
    {q: 'Do I get a certificate?', a: 'Yes, after completing all modules.'}
  ];
  res.render('faq', { faqs });
});

// Contact GET
router.get('/contact', (req, res) => {
  res.render('contact', { submitted: false });
});

// Contact POST
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  const db = req.app.locals.db;
  if (name && email && message) {
    await db.run('INSERT INTO messages (name, email, body) VALUES (?,?,?)',
      [name, email, message]);
    res.render('contact', { submitted: true });
  } else {
    res.render('contact', { submitted: false });
  }
});

export default router;