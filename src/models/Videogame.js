const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('videogame', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    image:{
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    released: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    rating: {
      type: DataTypes.FLOAT,
    },
    platforms: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    createdInDb: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },{timestamps: false});
};
