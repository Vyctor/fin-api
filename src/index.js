const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
/**
 * cpf - string
 * name - string
 * id - uuid
 * statement - []
 */

const customers = [];

app.post("/account", (request, response) => {
    const { cpf, name } = request.body;
    const id = uuidv4();

    const user = {
        id,
        cpf,
        name,
        statement: [],
    };
    customers.push(user);
});