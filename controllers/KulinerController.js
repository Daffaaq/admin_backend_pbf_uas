import Kuliner from "../models/KulinerModel.js";
import path from "path";
import fs from "fs";

export const getKuliner = async (req, res) => {
    try {
        const response = await Kuliner.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

// export const getWisata = async (_req, res) =>{
//     try{
//         const response = await Wisata.findAll();
//         res.status(200).json(response);
//     } catch (error) {
//         console.log(error.message);
//     }
// }
export const getKulinerById = async (req, res) => {
    try {
        const response = await Kuliner.findOne({
            where: {
                id: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}
export const createKuliner = async (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/kuliner/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
        return res.status(422).json({ msg: "Image must be less than 5 MB" });

    file.mv(`./public/images/kuliner/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await Kuliner.create({
                nama: req.body.nama,
                lokasi: req.body.lokasi,
                deskripsi: req.body.deskripsi,
                url_gmaps: req.body.url_gmaps,
                gambar: fileName,
                url: url
            });
            res.status(201).json({ msg: "DataKuliner Created Successfully" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
export const updateKuliner = async (req, res) => {
    try {
        const kuliner = await Kuliner.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!kuliner) return res.status(404).json({ msg: "No Data Found" });

        let fileName = "";
        if (req.files === null) {
            fileName = Kuliner.gambar;
        } else {
            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            fileName = file.md5 + ext;
            const allowedType = [".png", ".jpg", ".jpeg"];

            if (!allowedType.includes(ext.toLowerCase()))
                return res.status(422).json({ msg: "Invalid Images" });
            if (fileSize > 5000000)
                return res.status(422).json({ msg: "Image must be less than 5 MB" });

            const filepath = `./public/images/kuliner/${kuliner.gambar}`;
            fs.unlinkSync(filepath);

            file.mv(`./public/images/kuliner/${fileName}`, (err) => {
                if (err) return res.status(500).json({ msg: err.message });
            });
        }
        // const name = req.body.title;
        const url = `${req.protocol}://${req.get("host")}/images/kuliner/${fileName}`;

        await Kuliner.update(
            {
                nama: req.body.nama,
                lokasi: req.body.lokasi,
                deskripsi: req.body.deskripsi,
                url_gmaps: req.body.url_gmaps,
                gambar: fileName,
                url: url
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.status(200).json({ msg: "DataKuliner Updated Successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const deleteKuliner = async (req, res) => {
    try {
        const kuliner = await Kuliner.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!kuliner) return res.status(404).json({ msg: "No Data Found" });

        const filepath = `./public/images/kuliner/${kuliner.gambar}`;
        fs.unlinkSync(filepath);

        await Kuliner.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "DataKuliner Deleted Successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}