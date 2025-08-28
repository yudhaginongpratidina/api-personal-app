// import dependencies
import express from 'express';
import cors from 'cors';


// import config
import corsOrigin from './config/cors-origin';


// import middleware
import ErrorMiddlewar from "@/middleware/error-middleware";
import NotFoundMiddleware from "@/middleware/not-found-middleware";


// import controllers
import AuthController from "@/controller/auth-controller";


// initialize express
const app = express();


// cors config
app.use(cors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
}));


// middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/auth/register", AuthController.register);
app.post("/auth/login", AuthController.login);
app.post("/auth/logout", AuthController.logout);


// middleware
app.use(ErrorMiddlewar);
app.use(NotFoundMiddleware);


// export app
export default app;