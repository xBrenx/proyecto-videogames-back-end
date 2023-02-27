const axios = require('axios');
require('dotenv').config();
const {API_KEY} = process.env;
  const { Videogame, Gender } = require('../db');
  const { Op }=require("sequelize")

  getVideogamesDatabase = async (InDb) => {

    let games = await Videogame.findAll({
      where: {
        createdInDb : InDb
      },
      include: {
        model: Gender,
        attributes: ["name"],
        through: {
          attributes: []
        }
      }
      });
    
      const allgamesDb = [] 
       games.map(j => allgamesDb.push({
                id: j.id,
                name: j.name,
                image: j.image,
                rating: j.rating,
                released: j.released,
                description: j.description,
                platforms: j.platforms,
                genders: j.genders.map(g=> g.name[0]),
                createdInDb: j.createdInDb
       }));

       return allgamesDb;

  }
  
 get_oneVideogameAp = async (id) => {
  try {

   const juego = await axios({
     method: "get",
     url: `https://api.rawg.io/api/games/${id}?key=9d78726f7e85468488fa0a20cb392070`,
     headers: { "Accept-Encoding": "null" },
   })
   let final = [juego.data].map(a => ({
       id: a.id,
       name: a.name,
       image: a.background_image,
       genders: a.genres.map(gen => gen.name),
       description: a.description_raw,
       released: a.released,
       rating: a.rating,
       platforms: a.platforms.map(plat => plat.platform.name)
   }))
   return final[0]
  } catch (error) {
   console.log(error)
  }
};

const SaveInDb = async (allgamesAp) => {

    allgamesAp.map( async (oneVideogameAp) => {
  
    let result = await Videogame.create({
      name: oneVideogameAp.name,
      image: oneVideogameAp.image,
      rating: oneVideogameAp.rating,
      released: oneVideogameAp.released,
      description: oneVideogameAp.description,
      platforms: oneVideogameAp.platforms,
      genders: oneVideogameAp.genders,
      createdInDb: oneVideogameAp.createdInDb
    })
    
    oneVideogameAp.genders.forEach(async (element) => {
      const [genre, created] = await Gender.findOrCreate({
        where: {
          name: [element],
        },
      });
    
      await result.addGender(genre);
    });

  })


}

 get_allVideogamesAp = async () => {
try {

  //Llamamos a todos los juegos guardados en la base de datos, donde createdInDb sea false. Que incluya los nombres de los generos.

  let games = await getVideogamesDatabase(false)
    
     if(games.length > 0){
      console.log("devuelvo DB");
      return games;
     }else{

      //TOMAMOS LA INFORMACIÓN DE LA API----------
      let id = 1
      const allgamesAp = []
      for (let i = 1; i <= 6; i++) {
        let url = await axios({
          method: "get",
          url: `https://api.rawg.io/api/games?key=9d78726f7e85468488fa0a20cb392070&page=${i}`,
          headers: { "Accept-Encoding": "null" },
        })
        
        url.data.results.map(async (o) => {
          let desc = await get_oneVideogameAp(o.id)
          allgamesAp.push( {
            id: id,
            name: o.name,
           image: o.background_image,
           rating: o.rating,
           released: o.released,
           description: desc.description,
           platforms: o.platforms ?.map(a => a.platform.name) ,
           genders: o.genres?.map(o => o.name),
           createdInDb: false
          })
          id = id + 1
        });
      }

      //Lo guardamos en la base de datos-----------

      const saved = await SaveInDb(allgamesAp)

     return allgamesAp;
     }
} catch (error) {
  console.log(error)
}
 };


 

 get_allVideogamesDb = async () => {
try {
  const final = await getVideogamesDatabase(true)
  
  return final;
} catch (error) {
  console.log(error)
}
 };

 get_oneVideogameDb = async (uuid) => {
  try {
    const res = await Videogame.findAll({
      where : {
          id : uuid
      },
      include: {
          model: Gender,
          atributes: ['name'],
          throught: {
              attributes: []
          }
      } 
  });

  const game = await res.map(j => {return {
    id: j.id,
    description: j.description,
    name: j.name,
    rating: j.rating,
    image: j.image,
    platforms: j.platforms,
    released: j.released,
    createdInDb: j.createdInDb,
    genders: j.genders.map(g => g.name[0])
  }})

     return game;
  } catch (error) {
    console.log(error)
  }
 };

get_videogamebynameAp = async (name) => {
try {
  const allGames = await getVideogamesDatabase(false)

    const final = await allGames?.filter(g => g.name.toLowerCase().includes(name.toLowerCase()))
  
    return final;
} catch (error) {
  console.log(error)
}
};

get_videogamebynameDb = async (name) => {
  try {
    const allGames = await getVideogamesDatabase(true)
  if(allGames.length > 0){
    const final = await allGames?.filter(g => g.name.toLowerCase().includes(name.toLowerCase()))
    
    return final;
  }else{
    return "Nothing";
  }
  } catch (error) {
      console.log(error)
  }
}

get_15games = async (name) => {
  try {
    const ApiInfo = await get_videogamebynameAp(name)
    const DBInfo = await get_videogamebynameDb(name)

   if(DBInfo !== "Nothing"){

    let allinfo = DBInfo.concat(ApiInfo).slice(0,15)
    return allinfo;
   }else{
  
    let allinfo = ApiInfo.slice(0,15)
    return allinfo;
   }
} catch (error) {
    console.log(error)
}
};

module.exports = { get_allVideogamesAp, get_allVideogamesDb, get_oneVideogameDb, get_oneVideogameAp, get_15games }