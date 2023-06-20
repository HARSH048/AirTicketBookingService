const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const apiRoutes = require("./routes/index");

const PORT = 6000;

const db = require("./models/index");
const SetupandStartServer = async () => {
  app.use(bodyparser.json());
  app.use(bodyparser.urlencoded({ extended: true }));

  app.use("/bookingservice/api", apiRoutes);
  app.listen(PORT, () => {
    console.log(`server started at ${PORT}`);
    if (process.env.DB_SYNC) {
      db.sequelize.sync({ alter: true });
    }
  });
};

SetupandStartServer();
