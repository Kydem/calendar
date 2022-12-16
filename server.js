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
app.use(express.static("./client"));








//------------Server Configuration------------\\
//Server is running on port declared in the .env file (see .env.template)
app.listen(process.env.PORT);