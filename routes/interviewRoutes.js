import express from 'express';
import { readRecords } from '../config/databaseConfig.js';

const router = express.Router();

router.get('/candidate/dashboard', (req, res) => {
    try {
        const dbPath = '../database_temporary/playground/candidate_interview.json';
        const records = readRecords(dbPath);
        const message = {
            "message": "Candidate Database Read Success",
            "status": 200,
            "data": records
        };
        res.send(message)
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});
export default router;