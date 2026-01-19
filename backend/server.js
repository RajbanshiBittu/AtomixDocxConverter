import application from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5050;
const HOST = process.env.HOST || "0.0.0.0";

const server = application.listen(PORT, HOST, () => {
    console.log('='.repeat(50));
    console.log('Document Converter Backend API Server');
    console.log('='.repeat(50));
    console.log(`Server running on: http://${HOST}:${PORT}`);
    console.log(`Started at: ${new Date().toISOString()}`);
    console.log('='.repeat(50));
});


// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\nSIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});