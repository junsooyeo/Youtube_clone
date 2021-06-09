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
});

userSchema.pre("save", async function () {
	console.log("before", this.password);
	this.password = await bcrypt.hash(this.password, saltRounds);
	console.log("after", this.password);
});

const User = mongoose.model("User", userSchema);
export default User;
