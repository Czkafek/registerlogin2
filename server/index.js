const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 3000;
const DB_URI = 'mongodb://localhost:27017/registerlogin2';

const User = require('./models/user.model');
const UserRouter = require('./routers/user.router');

app.use(cors());
app.use(express.json());
app.use("/", UserRouter);

mongoose.connect(DB_URI)
.then(() => console.log("Successfully connected to MongoDB"))
.catch(err => console.log(err));

app.listen(PORT, () => {
    console.log("Server is running on " + PORT + " port");
});

app.get('/', (req, res) => {
    res.send("Hi! It is server!");
})