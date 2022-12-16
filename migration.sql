DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reminders;
DROP TABLE IF EXISTS user_reminders;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE reminders (
    id SERIAL PRIMARY KEY,
    date DATE,
    time TIME,
    title TEXT,
    content TEXT
);

CREATE TABLE user_reminders (
    user_id INTEGER REFERENCES users(id),
    reminder_id INTEGER REFERENCES reminders(id)
);

INSERT INTO users (name) VALUES ('Kyle');

INSERT INTO reminders (date, time, title, content) VALUES ('2022-12-21', '09:00 AM', 'MVP Presentation', 'MVP Calendar Presentation is due at 9 AM on Wednesday, the 21st')
