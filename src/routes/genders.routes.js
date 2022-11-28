const { Router } = require('express');
const { get_allGendersAp } = require("../controllers/genders.js")
const { Gender } = require('../db.js')

const router = Router()

router.get("/", async (req, res) =>{

    try {
            let Generos = await get_allGendersAp()
             await Generos.map(o => Gender.findOrCreate({
                where: {
                    name: [o.name],
                }
            })
            )
            const array = await Gender.findAll()
            res.status(200).json(array.map(g => g.name))
    } catch (error) {
        res.status(400).send(error)
    }
    
});

module.exports = router;