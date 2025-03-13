import { getAllObjectStoreDataExec } from "../../databaseControllers/indexedDbCrud";

const fetchReportData = async (reportType, barId, userId) => {
 alert("🔍 Fetching report data...");

  let data = [];
  switch (reportType) {
    case "SalesReport":
      data = await getAllObjectStoreDataExec("SalesReports");
      break;
    case "StockReport":
      data = await getAllObjectStoreDataExec("Stock");
      break;
    case "GapReport":
      data = await getAllObjectStoreDataExec("GapReports");
      break;
    case "ItemSalesReport":
      data = await getAllObjectStoreDataExec("ItemReport");
      break;
    default:
      console.error("❌ Invalid report type");
      throw new Error("Invalid report type");
  }

  console.log("✅ Data fetched:", data);
  return data;
};

export default fetchReportData;
