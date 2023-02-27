const { Router } = require("express");
const {
  get_allVideogamesAp,
  get_allVideogamesDb,
  get_oneVideogameDb,
  get_oneVideogameAp,
  get_15games,
} = require("../controllers/videogames");
const { Videogame, Gender } = require("../db.js");

const router = Router();

router.get("/", async (req, res) => {
  const { name } = req.query;
 
  try {
    if (!name) {
      let allgames = await get_allVideogamesAp();
      let resp = await get_allVideogamesDb();

      let final = [...resp, ...allgames];
      res.status(200).send(final);
    } else {
     
      const resp = await get_15games(name);
       console.log(resp)
      res.status(200).send(resp);
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
      const res2 = await get_oneVideogameDb(id);
      console.log(res2);
      res.status(200).send(res2);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/", async (req, res) => {
  const { name, image, platforms, description, released, rating, gender } =
    req.body;

    const createdInDb = true

  try {
    const result = await Videogame.create({
      name,
      image,
      platforms,
      description,
      released,
      rating,
      gender,
      createdInDb
    });

    gender.forEach(async (element) => {
      const [genre, created] = await Gender.findOrCreate({
        where: {
          name: [element],
        },
      });
      await result.addGender(genre);
      console.log(created);
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(404).send(error.message);
  }
});


module.exports = router;
