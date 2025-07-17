# Book Notes App 📚

A personal book-tracking app built with Node.js, Express, PostgreSQL, and EJS.

This is my first full-stack project built as part of my learning from the Udemy course:
_“Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps”_ by [Angela Yu](https://www.udemy.com/course/the-complete-web-development-bootcamp/).

## Features

-  Add/Edit/Delete books
-  Cover images via Open Library
-  Sort by rating, title, or date
-  Styled with custom theme

## API Reference

-  [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers)

## Environment Variables

Create a `.env` file in the root of your project to securely store database credentials:

```
DB_USER=your_db_username
DB_HOST=localhost
DB_DATABASE=booknotes
DB_PASSWORD=your_db_password
DB_PORT=5432
```

Make sure to add `.env` to your `.gitignore` file to prevent it from being pushed to version control.

## Run Locally

```bash
npm install
nodemon index.js
```
