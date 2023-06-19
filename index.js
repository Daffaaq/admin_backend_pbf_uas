import express from "express";
import FileUpload from "express-fileupload";
import cors from "cors";
// import UserRoute from "./routes/UserRoute.js";
import WisataRoute from "./routes/WisataRoute.js";
import PenginapanRoute from "./routes/PenginapanRoute.js";
import KulinerRoute from "./routes/KulinerRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(FileUpload());
app.use(WisataRoute);
app.use(PenginapanRoute);
app.use(KulinerRoute);
app.use(express.static("public"));

app.listen(5000, () => console.log('Server Up and Running...'));