const fs = require('fs');
const path = require('path');

/**
 * Ensures that the folder structure "Documents/YYYY/Month" exists in the assets folder.
 * @param {Date|string} dateInput - A Date object or a date string.
 * @param {Array} fileArray - An array where fileArray[1] is the file name.
 * @returns {string} The public URL for accessing the file.
 */


export const  convertFilePathToUrl =  async (dateInput,fileArray) => {
    let date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const year = date.getFullYear();
      const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
      ];
      const monthName = monthNames[date.getMonth()];
      const documentsDir = path.join('documents');
      const yearDir = path.join(documentsDir, String(year));
      const monthDir = path.join(yearDir, monthName);
      // Create folders if they do not exist
      [documentsDir, yearDir, monthDir].forEach(dir => {
              if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
                  console.log(`📁 Created folder: ${dir}`);
              }
      });
      const globalDocUrl = window.location.origin + "/documents";
      const filePath = fileArray[0];
      const fileName = fileArray[1];
    //const fullUrl = window.location.href;
    //const fileUrl = fullUrl+newPath;
    
  };
  
// ✅ Use CommonJS syntax to export
module.exports = { convertFilePathToUrl};