import express from "express";
import morgan from "morgan";

const PORT = 4000;
const app = express();
const logger = morgan("dev");

const handleHome =(req, res) => {
    res.send("hello")};
    
app.use(logger);
app.get("/", handleHome);


const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);
app.listen(4000,handleListening);