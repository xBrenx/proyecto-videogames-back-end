const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('gender', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          name: {
            type: DataTypes.ARRAY(DataTypes.ENUM(
              "Action", "Indie", "Adventure", "RPG", "Strategy", "Shooter", "Casual", "Simulation", "Puzzle", "Arcade", "Platformer", "Racing", "Massively Multiplayer", "Sports", "Fighting", "Family", "Board Games", "Educational", "Card"
           )),
          }
    },{timestamps: false});
};