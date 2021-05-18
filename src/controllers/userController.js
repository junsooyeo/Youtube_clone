export const edit = (req, res) => res.send("USER EDIT");
export const join = (req, res) => res.send("JOIN");
export const remove = (req, res) => res.send("REMOVE USER");
export const login = (req, res) => res.send("LOGIN");
export const see = (req, res) => {
	console.log(`Wathching #${req.params.id}`);
	return res.send("SEE USER");
};
export const logout = (req, res) => res.send("LOGOUT");
