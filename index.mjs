import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// db connection
let db;
(async () => {
  db = await open({
    filename: path.join(__dirname, 'db', 'database.sqlite'),
    driver: sqlite3.Database
  });

  // create tables if not exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      instructor TEXT,
      duration TEXT
    );
    CREATE TABLE IF NOT EXISTS instructors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      bio TEXT,
      email TEXT
    );
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic TEXT,
      event_date TEXT,
      start_time TEXT
    );
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      body TEXT,
      submitted_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // seed data if empty
  const { count } = await db.get('SELECT COUNT(*) as count FROM courses');
  if (count === 0) {
    await db.run("INSERT INTO courses (title, instructor, duration) VALUES           ('Intro to Web Tech', 'Dr. Alice', '4 weeks'),          ('Advanced CSS', 'Prof. Bob', '3 weeks'),          ('JavaScript Basics', 'Dr. Carol', '5 weeks');");
    await db.run("INSERT INTO instructors (name, bio, email) VALUES           ('Dr. Alice', 'PhD in Computer Science passionate about teaching HTML5.', 'alice@example.com'),          ('Prof. Bob', 'Front‑end developer with 10 years in startups.', 'bob@example.com'),          ('Dr. Carol', 'Researcher focusing on interactive user interfaces.', 'carol@example.com');");
    await db.run("INSERT INTO events (topic, event_date, start_time) VALUES           ('Live Q&A: Web Careers', '2025-07-01', '16:00'),          ('CSS Flex & Grid Workshop', '2025-07-05', '14:00'),          ('Portfolio Review Session', '2025-07-10', '18:00');");
  }

  // make db accessible in routes
  app.locals.db = db;

  // middleware & routes
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.urlencoded({ extended: false }));

  app.use('/', routes);

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})();