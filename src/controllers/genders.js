const axios = require('axios')
require('dotenv').config();
const {API_KEY} = process.env;
 const { Gender } = require('../db');


get_allGendersAp = async () => {
try {
  const url = await axios({
    method: "get",
    url: `https://api.rawg.io/api/genres?key=9d78726f7e85468488fa0a20cb392070`,
    headers: { "Accept-Encoding": "null" },
  })
  const allgenders = []
  
   url.data.results.map(o => {
     allgenders.push( {
       id: o.id,
       name: o.name,
       image_background: o.image_background,
       games: o.games?.map(e => e.name ).join(", ")
     })
  
   });
  return allgenders;
} catch (error) {
  console.log(error)
}
};

 get_oneGenderAp = async (id) => {
try {
  const url = await axios({
    method: "get",
    url: `https://api.rawg.io/api/genres?key=9d78726f7e85468488fa0a20cb392070`,
    headers: { "Accept-Encoding": "null" },
  })
  const all = await url.data.results.filter(b => b.id === id)
  const gender = await all[0].name
  return gender;
} catch (error) {
  console.log(error)
}
 };

 get_oneGenderDb = async (genero) => {
try {
  const gender = await Gender.findOne({where: {name: genero }})
return gender;
} catch (error) {
  console.log(error)
}
 };

module.exports = {get_allGendersAp,
  get_oneGenderAp, get_oneGenderDb}