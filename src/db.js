import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/youtubeClone", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const db = mongoose.connection;

const handleOpen = () => {
	console.log("✅ Connected to DB");
};
db.once("open", handleOpen);

const handleError = (error) => {
	console.log("❌ DB ERROR", error);
};
db.on("error", handleError);
