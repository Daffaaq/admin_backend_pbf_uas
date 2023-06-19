import { Sequelize } from "sequelize";
import db from "../config/Database.js";
// import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Wisata = db.define('dataWisata', {
    nama: DataTypes.STRING,
    lokasi: DataTypes.STRING,
    jam: DataTypes.STRING,
    harga: DataTypes.INTEGER,
    deskripsi: DataTypes.TEXT,
    gambar: DataTypes.STRING,
    url: DataTypes.STRING,
    url_gmaps: DataTypes.STRING,
    rating: DataTypes.FLOAT,
}, {
    freezeTableName: true
});


export default Wisata;

(async () => {
    await db.sync();
})();
