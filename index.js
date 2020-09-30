const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./src/helper/db");

//middleware
app.use(bodyParser.urlencoded({ extended: false }));

//expample
app.get("/", (request, response) => {
  response.send("hello world");
});


//get method
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result, fields) => {
    if (!err)
      res.status(200).send({
        succes: true,
        message: "Succes get all data",
        data: result,
      });
    else
      res.status(400).send({
        succes: false,
        message: "Failed to fetch users data",
        data: [],
      });
  });
});

//get method with limit
app.get("/users", (req, res) => {
  let { page, limit } = req.query;
  
  if (!limit) limit = 5;
  else limit = parseInt(limit);

  if (!page) page = 1;
  else page = parseInt(page);

  db.query(`SELECT * FROM users LIMIT ${limit} OFFSET ${(page - 1) * limit}`,
    (err, result, fields) => {
    if (!err)
      res.status(200).send({
        succes: true,
        message: "Succes get all data",
        data: result,
      });
    else
      res.status(500).send({
        succes: false,
        message: "Failed to fetch users data",
        data: [],
      });
  });
});

//get 1 data
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query(`SELECT * FROM users where id = ${id}`, (err, result, fields) => {
    if (!err)
      res.status(200).send({
        succes: true,
        message: "Succes get data by id",
        data: result,
      });
    else
      res.status(500).send({
        succes: false,
        message: "Failed get data by id",
        data: [],
      });
  });
});

//post method
app.post("/users", (req, res) => {
  const {
    name,
    phone,
    email,
    password,
    balance,
    verified,
    photo,
    pin,
  } = req.body;

  if (
    name &&
    phone &&
    email &&
    password &&
    balance &&
    verified &&
    photo &&
    pin
  ) {
    db.query(
      `INSERT INTO users (name, phone, email, password, balance, verified,photo, pin) VALUES
      ('${name}',
      '${phone}',
      '${email}',
      '${password}',
      '${balance}',
      ${verified},
      '${photo}',
      '${pin}')`,
      (err, result, fields) => {
        if (!err)
          res.status(201).send({
            succes: true,
            message: "Succes created user data",
            data: result,
          });
        else
          res.status(400).send({
            succes: false,
            message: "Failed created user data",
            data: [],
          });
        db.end();
      }
    );
  } else {
    res.status(400).send({
      succes: false,
      message: "all fiends must be filled",
      data: [],
    });
  }
});

//update method (patch)
app.patch('/users/:id', (req, res) => {
  const { id } = req.params
  const { name = '',
    phone = '',
    email = '',
    password = '',
    balance = '',
    verified = '',
    photo = '',
    pin = ''
  } = req.body
  
  if (name.trim() ||
    phone.trim() ||
    email.trim() ||
    password.trim() ||
    balance.trim() ||
    verified.trim() ||
    photo.trim() ||
    pin.trim()
  ) {
    db.query(`SELECT * FROM users where id = ${id}`, (err, result, fields) => {
      if (!err) {
        if (result.length) {
          const data = Object.entries(req.body).map(item => {
            return parseInt(item[1]) > 0
              ? `${item[0]} = ${item[1]}`
              : `${item[0]} = '${item[1]}'`;
          })
          let query = `UPDATE users SET ${data} WHERE id=${id}`
          db.query(query, (err, result, fields) => {
            if (result.affectedRows) {
              res.status(200).send({
                succes: true,
                message: `users ${id} succesfully update`
              })
            } else {
              res.status(400).send({
                succes: false,
                message: 'failed update user'
              })
            }
          })
        } else {
          res.status(400).send({
            succes: false,
            message: "id not found",
          });
        }
      } else
          res.status(500).send({
          succes: false,
          message: "Failed update user",
          data: [],
        });
    });
  }
})

//update method (put)
app.put("/users/:id", (req, res) => {
  const { id }=req.params
  const {
    name,
    phone,
    email,
    password,
    balance,
    verified,
    photo,
    pin,
  } = req.body;

  if (
    name &&
    phone &&
    email &&
    password &&
    balance &&
    verified &&
    photo &&
    pin
  ) {
    let query = `UPDATE users SET
    name = '${name}',
    phone = '${phone}',
    email = '${email}',
    password = '${password}',
    balance = '${balance}',
    verified = ${verified},
    photo = '${photo}',
    pin = '${pin}'
    where id=${id}`;
    db.query(query,(err, result, fields) => {
        if (!err)
          res.status(201).send({
            succes: true,
            message: `Succes update user data ${id}`,
            data: result,
          });
        else
          res.status(500).send({
            succes: false,
            message: "internal server error",
            data: [],
          });
        db.end();
      }
    );
  } else {
    res.status(400).send({
      succes: false,
      message: "all fiends must be filled",
      data: [],
    });
  }
});

//delete method
app.delete("/users/:id", (req, res) => {
  const {id} = req.params
  db.query(
    `DELETE FROM users where id = ${id}`,
    (err, result, fields) => {
      if (!err)
        res.status(200).send({
          succes: true,
          message: "Succes delete data",
          data: result,
        });
      else
        res.status(500).send({
          succes: false,
          message: "Failed delete user",
          data: [],
        });
    }
  );
});





app.listen(8000, () => {
  console.log("server running on port 8000");
});

// response.status(200).send({
//   succes: true,
//   message: "succes get all user data",
//   data: [
//     {
//       id: 45,
//       name: "Denny wahyudi marzuk",
//       username: "dennywm",
//       password: "12345678",
//     },
//     {
//       id: 45,
//       name: "Denny wahyudi marzuk",
//       username: "dennywm",
//       password: "12345678",
//     },
//     {
//       id: 45,
//       name: "Denny wahyudi marzuk",
//       username: "dennywm",
//       password: "12345678",
//     },
//   ],
// });