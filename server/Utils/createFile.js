const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { createObjectCsvWriter } = require('csv-writer');
const { getFolderStructure } = require('./folderManager');


/**
 * Creates and saves a file in the specified format (PDF, CSV).
 * @param {Object} data - The data to be saved.
 * @param {string} format - The file format ('pdf', 'csv').
 * @param {string} folderPath
 * @returns {Promise<string>} - The file path of the generated document.
 */
async function createFile(data, format,folderPath) {

        const { header, body } = data;
        const { date, reportType, barName } = header;
        const formattedDate = new Date(date).toISOString().split('T')[0];
        const fileName = `${formattedDate}_${reportType}_${barName.replace(/\s+/g, '_')}.${format}`;
        let filePath = path.join(folderPath, fileName);
        let fileArray = [];
    try {
        
        if (format === 'pdf') {
            filePath = await createPDF(filePath, header, body);
        } else if (format === 'csv') {
            filePath= await createCSV(filePath, body);
        } else {
            throw new Error(`Unsupported file format: ${format}`);
        }
    } catch (error) {
        console.error("❌ Error creating file:", error);
        throw error;
    }
    fileArray[0] = filePath;
    fileArray[1] = fileName;
    return fileArray;
}

/**
 * Creates a PDF file.
 * @param {string} filePath - The file path to save the PDF.
 * @param {Object} header - The header data.
 * @param {Array} body - The body data.
 * @returns {Promise<string>} - The file path of the generated PDF.
 */
function createPDF(filePath, header, body) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 30 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        doc.fontSize(18).text(header.reportType, { align: 'center' }).moveDown(2);
        doc.fontSize(12).text(`Bar: ${header.barName}`);
        doc.text(`Location: ${header.barLocation}`);
        doc.text(`Date: ${new Date(header.date).toLocaleString()}`);
        doc.text(`User: ${header.userName} (${header.role})`);
        doc.text(`Contact: ${header.phone} - ${header.email}`);
        doc.moveDown(2);
        
        doc.fontSize(12).text(`Product | Capacity | Packaging | Quantity | Price | Total`, { underline: true });
        doc.moveDown(0.5);
        body.forEach(item => {
            doc.text(`${item.productName} | ${item.capacity}cl | ${item.packaging} | ${item.quantity} | ${item.price} Fcfa | ${item.priceValue} Fcfa`);
        });

        doc.end();
        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
}

/**
 * Creates a CSV file.
 * @param {string} filePath - The file path to save the CSV.
 * @param {Array} body - The body data.
 * @returns {Promise<string>} - The file path of the generated CSV.
 */
function createCSV(filePath, body) {
    return new Promise((resolve, reject) => {
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'productName', title: 'Product' },
                { id: 'capacity', title: 'Capacity (cl)' },
                { id: 'packaging', title: 'Packaging' },
                { id: 'quantity', title: 'Quantity' },
                { id: 'price', title: 'Price (Fcfa)' },
                { id: 'priceValue', title: 'Total (Fcfa)' }
            ]
        });

        csvWriter.writeRecords(body)
            .then(() => resolve(filePath))
            .catch(reject);
    });
}

module.exports = { createFile};
