const { Router } = require('express');
 const { get_allVideogamesAp,
      get_allVideogamesDb,
     get_oneVideogameDb,
     get_oneVideogameAp, 
     get_15games } = require("../controllers/videogames")
      const { Videogame, Gender } = require('../db.js')

const router = Router()

 router.get("/", async (req, res)=>{
const { name }= req.query;
    try {
        if(!name){
            let allgames= await get_allVideogamesAp()
            let resp = await get_allVideogamesDb()
    
            let final = [...resp,...allgames]
            res.status(200).send(final)
        }else{
            const resp = await get_15games(name)
            // console.log(resp)
            res.status(200).send(resp)
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
 });

router.get("/:id", async (req, res)=>{
    const { id }= req.params;
    var boo = false

    for (let i = 0; i < id.length; i++) {
        if(id[i] >= 'a'){
            boo = true
        } 
    }
    try {
        if(boo){
            const res2 = await get_oneVideogameDb(id)
            res.status(200).send(res2)
        }else{
            const res1 = await get_oneVideogameAp(id)
             res.status(200).json(res1)
        }
        
    } catch (error) {
        res.status(400).send(error)
    }
});

router.post("/", async (req, res)=>{
    const { name, image, platforms, description, 
        released, rating, gender }=req.body;

 try {
    if (rating === undefined) rating = null;
    if (released === undefined) released = null;
    const result = await Videogame.create({ 
        name, image, platforms, 
        description, released, rating });
        
        gender.forEach(async element => {
            const [ genre, created ] = await Gender.findOrCreate({
                where: {
                    name: [element],
                }});
            await result.addGender(genre)
            console.log(created)
        });
    res.status(200).send(result)
 } catch (error) {
    res.status(404).send(error.message)
 }
});

 router.delete("/", async (req, res)=>{
    try {
        const { name }=req.query;
        const games = await Videogame.findAll()
        if(!name){
           return res.status(200).send(games)
        }if(!games){
            return res.status(200).json({ msg: "No se encontraron los videojuegos."})
        }else{
            const videogame = await Videogame.destroy({where: {
                name: [name]}})
            //     let allgames= await get_allVideogamesAp()
            // let resp = await get_allVideogamesDb()
    
            // let final = [...allgames,...resp]
                return res.status(200).json({ msg: "Juego eliminado."})
        }
    } catch (error) {
        console.log(error)
    }
 });

 module.exports = router;
