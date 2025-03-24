import React, { useState, useEffect } from "react";
import generateReport from "./ReportGenerator/generateReport";
import saveReport from "./ReportGenerator/saveReport";
import viewPrintReport from "./ReportGenerator/viewPrintReport";
import { getAllObjectStoreDataExec } from "../databaseControllers/indexedDbCrud";
import PDFViewer from "../Documents/PDFViewer";

const ReportGenerator = ({ reportId, reportType, barId, userId, action}) => {
  const [reportStatus, setReportStatus] = useState(null);
  const [reportPath, setReportPath] = useState(null);
  const [allReports, setAllReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    if (!reportId) {fetchAllReports();}
  }, [reportId]);
  useEffect(() => {  }, [fileUrl]);
  useEffect(() => {
    if (action=="generate") {
        const generateReport = async () => { await handleGenerateReport();};
        generateReport(); 
    }
  }, [action]);

  const fetchAllReports = async () => {
    try {
      console.log("📂 Fetching all reports...");
      const reports = await getAllObjectStoreDataExec("Documents");
      setAllReports(reports);
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
    }
  };

  const handleGenerateReport = async () => {
    setReportStatus("Generating report...");
    try {
    

      console.log("📄 Structuring data for report...");
      const reportFile = await generateReport(reportType,reportId,barId,userId);
      setFileUrl(reportFile);

      console.log("💾 Saving report metadata...");
      const savedReport = await saveReport(reportFile, reportType, reportId, userId);

      if (savedReport) {
        setReportPath(savedReport.filePath);
        setReportStatus("✅ Report generated successfully!");
        fetchAllReports(); // Refresh the report list
      } else {
        setReportStatus("❌ Failed to save report.");
      }
    } catch (error) {
      console.error("❌ Error generating report:", error);
      setReportStatus("❌ Error generating report.");
    }
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        {reportId ? "View Report" : "View All Reports"}
      </button>

      {/* 📌 MODAL */}
      {showModal && (
        
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{reportId ? "Report Details" : "All Reports"}</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                // Usage:
                {fileUrl && <PDFViewer pdfUrl={fileUrl} />}
                {reportId ? (
                  <>
                    <p>Report Type: <strong>{reportType}</strong></p>
                    <p>Report ID: <strong>{reportId}</strong></p>
                    <button className="btn btn-success" onClick={handleGenerateReport}>
                      Generate Report
                    </button>
                    {reportStatus && <p className="mt-2">{reportStatus}</p>}
                    {reportPath && (
                      <button className="btn btn-info mt-2" onClick={() => viewPrintReport(reportPath)}>
                        View/Print Report
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <h5>📂 All Reports</h5>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>File Name</th>
                          <th>Type</th>
                          <th>Created At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allReports.length > 0 ? (
                          allReports.map((report) => (
                            <tr key={report.id}>
                              <td>{report.fileName}</td>
                              <td>{report.reportType}</td>
                              <td>{new Date(report.createdAt).toLocaleString()}</td>
                              <td>
                                <button className="btn btn-sm btn-info" onClick={() => viewPrintReport(report.filePath)}>
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">No reports found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      
      )}
    </div>
  );
};

export default ReportGenerator;
