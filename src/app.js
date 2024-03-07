import express from 'express';
import dotenv from 'dotenv';
import categoryRouter from "./routes/categories.router.js";
import MenuRouter from "./routes/menus.router.js";
import signupRouter from "./routes/sign-up.router.js";
import signinRouter from "./routes/api-sign-in.js";
import orderRouter from "./routes/orders.router.js";
import cookieParser from "cookie-parser";
import Logmiddleware from "./middlewares/log.middleware.js";
import ErrorMiddleware from "./middlewares/errormiddleware.js";

dotenv.config();
console.log(process.env.DATABASE_URL);

const app = express();
const PORT = 3020;

app.use(Logmiddleware);
app.use(express.json());
app.use(cookieParser());

app.use("/api", [categoryRouter, MenuRouter, signupRouter,orderRouter]);
app.use("/api-sign-in", [signinRouter]);


app.use(ErrorMiddleware);




app.listen(PORT, () => {
    console.log(PORT, '포트로 서버가 열렸어요!');
});
