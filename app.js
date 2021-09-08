require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
var logger = require("morgan");
const app = express();
const { API_VERSION } = require("./config");
const cors = require("cors");
// Load routings

// var whitelist = ["http:localhost:3000", "https://proguias.cl","http://proguias.cl"]
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

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
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept"
//   );
//   if(req.method === "OPTIONS"){
//     res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   }
//   next();
// });
app.options('*', cors())
app.use(cors());
app.use((req, res, next) => {
  console.log(res.header['Access-Control-Allow-Headers']);
  console.log("REQUEST METHOD",req.method);
  next();
});


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
