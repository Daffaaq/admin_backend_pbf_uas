import express from "express";
import {getKuliner, 
    getKulinerById,
    createKuliner,
    updateKuliner,
    deleteKuliner
} from "../controllers/KulinerController.js";

const router = express.Router();

router.get('/Kuliner', getKuliner);
router.get('/Kuliner/:id', getKulinerById);
router.post('/Kuliner', createKuliner);
router.patch('/Kuliner/:id', updateKuliner);
router.delete('/Kuliner/:id', deleteKuliner);

export default router;