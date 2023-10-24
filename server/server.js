const express = require("express");
const app = express();
const mssql = require("mssql");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "60mb" })); // เพิ่มขนาดข้อมูล JSON สูงสุด
app.use(express.urlencoded({ extended: true, limit: "60mb" })); // เพิ่มขนาดข้อมูล URL-encoded สูงสุด

const port = 3001;

const dbconfig = {
  user: "phuwanon",
  password: "0881509604",
  server: "localhost",
  database: "cpe",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const db = new mssql.ConnectionPool(dbconfig);

app.post("/personal", (req, res) => {
  db.connect()
    .then(() => {
      const sql =
        "INSERT INTO pro_user (EmployeeID, Fname, Lname, IDcard, Department, Area, Phone, Email, Image) VALUES (@ID, @fname, @lname, @IDcard, @department, @area, @phone, @email, @ImageBase64)";
      const request = new mssql.Request(db);

      request.input("ID", mssql.NVarChar, req.body.ID);
      request.input("Fname", mssql.NVarChar, req.body.fname);
      request.input("Lname", mssql.NVarChar, req.body.lname);
      request.input("IDcard", mssql.BigInt, req.body.IDcard);
      request.input("Department", mssql.NVarChar, req.body.Department);
      request.input("Area", mssql.NVarChar, req.body.Area);
      request.input("Phone", mssql.NVarChar, req.body.Phone);
      request.input("Email", mssql.NVarChar, req.body.Email);
      request.input("ImageBase64", mssql.NVarChar, req.body.ImageBase64);
      request.query(sql, (err, result) => {
        db.close();
        if (err) {
          console.error("SQL query error: ", err);
          return res
            .status(500)
            .json({ message: "An error occurred while inserting data." });
        }

        return res.json(result);
      });
    })
    .catch((err) => {
      console.error("Database connection error: ", err);
      return res.status(500).json({ message: "Database connection error." });
    });
});

app.get("/Userlist", (req, res) => {
  const sql = "SELECT * FROM pro_user";

  db.connect()
    .then(() => {
      const request = new mssql.Request(db);

      request.query(sql, (err, result) => {
        db.close();
        if (err) {
          console.error("SQL query error: ", err);
          return res
            .status(500)
            .json({ message: "An error occurred while fetching data." });
        }

        return res.json(result.recordset);
      });
    })
    .catch((err) => {
      console.error("Database connection error: ", err);
      return res.status(500).json({ message: "Database connection error." });
    });
});

app.delete("/personal/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "DELETE FROM pro_user WHERE EmployeeID = @id";

  db.connect().then((connection) => {
    const request = new mssql.Request(connection);
    request.input("id", mssql.NVarChar, userId);
    request.query(sql, (err, results) => {
      if (err) {
        console.error("Error deleting user", err);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล" });
      } else {
        console.log("User deleted successfully");
        res.json({ message: "ลบข้อมูลสำเร็จ" });
      }
      connection.release();
    });
  });
});

app.get("/getupdateuser/:id", (req, res) => {
  const userId = req.params.id;
  console.log("Received request for EmployeeID:", userId); // Debugging statement

  const sql = "SELECT * FROM pro_user WHERE EmployeeID = @id";
  console.log("SQL Query:", sql); // Debugging statement

  db.connect().then((connection) => {
    const request = new mssql.Request(connection);
    request.input("id", mssql.NVarChar, userId);

    request.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching user data", err);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการรับข้อมูลผู้ใช้" });
      } else {
        if (results.recordset.length === 0) {
          res.status(404).json({ error: "User not found" });
        } else {
          console.log("User data retrieved successfully");
          res.json(results.recordset[0]);
        }
      }
      connection.release();
    });
  });
});
app.post("/updateuser/:id", (req, res) => {
  const userid = req.params.id;
  const updatauser = req.body;
  console.log(updatauser);

  const sql =
    "UPDATE pro_user SET Department = @department, Fname = @fname, Lname = @lname,IDcard = @idcard,Area=@area,Email=@email,Phone=@phone,Image=@image WHERE EmployeeID = @id";
  db.connect().then((connection) => {
    const request = new mssql.Request(connection);
    request.input("id", mssql.NVarChar, userid);
    request.input("fname", mssql.NVarChar, updatauser.Fname);
    request.input("lname", mssql.NVarChar, updatauser.Lname);
    request.input("department", mssql.NVarChar, updatauser.Department);
    request.input("idcard", mssql.BigInt, req.body.IDcard);
      request.input("area", mssql.NVarChar, req.body.Area);
      request.input("phone", mssql.NVarChar, req.body.Phone);
      request.input("email", mssql.NVarChar, req.body.Email);
      request.input("image", mssql.NVarChar, req.body.Image);
    request.query(sql, (err, results) => {
      if (err) {
        console.error("Error updating user data", err);
        res
          .status(500)
          .json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้" });
      } else {
        if (results.rowsAffected === 0) {
          res.status(404).json({ error: "User not found" });
        } else {
          console.log("User data updated successfully");
          res.status(200).json({ message: "User data updated successfully" });
        }
      }
      connection.release();
    });
  });
});

app.listen(port, () => {
  console.log(`Connected successfully on port ${port}`);
});
