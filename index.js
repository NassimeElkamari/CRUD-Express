const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

const dataPath = path.join(__dirname, 'data.json');

// Read data from data.json file
function readData(callback) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            callback([]);
        } else {
            try {
                const parsedData = JSON.parse(data);
                callback(parsedData);
            } catch (parseError) {
                console.error('Error parsing data:', parseError);
                callback([]);
            }
        }
    });
}

// Write data to data.json file
function writeData(data, callback) {
    fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing data:', err);
            callback(false);
        } else {
            callback(true);
        }
    });
}

// GET all items
app.get('/items', (req, res) => {
    readData((items) => {
        res.json(items);
    });
});

// POST a new item
app.post('/items', (req, res) => {
    const newItem = req.body;
    readData((items) => {
        newItem.id = items.length + 1; 
        items.push(newItem);
        writeData(items, (success) => {
            if (success) {
                res.status(201).send('Item added successfully');
            } else {
                res.status(500).send('Failed to add item');
            }
        });
    });
});

// PATCH an existing item
app.patch('/items/:id', (req, res) => {
    const itemId = req.params.id * 1;
    const updatedData = req.body;
    readData((items) => {
        const itemToUpdate = items.find(item => item.id === itemId);
        if (!itemToUpdate) {
            return res.status(404).send('Item not found');
        }
        Object.assign(itemToUpdate, updatedData); // Update item with new data
        writeData(items, (success) => {
            if (success) {
                res.send('Item updated successfully');
            } else {
                res.status(500).send('Failed to update item');
            }
        });
    });
});



// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});