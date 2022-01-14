import express from "express";
import config from "./config";
import router from "./routes";
import passport from "passport";
import middleware from "./middleware/auth";
import cors from "cors";

const app = express();

app.set("trust proxy", true);
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(router);

passport.use(middleware);

const port = config.port ? parseInt(config.port) : 3000;

app.listen(port);
console.log(`Listening on port ${port}...`);
