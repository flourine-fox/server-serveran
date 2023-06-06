const express = require("express");
const app = express();
const { User } = require("./models");

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// handler
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: `user with email ${user.email} has been created`,
    });
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      res.status(400).json({
        message: err.errors[0].message,
      });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

app.listen(3000, () => console.log("app run in port: 3000"));
