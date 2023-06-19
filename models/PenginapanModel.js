import { Sequelize } from "sequelize";
import db from "../config/Database.js";
// import Users from "./UserModel.js";


const {DataTypes} = Sequelize;

const Penginapan = db.define('dataPenginapan',{
    nama: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    gambar: DataTypes.STRING,
    url: DataTypes.STRING,
    url_gmaps: DataTypes.STRING,
    rating: DataTypes.FLOAT,
},{
    freezeTableName:true
});

// Users.hasMany(Penginapan);
// Penginapan.belongsTo(Users, { foreignKey: 'userId' });

export default Penginapan;

(async () => {
    await db.sync();
})()