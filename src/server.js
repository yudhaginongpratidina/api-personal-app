// --------------------------------------------
// libraries
// --------------------------------------------
import dotenv from 'dotenv';
import app from "./app.js";


// --------------------------------------------
// initialize env
// --------------------------------------------
dotenv.config();


// --------------------------------------------
// initialize env
// --------------------------------------------
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';


// --------------------------------------------
// server listening
// --------------------------------------------
app.listen(PORT, () => {
    console.log(`🟢 Server running on ${HOST}:${PORT}`);
});