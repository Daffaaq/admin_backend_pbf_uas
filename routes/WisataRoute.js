import express from "express";
import {getWisata, 
    getWisataById,
    createWisata,
    updateWisata,
    deleteWisata
} from "../controllers/WisataController.js";

const router = express.Router();

router.get('/Wisata', getWisata);
router.get('/Wisata/:id', getWisataById);
router.post('/Wisata', createWisata);
router.patch('/Wisata/:id', updateWisata);
router.delete('/Wisata/:id', deleteWisata);

export default router;