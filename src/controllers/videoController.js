import Video from "../models/video";
import User from "../models/User";

export const home = async (req, res) => {
	const videos = await Video.find({});
	return res.render("home", { pageTitle: "HOME", videos });
};
export const watch = async (req, res) => {
	const { id } = req.params;
	const video = await Video.findById(id).populate("owner");
	if (!video) {
		return res.status(404).render("404", { pageTitle: "VIDEO NOT FOUND." });
	}
	return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
	const { id } = req.params;
	const {
		user: { _id },
	} = req.session;
	const video = await Video.findById(id);
	if (!video) {
		return res.status(404).render("404", { pageTitle: "VIDEO NOT FOUND." });
	}
	if (String(video.owner) !== String(_id)) {
		return res.status(403).redirect("/");
	}
	return res.render("edit", { pageTitle: `edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
	const { id } = req.params;
	const {
		user: { _id },
	} = req.session;
	const { title, description, hashtags } = req.body;
	const video = await Video.exists({ _id: id });
	if (!video) {
		return res.status(404).render("404", { pageTitle: "VIDEO NOT FOUND." });
	}

	if (String(video.owner) !== String(_id)) {
		return res.status(403).redirect("/");
	}

	await Video.findByIdAndUpdate(id, {
		title,
		description,
		hashtags: Video.formatHashtags(hashtags),
	});

	return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
	return res.render("upload", { pageTitle: `Upload video` });
};

export const postUpload = async (req, res) => {
	const {
		user: { _id },
	} = req.session;
	const { title, description, hashtags } = req.body;
	const file = req.file;
	try {
		const newVideo = await Video.create({
			title,
			description,
			videoURL: file.path,
			owner: _id,
			hashtags: Video.formatHashtags(hashtags),
		});
		const user = await User.findById(_id);
		user.videos.push(newVideo._id);
		user.save();
		return res.redirect("/");
	} catch (error) {
		return res.status(400).render("upload", {
			pageTitle: `Upload failed`,
			errorMsg: error._message,
		});
	}
};

export const deleteVideo = async (req, res) => {
	const { id } = req.params;
	const {
		user: { _id },
	} = req.session;
	const video = await Video.findById(id);
	if (!video) {
		return res.status(404).render("404", { pageTitle: "VIDEO NOT FOUND." });
	}
	if (String(video.owner) !== String(_id)) {
		return res.status(403).redirect("/");
	}
	await Video.findByIdAndDelete(id);
	return res.redirect("/");
};

export const search = async (req, res) => {
	const { keyword } = req.query;
	let videos = [];
	if (keyword) {
		videos = await Video.find({
			title: {
				$regex: new RegExp(keyword, "i"),
			},
		});
	}
	return res.render("search", { pageTitle: "Search", videos });
};
