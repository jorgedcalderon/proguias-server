require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
var logger = require("morgan");
const app = express();
const { API_VERSION } = require("./config");
const cors = require("cors");

// Load routings
const authRoutes = require("./routers/auth");
const userRoutes = require("./routers/user");
const guiaRoutes = require("./routers/guia");
const menuRoutes = require("./routers/menu");
const newsletterRoutes = require("./routers/newsletter");
const courseRoutes = require("./routers/course");
const postRoutes = require("./routers/post");
const compeRoutes = require("./routers/competencias");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));

// Configure Header HTTP
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
//   next();
// });

app.options('*', cors({origin:"*"}))
app.use(cors({origin:"*"}));



// Router Basic
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, guiaRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);
app.use(`/api/${API_VERSION}`, newsletterRoutes);
app.use(`/api/${API_VERSION}`, courseRoutes);
app.use(`/api/${API_VERSION}`, postRoutes);
app.use(`/api/${API_VERSION}`, compeRoutes);

module.exports = app;
