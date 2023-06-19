import { Sequelize } from "sequelize";
import db from "../config/Database.js";
// import Users from "./UserModel.js";


const { DataTypes } = Sequelize;

const Kuliner = db.define('dataKuliner', {
  nama: DataTypes.STRING,
  deskripsi: DataTypes.TEXT,
  gambar: DataTypes.STRING,
  url: DataTypes.STRING,
  url_gmaps: DataTypes.STRING,
}, {
  freezeTableName: true,
});


export default Kuliner;

(async () => {
  await db.sync();
})()