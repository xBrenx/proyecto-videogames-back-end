const { Router } = require('express');

const gendersRoute = require("./genders.routes.js");
 const videogamesRoute = require("./videogames.routes.js");

const router = Router();

  router.use("/videogames", videogamesRoute)
 router.use("/genders", gendersRoute)

module.exports = router;