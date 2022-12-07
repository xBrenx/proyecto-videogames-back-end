const axios = require('axios');
require('dotenv').config();
const {API_KEY} = process.env;
  const { Videogame, Gender } = require('../db');
  const { Op }=require("sequelize")

 get_allVideogamesAp = async () => {
try {
  const allgames = []

for (let i = 1; i <= 5; i++) {
  let url = await axios({
    method: "get",
    url: `https://api.rawg.io/api/games?key=${API_KEY}&page=${i}`,
    headers: { "Accept-Encoding": "null" },
  })
  
  url.data.results.map(o => {
    allgames.push( {
      id: o.id,
      name: o.name,
     image: o.background_image,
     rating: o.rating,
     released: o.released,
     plataforms: o.platforms ?.map(a => a.platform.name) ,
     genders: o.genres?.map(o => o.name)
    })
  });
}
return allgames;
} catch (error) {
  console.log(error)
}
 };

 get_allVideogamesDb = async () => {
try {
  const games = await Videogame.findAll({
  include: {
    model: Gender,
    attributes: ["name"],
    through: {
      attributes: []
    }
  }
  })

  const final = [] 
   games.map(j => final.push({
            id: j.id,
            name: j.name,
            image: j.image,
            rating: j.rating,
            released: j.released,
            description: j.description,
            platforms: j.platforms,
            genders: j.genders.map(g=> g.name[0]),
            createdInDb: j.createdInDb
   }))
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

 get_oneVideogameAp = async (id) => {
       try {
        const juego = await axios({
          method: "get",
          url: `https://api.rawg.io/api/games/${id}?key=${API_KEY}`,
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

get_videogamebynameAp = async (name) => {
  const final = []
try {
  const res = await axios({
    method: "get",
    url:`https://api.rawg.io/api/games?key=${API_KEY}&search=${name}`,
    headers: { "Accept-Encoding": "null" },
  })
  res.data.results.map(o => {
    if(final.length < 15){
      final.push({
        id: o.id,
      name: o.name,
     image: o.background_image,
     rating: o.rating,
     plataforms: o.platforms ?.map(a => a.platform.name).join(", ") ,
     genres: o.genres?.map(o => o.name).join(", ") 

      })
    }
  })
  // console.log(final)
  return final;
} catch (error) {z
  console.log(error)
}
};

get_videogamebynameDb = async (name) => {
  try {
      let DBJuegosByName = await Videogame.findAll({
          where : {
              name : {[Op.iLike] : '%'+name+'%'}
          },
          include: {
              model: Gender,
              atributes: ['name'],
              throught: {
                  attributes: ['name']
              }
          } 
      })
      const resp = await DBJuegosByName.map(juego => {return{
          id: juego.id,
          description: juego.description,
          name: juego.name,
          rating: juego.rating,
          img: juego.background_image,
          platforms: juego.platforms,
          release: juego.released,
          createdInDb: juego.createdInDb,
          genres: juego.genres.map(genere=> genere.name)
      }})
      return resp
  } catch (error) {
      console.log(error)
  }
}

get_15games = async (name) => {
  try {
    const ApiInfo = await get_videogamebynameAp(name)
    const DBInfo = await get_videogamebynameDb(name)
    const allinfo = DBInfo.concat(ApiInfo).slice(0,15)
    return allinfo
} catch (error) {
    console.log(error)
}
};

module.exports = { get_allVideogamesAp, get_allVideogamesDb, get_oneVideogameDb, get_oneVideogameAp, get_15games }