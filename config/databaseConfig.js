import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolving the path based on the current module's directory
function resolvePath(dbPath) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const newPath = path.join(__dirname, dbPath);
    return newPath;
}

function createRecords(dbPath, newRecord) {
    try {
        const path = resolvePath(dbPath);
        // Read existing data from file
        const data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, 'utf8')) : [];

        data.push(newRecord);

        fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
        console.log('Record created successfully');
    } catch (err) {
        console.error('Error reading or writing the file:', err);
    }
}

function readRecords(dbPath) {
    try {
        const path = resolvePath(dbPath);
        const data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading the file:', err);
        return [];
    }
}

function updateRecords(dbPath, data) {
    try {
        const path = resolvePath(dbPath);
        // Check if the data is valid
        if (!data) {
            throw new Error("No data to update");
        }
        // Check if data is an array or object
        let updatedData;
        if (Array.isArray(data)) {
            updatedData = data.map(item => {
                return item;
            });
        } else if (typeof data === 'object') {
            updatedData = { ...data };
        } else {
            throw new Error("Unsupported data type for update");
        }
        fs.writeFileSync(path, JSON.stringify(updatedData, null, 2), 'utf8');
        console.log('Records updated successfully');
    } catch (err) {
        console.error('Error reading or writing the file:', err.message);
    }
}

function deleteRecords(dbPath, targetId) {
    try {
        const data = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf8')) : [];
        const index = data.findIndex(record => record.id === targetId);
        if (index !== -1) {
            data.splice(index, 1);
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
            console.log('Record deleted successfully');
        } else {
            console.log('Record not found');
        }
    } catch (err) {
        console.error('Error reading or writing the file:', err);
    }
}

export {
    createRecords,
    readRecords,
    updateRecords,
    deleteRecords
};