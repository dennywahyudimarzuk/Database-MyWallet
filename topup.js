const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./src/helper/db");

//middleware
app.use(bodyParser.urlencoded({ extended: false }));

//get/read
app.get("/topup", (req, res) => {
  db.query("SELECT * FROM topup", (err, result, fields) => {
      if (!err)
        res.status(200).send({
          succes: true,
          message: "Succes get topup data",
          data: result,
        });
      else
        res.status(500).send({
          succes: false,
          message: "Failed to fetch topup data",
          data: [],
        });
    }
  );
});

//post/create
app.post("/topup", (req, res) => {
  const { idTopup, stepTopup } = req.body;

  if (idTopup && stepTopup) {
    db.query(
      `INSERT INTO topup (idTopup, stepTopup) VALUES
      ('${idTopup}',
      '${stepTopup}')`,
      (err, result, fields) => {
        if (!err)
          res.status(201).send({
            succes: true,
            message: "Succes created topup data",
            data: result,
          });
        else
          res.status(400).send({
            succes: false,
            message: "Failed created topup data",
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

//update put
app.put("/topup/:id", (req, res) => {
  const { id } = req.params;
  const { idTopup, stepTopup } = req.body;

  if (idTopup && stepTopup) {
    let query = `UPDATE topup SET
    idTopup = '${idTopup}',
    stepTopup = '${stepTopup}'
  
    where id=${id}`;
    db.query(query, (err, result, fields) => {
      if (!err)
        res.status(201).send({
          succes: true,
          message: `Succes update topup data ${id}`,
          data: result,
        });
      else
        res.status(500).send({
          succes: false,
          message: "internal server error",
          data: [],
        });
      db.end();
    });
  } else {
    res.status(400).send({
      succes: false,
      message: "all fields must be filled",
      data: [],
    });
  }
});

//delete
app.delete("/topup/:id", (req, res) => {
  const { id } = req.params;
  db.query(`DELETE FROM topup where id = ${id}`, (err, result, fields) => {
    if (!err)
      res.status(200).send({
        succes: true,
        message: "Succes delete topup data",
        data: result,
      });
    else
      res.status(500).send({
        succes: false,
        message: "Failed delete topup data",
        data: [],
      });
  });
});

app.listen(8000, () => {
  console.log("server running on port 8000");
});
