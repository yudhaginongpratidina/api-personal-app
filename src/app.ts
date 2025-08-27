// import dependencies
import express from 'express';


// import middleware
import ErrorMiddlewar from "@/middleware/error-middleware";
import NotFoundMiddleware from "@/middleware/not-found-middleware";


// initialize express
const app = express();


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Hello World!');
});


// middleware
app.use(ErrorMiddlewar);
app.use(NotFoundMiddleware);


// export app
export default app;