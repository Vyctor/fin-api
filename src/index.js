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

    const customerAlreadyExists = customers.some(
        (customer) => customer.cpf === cpf
    );

    if (customerAlreadyExists) {
        return response.status(400).json({ error: "Customer already exists!" });
    }

    const customer = {
        id,
        cpf,
        name,
        statement: [],
    };
    customers.push(customer);

    return response.status(201).send(customers);
});

app.get("/statement", (request, response) => {
    const { cpf } = request.headers;

    console.log(cpf);

    const customer = customers.find((customer) => customer.cpf === cpf);

    if (!customer) {
        return response.status(400).json({ error: "Customer doesnt exists" });
    }
    return response.json(customer.statement);
});

app.listen(3333);