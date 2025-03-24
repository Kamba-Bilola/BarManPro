import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import * as pdfjsLib from "pdfjs-dist/build/pdf";

// Set the worker script location
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;


// ✅ Load the worker from the local `node_modules` instead of the CDN
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;
const PDFViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pdf, setPdf] = useState(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdfDocument = await loadingTask.promise;
        setNumPages(pdfDocument.numPages);
        setPdf(pdfDocument);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    if (pdfUrl) {
      loadPdf();
    }
  }, [pdfUrl]);

  return (
    <div>
      <h2>PDF Viewer</h2>
      {pdf ? (
        <iframe src={pdfUrl} width="100%" height="600px" title="PDF Document" />
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default PDFViewer;
