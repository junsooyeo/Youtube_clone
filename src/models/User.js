import mongoose from "mongoose";
import bcrypt from "bcrypt";
let saltRounds = 5;

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	avatarURL: { type: String },
	socialOnly: { type: Boolean, default: false },
	username: { type: String, required: true },
	password: { type: String },
	location: String,
	videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "video" }],
});

userSchema.pre("save", async function () {
	if (this.isModified("password"))
		this.password = await bcrypt.hash(this.password, saltRounds);
});

const User = mongoose.model("User", userSchema);
export default User;
