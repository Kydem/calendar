import express from "express";
import postgres from "postgres";
import dotenv from "dotenv";

//------------Configuration of depndencies------------\\
dotenv.config;

// sql used to make SQL statments
const sql = postgres(process.env.DATABASE_URL);
// app used to interact with the server properties
const app = express();

//translates information into JSON for easy manipulation
app.use(express.json());
//Removes the need to have /client appear in the URL
app.use(express.static("./dist"));


//------------Routes------------\\
app.get("/users", (req, res) => {
    sql`SELECT * FROM users`.then((results) => {
        res.json(results);
    });
});

app.get("/users/:id", (req, res) => {
    const id = req.params.id;

    sql`SELECT * FROM users WHERE ID = ${id}`
    .then((user) => {
        if (user !== undefined) {
            res.json(user[0]);
        } else {
            res.status(404);
            res.set("Content-Type", "text/plain");
            res.send('User not found, please create an account.');
        };
    });
});

app.post("/users", (req, res) => {
    const { name } = req.body;
    sql`INSERT INTO user (name) VALUES (${name}) RETURNING *`.then((result) => {
        res.json(result);
        res.send('User account created');
    });
});






//------------Server Configuration------------\\
//Server is running on port declared in the .env file (see .env.template)
app.listen(process.env.PORT);