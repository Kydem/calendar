A Calendar/ reminder sytem that displays the days by month format and allows dynamic reminders to be created and stored by a user

TODO:
- Proper Development Environment
    1) TODO List <--------DONE
    2) npm install express, postgres, dotenv <--------DONE
    3) .gitignore, .env, .env.template <--------DONE
    4) init commit <--------DONE
    5) SUDO Code
    6) Update readme.md to be functional after product is complete

- Backend
    1) create a RESTful Express server
    2) build table structures with SQL <--------DONE
        A) Users { id SERIAL, name TEXT} <--------DONE
        B) User_Reminders { user_id INTEGER, reminder_id INTEGER } <--------DONE
        C) Reminders { id SERIAL, date INTEGER(subject to change), title TEXT, content TEXT } <--------DONE
    3) Build full-scale CRUD paths for User Table(Create, Read, Update, Delete)
    4) Build full-scale CRUD paths for Reminders Table(Create, Read, Update, Delete)
    5) Handle backend errors and edgecases

- Frontend
    1) Create an HTML page that can handle baseline user inputs
        A) User Creation/ Loggin
        B) User Reminders display
        C) User Reminder creation
    2) Write JavaScript to handle the user information and perform calls to the database
    3) Create display calender and creation sidebar
    4) display user reminders on the calender (hopefully on the respective date)
