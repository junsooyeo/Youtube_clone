import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
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
