// import dependencies
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';


// import config
import corsOrigin from './config/cors-origin';


// import middleware
import AuthMiddleware from "@/middleware/auth-middleware";
import ErrorMiddlewar from "@/middleware/error-middleware";
import NotFoundMiddleware from "@/middleware/not-found-middleware";


// import controllers
import AuthController from "@/controller/auth-controller";
import AccountController from '@/controller/account-controller';
import ProjectController from '@/controller/project-controller';


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
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.get("/auth/token", AuthController.refreshToken);
app.post("/auth/register", AuthController.register);
app.post("/auth/login", AuthController.login);
app.post("/auth/logout", AuthController.logout);

app.get("/account/connection", AuthMiddleware, AccountController.connection);           // get connected device     🟢
app.patch("/account/password", AuthMiddleware, AccountController.changePassword);       // change password          🟢
app.delete("/account", AuthMiddleware, AccountController.delete);                       // delete account           🟢

app.post("/projects", AuthMiddleware, ProjectController.createProject);                 // create new project       🟢
app.get("/projects", ProjectController.getProjects);                                    // get all project          🟢
app.post("/projects/filter", ProjectController.filterProjects);                         // filter projects          🟢
app.post("/projects/filter/me", AuthMiddleware, ProjectController.filterProjectMe);     // filter projects by me    🟢
app.get("/projects/me", AuthMiddleware, ProjectController.getProjecstMe);               // get all project by me    🟢
app.get("/projects/:id", ProjectController.getProject);                                 // get project by id        🟢
app.patch("/projects/:id", AuthMiddleware, ProjectController.updateProject);            // update project by id     🟢
app.delete("/projects/:id", AuthMiddleware, ProjectController.deleteProject);           // delete project by id     🟢

// middleware
app.use(ErrorMiddlewar);
app.use(NotFoundMiddleware);


// export app
export default app;