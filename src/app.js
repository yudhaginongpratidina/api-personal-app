// --------------------------------------------
// libraries
// --------------------------------------------
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';


// --------------------------------------------
// middlewares from core/middleware
// --------------------------------------------
import ErrorMiddleware from './core/middleware/error.middleware.js';
import NotFoundMiddleware from './core/middleware/not-found.middleware.js';


// --------------------------------------------
// controllers from app
// --------------------------------------------
import AuthController from './app/auth/controller.js';


// --------------------------------------------
// initialize app
// --------------------------------------------
const app = express();


// --------------------------------------------
// middlewares from libraries
// --------------------------------------------
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


// --------------------------------------------
// routes
// --------------------------------------------
app.post('/auth/register', AuthController.Register);
app.post('/auth/login', AuthController.Login);
app.post('/auth/logout', AuthController.Logout);


// --------------------------------------------
// middlewares for end routes
// --------------------------------------------
app.use(ErrorMiddleware);
app.use(NotFoundMiddleware);


// --------------------------------------------
// export
// --------------------------------------------
export default app;