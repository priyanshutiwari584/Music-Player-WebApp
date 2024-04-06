const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');


// Function to retrieve metadata from a music file
async function getMetadata(filePath) {
    try {
        const metadata = await mm.parseFile(filePath);
        const title = metadata.common.title || 'Unknown';
        const author = metadata.common.artist || 'Unknown';
        const album = metadata.common.album || 'Unknown';
        let img = null;
        if (metadata.common.picture && metadata.common.picture.length > 0) {
            const picture = metadata.common.picture[0];
            img = `data:${picture.format};base64,${picture.data.toString('base64')}`;
        }
        return {
            title: title,
            author: author,
            album: album,
            img: img,
            src: filePath
        };
    } catch (error) {
        console.error(`Error reading metadata for ${filePath}: ${error.message}`);
        return null;
    }
}

// Function to read the music folder and extract metadata from each file
async function folderToJson(folderPath) {
    const jsonArr = [];
    try {
        const files = await fs.promises.readdir(folderPath);
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const stat = await fs.promises.stat(filePath);
            if (stat.isFile() && file.toLowerCase().endsWith('.mp3')) {
                const metadata = await getMetadata(filePath);
                if (metadata) {
                    jsonArr.push(metadata);
                }
            }
        }
        return jsonArr;
    } catch (error) {
        console.error(`Error reading folder ${folderPath}: ${error.message}`);
        return null;
    }
}

// Function to update the JSON file with the music metadata
async function updateJsonFile(folderPath, jsonFilePath) {
    const jsonData = await folderToJson(folderPath);
    if (jsonData) {
        try {
            await fs.promises.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 4));
            console.log('JSON file updated successfully.');
        } catch (error) {
            console.error(`Error writing JSON file: ${error.message}`);
        }
    }
}

// Path to the music folder and the JSON file
const musicFolderPath = 'Music';
const musicJsonFilePath = 'music_metadata.json';

// Initial update of the JSON file
updateJsonFile(musicFolderPath, musicJsonFilePath);

// Watch the music folder for changes
fs.watch(musicFolderPath, (eventType, filename) => {
    console.log(`Event type: ${eventType}`);
    if (filename) {
        console.log(`File affected: ${filename}`);
        // If a change occurs, update the JSON file
        updateJsonFile(musicFolderPath, musicJsonFilePath);
    }
});
