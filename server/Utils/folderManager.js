const fs = require('fs');
const path = require('path');

/**
 * Ensures that the folder structure "Documents/YYYY/Month" exists in the assets folder.
 * @param {Date | string} dateInput - A Date object or a date string.
 * @returns {string} The full path to the created folder.
 */
function getFolderStructure(dateInput) {
    // Convert input to a Date object if necessary
    let date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    
    // Get year and full month name
    const year = date.getFullYear();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[date.getMonth()];

    // ✅ Define base directory inside `public/uploads`
    //const baseDir = path.join(process.cwd());
    const baseDir = path.join(__dirname, '..', '..'); // This points to your project root
const documentsDir = path.join(baseDir, 'Documents');

    const yearDir = path.join(documentsDir, String(year));
    const monthDir = path.join(yearDir, monthName);

    // Create folders if they do not exist
    [documentsDir, yearDir, monthDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`📁 Created folder: ${dir}`);
        }
    });

    return monthDir; // Return the final folder path
}

// ✅ Use CommonJS syntax to export
module.exports = { getFolderStructure };