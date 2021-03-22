const { request } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const customers = [];

// Middleware
function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers;
    const customer = customers.find((customer) => customer.cpf === cpf);

    if (!customer) {
        return response.status(400).json({ error: "Customer not found" });
    }

    request.customer = customer;

    return next();
}

function getBalance(statement) {
    return statement.reduce((acc, next) => {
        if (next.operation === "credit") {
            return acc + next.amount;
        } else {
            return acc - next.amount;
        }
    }, 0);
}

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

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    return response.json(customer.statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body;

    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit",
    };

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
    const { amount } = request.body;
    const { customer } = request;

    const balance = getBalance(customer.statement);

    console.log("balance: ", balance);

    if (amount > balance) {
        return response.status(400).json({ error: "Insufficient funds!" });
    }

    statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit",
    };

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.listen(3333);