const express = require('express');
require('dotenv').config();
const connectDb = require('./config/db');
const cors = require('cors');

const PORT = process.env.PORT;

const app = express();
app.use(cors());
connectDb();

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects",require("./routes/projectRoutes"));
app.use("/api/tasks",require("./routes/taskRoutes"));
app.use("/api/subtasks",require("./routes/subTaskRoutes"));

app.listen(PORT,()=>{
    console.log(`App listen at ${PORT} port`);
})