import express from "express";
import session from "express-session";
import mongoStore from "connect-mongo";
import morgan from "morgan";
import { localMiddlewares } from "./middlewares";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const logger = morgan("dev");
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		saveUninitialized: false,
		resave: false,
		store: mongoStore.create({
			mongoUrl: process.env.DB_URL,
		}),
	})
);

app.use(localMiddlewares);
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
