import express from 'express';
import { readRecords, updateRecords } from '../config/databaseConfig.js';

const router = express.Router();

// read candidate database
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

// approve candidate by moving them to the next phase
router.post('/candidate/dashboard/:userId/approved', (req, res) => {
    try {
        const dbPath = '../database_temporary/playground/candidate_interview.json';
        const records = readRecords(dbPath);
        const { userId } = req.params;

        let userToMove = null;
        let originalSection = null;
        let nextSection = null;

        // Find the user in the sections
        for (const section of records) {
            if (Array.isArray(section.candidate)) {
                const userIndex = section.candidate.findIndex(user => user.userId === userId);
                if (userIndex !== -1) {
                    userToMove = section.candidate.splice(userIndex, 1)[0]; // Remove and get the user
                    originalSection = section.titleSectionName;
                    section.totalCandidate -= 1; // Update the total candidate count

                    console.log("Original Section:", originalSection);

                    // Determine the next section based on the current section
                    if (originalSection === "source") {
                        nextSection = "screening";
                    } else if (originalSection === "screening") {
                        nextSection = "interview";
                    } else if (originalSection === "interview") {
                        nextSection = "approved";
                    }

                    // Debugging log to see nextSection value
                    console.log("Next Section:", nextSection);

                    break;
                }
            }
        }

        if (!userToMove) {
            return res.status(404).json({ message: 'User not found', status: 404 });
        }

        // If the candidate is already in the "approved" section, they cannot be moved anymore
        if (originalSection === "approved") {
            return res.status(400).json({ message: 'User is already in the approved section', status: 400 });
        }

        // Debugging log before trying to find the section
        console.log("Looking for nextSection:", nextSection);

        // Find the next section and update it
        const nextSectionData = records.find(section => section.titleSectionName === nextSection);

        // If no next section is found, return an error
        if (!nextSectionData) {
            return res.status(500).json({ message: `${nextSection} section not found`, status: 500 });
        }

        nextSectionData.candidate.push(userToMove);
        nextSectionData.totalCandidate += 1;

        // Update the records in the database
        updateRecords(dbPath, records)

        return res.status(200).json({
            message: `User moved to ${nextSection} section successfully`,
            status: 200,
            data: { userId, originalSection, userToMove, nextSectionData },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


// reject candidate by put the candidate into rejected list
router.post('/candidate/dashboard/:userId/rejected', (req, res) => {
    try {
        const dbPath = '../database_temporary/playground/candidate_interview.json';
        const records = readRecords(dbPath);
        const { userId } = req.params;

        let userToMove = null;
        let originalSection = null;

        // Find the user in the sections
        for (const sectionKey in records) {
            const section = records[sectionKey];
            if (Array.isArray(section.candidate)) {
                const userIndex = section.candidate.findIndex(user => user.userId === userId);
                if (userIndex !== -1) {
                    userToMove = section.candidate.splice(userIndex, 1)[0]; // Remove and get the user
                    originalSection = sectionKey;
                    section.totalCandidate -= 1; // Update the total candidate count
                    break;
                }
            }
        }

        if (!userToMove) {
            return res.status(404).json({ message: 'User not found', status: 404 });
        }

        // Find the rejected section and update it
        const rejectedSection = records.find(section => section.titleSectionName === "rejected");

        if (!rejectedSection) {
            return res.status(500).json({ message: 'Rejected section not found', status: 500 });
        }

        rejectedSection.candidate.push(userToMove);
        rejectedSection.totalCandidate += 1;

        // Update the records in the database
        updateRecords(dbPath, records)

        return res.status(200).json({
            message: 'User moved to rejected section successfully',
            status: 200,
            data: { userId, originalSection, userToMove, rejectedSection },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


export default router;