const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const PORT = process.env.PORT || 5000;

const admin = require("firebase-admin");
const credentials = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});
const db = admin.firestore();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("SecqurAise is available");
});

app.post("/create", async (req, res) => {
  try {
    const id = req.body.userId;
    const user = {
      id: id,
      name: req.body.name,
      image: req.body.image,
      location: req.body.location,
      gender: req.body.gender,
      date: req.body.date,
      time: req.body.time,
    };
    const response = db.collection("users").doc(id).set(user);
    res.send(response);
  } catch (error) {
    res.status(500).send({ message: "Error adding data", error });
  }
});

app.get("/users", async (req, res) => {
  try {
    const usersRef = db.collection("users");
    const response = await usersRef.get();
    let responseArray = [];
    response.forEach((doc) => {
      responseArray.push(doc.data());
    });
    res.send(responseArray);
  } catch (error) {
    res.send(error);
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.params.id);
    const response = await userRef.get();
    res.send(response.data());
  } catch (error) {
    res.send(error);
  }
});

app.get("/male", async (req, res) => {
  try {
    const usersRef = db.collection("users");
    const response = await usersRef.where("gender", "==", "Male").get();
    let responseArray = [];
    response.forEach((doc) => {
      responseArray.push(doc.data());
    });
    res.send(responseArray);
  } catch (error) {
    res.send(error);
  }
});

app.get("/female", async (req, res) => {
  try {
    const usersRef = db.collection("users");
    const response = await usersRef.where("gender", "==", "Female").get();
    let responseArray = [];
    response.forEach((doc) => {
      responseArray.push(doc.data());
    });
    res.send(responseArray);
  } catch (error) {
    res.send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
