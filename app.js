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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).json({ message: `Email is required` });
    return;
  }

  if (!password) {
    res.status(400).json({ message: `password is required` });
    return;
  }
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({
        message: "Email or Password is wrong",
      });
      return;
    }

    const isValidPassword = comparePassword(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({
        message: "Email or Password is wrong",
      });
      return;
    }

    const access_token = signToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    res.json({ access_token });
  } catch (err) {
    res.status(500).json({ message: "ISE" });
  }
});

app.listen(3000, () => console.log("app run in port: 3000"));
