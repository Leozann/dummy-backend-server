import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';  // Import necessary for ES modules

// Resolving the path based on the current module's directory
function resolvePath(dbPath) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const newPath = path.join(__dirname, dbPath);
    return newPath;
}

function createRecord(dbPath, newRecord) {
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

function updateRecord(dbPath, targetId, updatedRecord) {
    try {
        const path = resolvePath(dbPath);
        const data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, 'utf8')) : [];
        const index = data.findIndex(record => record.id === targetId);
        if (index !== -1) {
            data[index] = { ...data[index], ...updatedRecord };
            fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
            console.log('Record updated successfully');
        } else {
            console.log('Record not found');
        }
    } catch (err) {
        console.error('Error reading or writing the file:', err);
    }
}

function deleteRecord(dbPath, targetId) {
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
    createRecord,
    readRecords,
    updateRecord,
    deleteRecord
};