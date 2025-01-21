import express from 'express';
import cors from 'cors';

// import another path into express
import interviewTestPath from './routes/interviewRoutes.js'

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: 'GET, POST, DELETE',
    allowedHeaders: 'X-Requested-With,Content-Type',
    // credentials: true,
    exposedHeaders: ['Content-Disposition'],
}));

app.get('/', (req, res) => {
    try {
        const message = {
            "message": "Back End Server Already Connected",
            "status": 200,
        };
        res.send(message);
    } catch (error) {
        res.status(500).send({
            "message": "Error reading data",
            "error": error.message,
            "status": 500,
        });
    }
});

app.use("/interview", interviewTestPath);

const port = process.env.PORT || 8080;
// Start the server
app.listen(port, () => {
    console.log("================================================");
    console.log(`Server is running on port http://localhost:${port}`);
    console.log("================================================");
});