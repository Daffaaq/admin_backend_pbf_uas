import Wisata from "../models/WisataModel.js";
import path from "path";
import fs from "fs";

export const getWisata = async (req, res) => {
    try {
        const response = await Wisata.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

// export const getWisata = async (req, res) => {
//     try {
//         let response;
//         if (req.role === "admin") {
//             response = await Wisata.findAll({
//                 attributes: ['uuid', 'nama', 'harga', 'lokasi', 'deskripsi', 'gambar', 'url'],
//                 include: [{
//                     model: Users,
//                     attributes: ['name', 'email']
//                 }]
//             });
//         } else {
//             response = await Wisata.findAll({
//                 attributes: ['uuid', 'nama', 'harga', 'lokasi', 'deskripsi', 'gambar', 'url'],
//                 where: {
//                     userId: req.userId
//                 },
//                 include: [{
//                     model: Users,
//                     attributes: ['name', 'email']
//                 }]
//             });
//         }
//         res.status(200).json(response);
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// };

// export const getWisata = async (_req, res) =>{
//     try{
//         const response = await Wisata.findAll();
//         res.status(200).json(response);
//     } catch (error) {
//         console.log(error.message);
//     }
// }

// export const getWisataById = async (req, res) => {
//     try {
//         const wisata = await Wisata.findOne({
//             where: {
//                 uuid: req.params.id
//             }
//         });
//         if (!wisata) return res.status(404).json({ msg: "Data tidak ditemukan" });
//         let response;
//         if (req.role === "admin") {
//             response = await Wisata.findOne({
//                 attributes: ['uuid', 'nama', 'harga', 'lokasi', 'deskripsi', 'gambar', 'url'],
//                 where: {
//                     id: wisata.id
//                 },
//                 include: [{
//                     model: Users,
//                     attributes: ['name', 'email']
//                 }]
//             });
//         } else {
//             response = await Wisata.findOne({
//                 attributes: ['uuid', 'nama', 'harga', 'lokasi', 'deskripsi', 'gambar', 'url'],
//                 where: {
//                     [Op.and]: [{ id: wisata.id }, { userId: req.userId }]
//                 },
//                 include: [{
//                     model: Users,
//                     attributes: ['name', 'email']
//                 }]
//             });
//         }
//         res.status(200).json(response);
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// };


export const getWisataById = async (req, res) => {
    try {
        const response = await Wisata.findOne({
            where: {
                id: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}


export const createWisata = async (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/wisata/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
        return res.status(422).json({ msg: "Image must be less than 5 MB" });

    file.mv(`./public/images/wisata/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await Wisata.create({
                nama: req.body.nama,
                lokasi: req.body.lokasi, // Tambahkan properti lokasi
                jam: req.body.jam, // Tambahkan properti jam
                harga: req.body.harga, // Tambahkan properti harga
                deskripsi: req.body.deskripsi, // Tambahkan properti deskripsi
                url_gmaps: req.body.url_gmaps,
                rating: req.body.rating,
                gambar: fileName,
                url: url
            });
            res.status(201).json({ msg: "DataWisata Created Successfully" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

// export const createWisata = async (req, res) => {
//     if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
//     const file = req.files.file;
//     const fileSize = file.data.length;
//     const ext = path.extname(file.name);
//     const fileName = file.md5 + ext;
//     const url = `${req.protocol}://${req.get("host")}/images/wisata/${fileName}`;
//     const allowedType = [".png", ".jpg", ".jpeg"];

//     if (!allowedType.includes(ext.toLowerCase()))
//         return res.status(422).json({ msg: "Invalid Images" });
//     if (fileSize > 5000000)
//         return res.status(422).json({ msg: "Image must be less than 5 MB" });

//     file.mv(`./public/images/wisata/${fileName}`, async (err) => {
//         if (err) return res.status(500).json({ msg: err.message });
//         try {
//             await Wisata.create({
//                 nama: req.body.nama,
//                 lokasi: req.body.lokasi, // Tambahkan properti lokasi
//                 jam: req.body.jam, // Tambahkan properti jam
//                 harga: req.body.harga, // Tambahkan properti harga
//                 userId: req.body.userId,
//                 deskripsi: req.body.deskripsi, // Tambahkan properti deskripsi
//                 gambar: fileName,
//                 url: url
//             });
//             res.status(201).json({ msg: "DataWisata Created Successfully" });
//         } catch (error) {
//             console.log(error.message);
//             res.status(500).json({ error: "Internal Server Error" });
//         }
//     });
}



export const updateWisata = async (req, res) => {
    try {
        const wisata = await Wisata.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!wisata) return res.status(404).json({ msg: "No Data Found" });

        let fileName = "";
        if (req.files === null) {
            fileName = Wisata.gambar;
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

            const filepath = `./public/images/wisata/${wisata.gambar}`;
            fs.unlinkSync(filepath);

            file.mv(`./public/images/wisata/${fileName}`, (err) => {
                if (err) return res.status(500).json({ msg: err.message });
            });
        }
        // const name = req.body.title;
        const url = `${req.protocol}://${req.get("host")}/images/wisata/${fileName}`;

        await Wisata.update(
            {
                nama: req.body.nama,
                lokasi: req.body.lokasi, // Tambahkan properti lokasi
                jam: req.body.jam, // Tambahkan properti jam
                harga: req.body.harga, // Tambahkan properti harga
                deskripsi: req.body.deskripsi, // Tambahkan properti deskripsi
                url_gmaps: req.body.url_gmaps,
                rating: req.body.rating,
                gambar: fileName,
                url: url
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.status(200).json({ msg: "DataWisata Updated Successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// export const updateWisata = async (req, res) => {
//     try {
//         const wisata = await Wisata.findOne({
//             where: {
//                 uuid: req.params.id,
//             },
//         });
//         if (!wisata) return res.status(404).json({ msg: "No Data Found" });

//         let fileName = "";
//         if (req.files === null) {
//             fileName = Wisata.gambar;
//         } else {
//             const file = req.files.file;
//             const fileSize = file.data.length;
//             const ext = path.extname(file.name);
//             fileName = file.md5 + ext;
//             const allowedType = [".png", ".jpg", ".jpeg"];

//             if (!allowedType.includes(ext.toLowerCase()))
//                 return res.status(422).json({ msg: "Invalid Images" });
//             if (fileSize > 5000000)
//                 return res.status(422).json({ msg: "Image must be less than 5 MB" });

//             const filepath = `./public/images/wisata/${wisata.gambar}`;
//             fs.unlinkSync(filepath);

//             file.mv(`./public/images/wisata/${fileName}`, (err) => {
//                 if (err) return res.status(500).json({ msg: err.message });
//             });
//         }
//         // const name = req.body.title;
//         const url = `${req.protocol}://${req.get("host")}/images/wisata/${fileName}`;

//         if (req.role === "admin") {
//             await Wisata.update(
//                 {
//                     nama: req.body.nama,
//                     lokasi: req.body.lokasi, // Tambahkan properti lokasi
//                     jam: req.body.jam, // Tambahkan properti jam
//                     harga: req.body.harga, // Tambahkan properti harga
//                     deskripsi: req.body.deskripsi, // Tambahkan properti deskripsi
//                     gambar: fileName,
//                     url: url
//                 },
//                 {
//                     where: {
//                         id: req.params.id,
//                     },
//                 }
//             );
//         } else {
//             if (req.userId !== wisata.userId) return res.status(403).json({ msg: "Akses terlarang" });
//             await Wisata.update({
//                 nama: req.body.nama,
//                 lokasi: req.body.lokasi, // Tambahkan properti lokasi
//                 jam: req.body.jam, // Tambahkan properti jam
//                 harga: req.body.harga, // Tambahkan properti harga
//                 deskripsi: req.body.deskripsi, // Tambahkan properti deskripsi
//                 gambar: fileName,
//                 url: url
//             }, {
//                 where: {
//                     [Op.and]: [{ id: wisata.id }, { userId: req.userId }]
//                 }
//             });
//         }
//         res.status(200).json({ msg: "DataWisata Updated Successfully" });
//         // await Wisata.update(
//         //     {
//         //         nama: req.body.nama,
//         //         lokasi: req.body.lokasi, // Tambahkan properti lokasi
//         //         jam: req.body.jam, // Tambahkan properti jam
//         //         harga: req.body.harga, // Tambahkan properti harga
//         //         deskripsi: req.body.deskripsi, // Tambahkan properti deskripsi
//         //         gambar: fileName,
//         //         url: url
//         //     },
//         //     {
//         //         where: {
//         //             id: req.params.id,
//         //         },
//         //     }
//         // // );
//         // res.status(200).json({ msg: "DataWisata Updated Successfully" });
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }



export const deleteWisata = async (req, res) => {
    try {
        const wisata = await Wisata.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!wisata) return res.status(404).json({ msg: "No Data Found" });

        const filepath = `./public/images/wisata/${wisata.gambar}`;
        fs.unlinkSync(filepath);

        await Wisata.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "DataWisata Deleted Successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
// export const deleteWisata = async (req, res) => {
//     try {
//         const wisata = await Wisata.findOne({
//             where: {
//                 uuid: req.params.id,
//             },
//         });
//         if (!wisata) return res.status(404).json({ msg: "No Data Found" });

//         const filepath = `./public/images/wisata/${wisata.gambar}`;
//         fs.unlinkSync(filepath);

//         if (req.role === "admin") {
//             await Wisata.update(
//                 {
//                     nama: req.body.nama,
//                     lokasi: req.body.lokasi, // Tambahkan properti lokasi
//                     jam: req.body.jam, // Tambahkan properti jam
//                     harga: req.body.harga, // Tambahkan properti harga
//                     deskripsi: req.body.deskripsi, // Tambahkan properti deskripsi
//                     gambar: fileName,
//                     url: url
//                 },
//                 {
//                     where: {
//                         id: req.params.id,
//                     },
//                 }
//             );
//         } else {
//             if (req.userId !== wisata.userId) return res.status(403).json({ msg: "Akses terlarang" });
//             await Wisata.update({
//                 nama: req.body.nama,
//                 lokasi: req.body.lokasi, // Tambahkan properti lokasi
//                 jam: req.body.jam, // Tambahkan properti jam
//                 harga: req.body.harga, // Tambahkan properti harga
//                 deskripsi: req.body.deskripsi, // Tambahkan properti deskripsi
//                 gambar: fileName,
//                 url: url
//             }, {
//                 where: {
//                     [Op.and]: [{ id: wisata.id }, { userId: req.userId }]
//                 }
//             });
//         }
//         res.status(200).json({ msg: "DataWisata Updated Successfully" });
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }