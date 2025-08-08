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
import AuthenticatedMiddleware from './core/middleware/authenticated.js';
import UploadAvatarMiddleware from './core/middleware/avatar.js';


// --------------------------------------------
// controllers from app
// --------------------------------------------
import AuthController from './app/auth/controller.js';
import AccountController from './app/account/controller.js';
import PortfolioController from './app/portfolio/controller.js';


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
app.get('/auth/token', AuthController.Token);
app.post('/auth/logout', AuthController.Logout);

app.get('/account', AuthenticatedMiddleware, AccountController.GetAccount);
app.get('/account/avatar', AuthenticatedMiddleware, AccountController.GetAvatar);
app.patch('/account/avatar', AuthenticatedMiddleware, UploadAvatarMiddleware, AccountController.UpdateAvatar);
app.patch('/account/password', AuthenticatedMiddleware, AccountController.ChangePassword);
app.delete('/account', AuthenticatedMiddleware, AccountController.DeleteAccount);

app.post('/portfolio', AuthenticatedMiddleware, PortfolioController.Create);
app.get('/portfolio', AuthenticatedMiddleware, PortfolioController.GetMyPortfolio);
app.get('/portfolio/:id', AuthenticatedMiddleware, PortfolioController.GetDetail);
app.patch('/portfolio/:id', AuthenticatedMiddleware, PortfolioController.Update);
app.delete('/portfolio/:id', AuthenticatedMiddleware, PortfolioController.Delete);

// --------------------------------------------
// middlewares for end routes
// --------------------------------------------
app.use(ErrorMiddleware);
app.use(NotFoundMiddleware);


// --------------------------------------------
// export
// --------------------------------------------
export default app;