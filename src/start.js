import app from "./server.js";
import "./db.js";
import "./models/video.js";

const PORT = 4000;

const handleListening = () =>
	console.log(`✅ Server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
