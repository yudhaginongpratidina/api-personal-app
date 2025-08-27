import 'dotenv/config';     // Load environment variables
import app from "@/app";    // Import the Express app

// Get environment variables
const HOSTNAME = process.env.APP_HOSTNAME || "localhost";
const PORT = process.env.APP_PORT || 3000;
const URL = `${HOSTNAME}:${PORT}`;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${URL}`);
});