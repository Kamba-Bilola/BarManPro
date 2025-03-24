import { getAllObjectStoreDataExec, getWhereFieldEqualsExec } from "../../databaseControllers/indexedDbCrud";

const fetchReportData = async (reportType, reportId, bar, user) => {
 

  
    let tableData = [];
    switch (reportType) {
      case "SalesReport":
       
        break;
      case "StockReport":
  
         const reportLine = await getWhereFieldEqualsExec('StoreChecks', ['id'], [reportId]);   
         const itemData = await getWhereFieldEqualsExec('ItemReport', ['ref','refId'], ["StoreCheck",reportId]);      
         let tableHeaderData ={barName:bar.name,barLocation:bar.location,reportType: reportType,date:reportLine[0].checkTime,userName:user.fullName,role: user.role,phone:user.phone,email:user.email}
         let tableBodyData = [];    
         for (let key in itemData) {
         let itemLine = itemData[key];
         let productId= itemLine.productId;
         let variantionId = itemLine.variationId;
         let productDetails= await getWhereFieldEqualsExec('Products', ['id'], [productId]);
         let variantDetails= await getWhereFieldEqualsExec('Variations', ['id'], [variantionId]);
         let line ={imageUrl:variantDetails[0].imageUrl,productName:productDetails[0].name, category:productDetails[0].category, packaging: variantDetails[0].packaging,flavor: variantDetails[0].flavor,capacity:variantDetails[0].capacity, price:variantDetails[0].price,quantity:itemLine.quantity,priceValue:itemLine.priceValue};
         tableBodyData.push(line)
                
        }
        tableData = {header:tableHeaderData,body:tableBodyData};
        break;
      case "GapReport":
        
        break;
      case "ItemSalesReport":
        
        break;
      default:
        console.error("❌ Invalid report type");
        throw new Error("Invalid report type");
    }
  
    console.log("✅ Data fetched:", tableData);
    return  tableData;
};

export default fetchReportData;
