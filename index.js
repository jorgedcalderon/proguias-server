const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3500;
const { API_VERSION, IP_SERVER, PORT_DB, MONGO_URI } = require("./config");
const mongoURILocal = `mongodb://${IP_SERVER}:${PORT_DB}/proguias`;
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

mongoose.connect(
  MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("La conexion a la base de datos es correcta.");

      app.listen(port, () => {
        console.log("######################");
        console.log("###### API RESTO ######");
        console.log("######################");
        console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`);
      });
    }
  }
);
