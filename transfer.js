const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./src/helper/db");

//middleware
app.use(bodyParser.urlencoded({ extended: false }));

//get/read transfer receiver
app.get("/transfer/:idReceiver", (req, res) => {
  let {idReceiver} = req.params
  db.query(`SELECT profile.firstname, profile.phone, transfer.nominal, transfer.notes, transfer.date FROM profile INNER JOIN transfer ON profile.id = transfer.idReceiver WHERE transfer.idReceiver = ${idReceiver}`, (err, result, fields) => {
    if (!err)
      res.status(200).send({
        succes: true,
        message: "Succes get transfer data",
        data: result,
      });
    else
      res.status(500).send({
        succes: false,
        message: "Failed to fetch transfer data",
        data: [],
      });
  });
});

//post/create
app.post("/transfer", (req, res) => {
  const { idSender, idReceiver, nominal, notes } = req.body;

  if (idSender && idReceiver && nominal && notes) {
    db.query(
      `INSERT INTO transfer (idSender, idReceiver, nominal, notes) VALUES
      ('${idSender}',
      '${idReceiver}',
      '${nominal}',
      '${notes}')`,
      (err, result, fields) => {
        if (!err)
          res.status(201).send({
            succes: true,
            message: "Succes created transfer data",
            data: result,
          });
        else
          res.status(400).send({
            succes: false,
            message: "Failed created transfer data",
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
app.patch("/transfer/:id", (req, res) => {
  const { id } = req.params;
  const {
    idSender = "",
    idReceiver = "",
    nominal = "",
    notes = "",
    date = "",
  } = req.body;

  if (idSender.trim() || idReceiver.trim() || nominal.trim() || notes.trim() || date.trim()) {
    db.query(
      `SELECT * FROM transfer where id = ${id}`,
      (err, result, fields) => {
        if (!err) {
          if (result.length) {
            const data = Object.entries(req.body).map((item) => {
              return parseInt(item[1]) > 0
                ? `${item[0]} = ${item[1]}`
                : `${item[0]} = '${item[1]}'`;
            });
            let query = `UPDATE transfer SET ${data} WHERE id=${id}`;
            db.query(query, (err, result, fields) => {
              if (result.affectedRows) {
                res.status(200).send({
                  succes: true,
                  message: `transfer ${id} succesfully update`,
                });
              } else {
                res.status(400).send({
                  succes: false,
                  message: "failed update transfer",
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
            message: "Failed update transfer",
            data: [],
          });
      }
    );
  }
});

//delete
app.delete("/transfer/:id", (req, res) => {
  const { id } = req.params;
  db.query(`DELETE FROM transfer where id = ${id}`, (err, result, fields) => {
    if (!err)
      res.status(200).send({
        succes: true,
        message: "Succes delete transfer data",
        data: result,
      });
    else
      res.status(500).send({
        succes: false,
        message: "Failed delete transfer data",
        data: [],
      });
  });
});

app.listen(8000, () => {
  console.log("server running on port 8000");
});
