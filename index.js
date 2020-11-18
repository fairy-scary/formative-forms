const express = require("express");
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const csrfProtection = csrf({ cookie: true });
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render('index', { users });
});

app.get('/create', csrfProtection, (req, res, next) => {
  res.render('create', { title: 'Create User', csrfToken: req.csrfToken() });
});

const validateData = (req, res, next) => {
  const { 
    firstName,
    lastName,
    email,
    password,
    confirmedPassword,
  } = req.body;

  let errors = [];
  if (!firstName) {
    errors.push("Please provide a first name.");
  }
  if (!lastName) {
    errors.push("Please provide a last name.");
  }
  if (!email) {
    errors.push("Please provide an email.");
  }
  if (!password) {
    errors.push("Please provide a password.");
  }
  if (!confirmedPassword) {
    errors.push("placeholder")
  }
  req.errors = errors;
  next()  
}

app.post('/create', validateData, (req, res) => {
  const {
    firstName,
    lastName,
    email,
  } = req.body

  if (req.errors.length > 0) {
    res.render("create", { title: 'Create User',
    errors: req.errors, 
    firstName,
    lastName,
    email,
    });
    return;
  }
});

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
