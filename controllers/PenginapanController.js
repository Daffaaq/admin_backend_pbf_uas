import Penginapan from "../models/PenginapanModel.js";
import path from "path";
import fs from "fs";

export const getPenginapan = async (req, res) => {
    try {
        const response = await Penginapan.findAll();
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
export const getPenginapanById = async (req, res) => {
    try {
        const response = await Penginapan.findOne({
            where: {
                id: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}
export const createPenginapan = async (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/penginapan/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
        return res.status(422).json({ msg: "Image must be less than 5 MB" });

    file.mv(`./public/images/penginapan/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await Penginapan.create({
                nama: req.body.nama,
                deskripsi: req.body.deskripsi,
                url_gmaps: req.body.url_gmaps,
                rating: req.body.rating,
                gambar: fileName,
                url: url
            });
            res.status(201).json({ msg: "DataPenginapan Created Successfully" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
export const updatePenginapan = async (req, res) => {
    try {
        const penginapan = await Penginapan.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!penginapan) return res.status(404).json({ msg: "No Data Found" });

        let fileName = "";
        if (req.files === null) {
            fileName = Penginapan.gambar;
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

            const filepath = `./public/images/penginapan/${penginapan.gambar}`;
            fs.unlinkSync(filepath);

            file.mv(`./public/images/penginapan/${fileName}`, (err) => {
                if (err) return res.status(500).json({ msg: err.message });
            });
        }
        // const name = req.body.title;
        const url = `${req.protocol}://${req.get("host")}/images/penginapan/${fileName}`;

        await Penginapan.update(
            {
                nama: req.body.nama,
                gambar: fileName,
                deskripsi: req.body.deskripsi,
                url_gmaps: req.body.url_gmaps,
                rating: req.body.rating,
                url: url
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.status(200).json({ msg: "DataPenginapan Updated Successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const deletePenginapan = async (req, res) => {
    try {
        const penginapan = await Penginapan.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!penginapan) return res.status(404).json({ msg: "No Data Found" });

        const filepath = `./public/images/penginapan/${penginapan.gambar}`;
        fs.unlinkSync(filepath);

        await Penginapan.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "DataPenginapan Deleted Successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}