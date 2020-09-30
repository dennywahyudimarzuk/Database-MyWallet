const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./src/helper/db");

//middleware
app.use(bodyParser.urlencoded({ extended: false }));

//get/read profile
app.get("/profile/:id", (req, res) => {
  let {id} = req.params
  db.query(`SELECT * FROM profile WHERE id=${id}`, (err, result, fields) => {
      if (!err)
        res.status(200).send({
          succes: true,
          message: "Succes get profile data",
          data: result,
        });
      else
        res.status(500).send({
          succes: false,
          message: "Failed get profile data",
          data: [],
        });
    }
  );
});

//post/create
app.post("/profile", (req, res) => {
  const {
    firstname,
    lastname,
    email,
    phone,
    balance,
    password,
    pin,
    verified,
    photo
  } = req.body;

  if (
    firstname &&
    lastname &&
    email &&
    phone &&
    balance &&
    password &&
    pin &&
    verified &&
    photo
  ) {
    db.query(
      `INSERT INTO profile (firstname, lastname, email, phone, balance, password, pin, verified, photo) VALUES
      ('${firstname}',
      '${lastname}',
      '${email}',
      '${phone}',
      '${balance}',
      '${password}',
      '${pin}',
      ${verified},
      '${photo}')`,
      (err, result, fields) => {
        if (!err)
          res.status(201).send({
            succes: true,
            message: "Succes created profile data",
            data: result,
          });
        else
          res.status(400).send({
            succes: false,
            message: "Failed created profile data",
            data: [],
          });
        db.end();
      }
    );
  } else {
    res.status(400).send({
      succes: false,
      message: "all fields must be filled",
      data: [],
    });
  }
});

//update patch
app.patch("/profile/:id", (req, res) => {
  const { id } = req.params;
  const {
    firstname = "",
    lastname = "",
    email = "",
    phone = "",
    balance = "",
    password = "",
    pin = "",
    verified = "",
    photo = ""
  } = req.body;

  if (
    firstname.trim() ||
    lastname.trim() ||
    email.trim() ||
    phone.trim() ||
    balance.trim() ||
    password.trim() ||
    pin.trim() ||
    verified.trim() ||
    photo.trim()
  ) {
    db.query(`SELECT * FROM profile where id = ${id}`, (err, result, fields) => {
      if (!err) {
        if (result.length) {
          const data = Object.entries(req.body).map((item) => {
            return parseInt(item[1]) > 0
              ? `${item[0]} = ${item[1]}`
              : `${item[0]} = '${item[1]}'`;
          });
          let query = `UPDATE profile SET ${data} WHERE id=${id}`;
          db.query(query, (err, result, fields) => {
            if (result.affectedRows) {
              res.status(200).send({
                succes: true,
                message: `profile ${id} succesfully update`,
              });
            } else {
              res.status(400).send({
                succes: false,
                message: "failed update profile",
              });
            }
          });
        } else {
          res.status(400).send({
            succes: false,
            message: "id not found",
          });
        }
      } else
        res.status(500).send({
          succes: false,
          message: "Failed update profile",
          data: [],
        });
    });
  }
});

//delete
app.delete("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.query(`DELETE FROM profile where id = ${id}`, (err, result, fields) => {
    if (!err)
      res.status(200).send({
        succes: true,
        message: "Succes delete data profile",
        data: result,
      });
    else
      res.status(500).send({
        succes: false,
        message: "Failed delete data profile",
        data: [],
      });
  });
});

app.listen(8000, () => {
  console.log("server running on port 8000");
});
