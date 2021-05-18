export const watch = (req, res) => {
	console.log(`watching #${req.params.id}`);
	return res.send("VIDEO WATCH");
};
export const home = (req, res) => res.send("HOME");
export const search = (req, res) => res.send("SEARCH VIDEOS");

export const edit = (req, res) => res.send("VIDEO EDIT");
export const remove = (req, res) => res.send("VIDEO REMOVE");
export const upload = (req, res) => res.send("UPLOAD");
