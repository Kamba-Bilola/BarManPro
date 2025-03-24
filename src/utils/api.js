import axios from 'axios';

/**
 * Calls the backend to create a folder based on a given date.
 * @param {string | Date} date - The date for folder creation.
 * @returns {Promise<string>} - The created folder path.
 */
export async function createFolder(date) {
    try {
        const response = await axios.post('http://localhost:5000/api/create-folder', { date });
        return response.data.folderPath; // Returns the folder path
    } catch (error) {
        console.error("❌ Error creating folder:", error);
        throw error;
    }
}

/**
 * Calls the backend to create a file (PDF, CSV) inside a folder.
 * @param {Object} data - The data to save in the file.
 * @param {string} format - The file format ('pdf' or 'csv').
 * @param {string} folderPath - The path where the file should be saved.
 * @returns {Promise<string>} - The file path of the generated document.
 */
export async function createFile(data, format, folderPath) {
    try {
        if (!folderPath) throw new Error("⚠️ folderPath is required!");
        if (!format || !['pdf', 'csv'].includes(format.toLowerCase())) throw new Error("⚠️ Invalid file format. Only 'pdf' or 'csv' allowed.");

        const response = await axios.post('http://localhost:5000/api/create-file', {
            data,
            format,
            folderPath
        });

        return response.data.filePath; // Returns the created file path
    } catch (error) {
        console.error("❌ Error creating file:", error);
        throw error;
    }
}



/**
 * Calls the backend to generate a URL based on the provided date input and file array.
 * @param {Date | string} dateInput - The date used to generate the folder structure.
 * @param {Array} fileArray - An array with file information (e.g. [filePath, fileName]).
 * @returns {Promise<string>} - The generated URL (folder path) returned by the server.
 */
export async function generateUrl(dateInput, fileArray) {
    try {
      // Send a POST request to the API route with the required data
      const response = await axios.post('http://localhost:5000/api/generate-url', {
        dateInput,
        fileArray,
      });
      // Return the generated folder path from the response
      return response.data.folderPath;
    } catch (error) {
      console.error("Error generating URL:", error);
      throw error;
    }
  }