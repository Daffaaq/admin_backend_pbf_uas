import express from "express";
import {getPenginapan, 
    getPenginapanById,
    createPenginapan,
    updatePenginapan,
    deletePenginapan
} from "../controllers/PenginapanController.js";

const router = express.Router();

router.get('/Penginapan', getPenginapan);
router.get('/Penginapan/:id', getPenginapanById);
router.post('/Penginapan', createPenginapan);
router.patch('/Penginapan/:id', updatePenginapan);
router.delete('/Penginapan/:id', deletePenginapan);

export default router;