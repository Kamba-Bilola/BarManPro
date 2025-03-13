import { addToObjectStoreExec } from  "../../databaseControllers/indexedDbCrud";

const saveReport = async (reportFile, reportType, userId) => {
  console.log("💾 Saving report details in IndexedDB...");

  const documentRecord = {
    userId,
    fileName: `${reportType}_${Date.now()}.pdf`,
    filePath: reportFile.filePath,
    fileType: "PDF",
    reportType: reportType,
    createdAt: new Date(),
    shared: false,
    sharedWith: [],
  };

  const docId = await addToObjectStoreExec("Documents", documentRecord);
  console.log("✅ Report metadata saved with ID:", docId);

  return documentRecord;
};

export default saveReport;
