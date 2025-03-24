import fetchReportData from "./fetchReportData";
import { handleGenerateReport } from "./uploadFile";
import { createFolder, createFile} from "../../../utils/api";
import { getLastIdAndSet,addToObjectStoreExec,getWhereFieldEqualsExec } from "../../databaseControllers/indexedDbCrud";
import { checkBeforeCRUDExec } from "../../databaseControllers/verification";
import axios from 'axios';


const generateReport = async (reportType,reportId,bar,user) => {
  
    //console.log(`📂 Fetching data for report type: ${reportType}, ID: ${reportId}...`);
    const data = await fetchReportData(reportType, reportId, bar, user); 
    const fileDate = data.header.date;
    const folderPath = await handleCreateFolder (fileDate);
    const fileArray = await createFile(data, "pdf", folderPath);
    console.log("--------fileArray----------");
    console.log(fileArray);
    let fileUrl = null;
    const filePath = fileArray[0];
    

    if (filePath){
      //saving the report to the database
     const lastId = await getLastIdAndSet("Documents"); 
     const newId = lastId !== null && lastId !== undefined ? lastId : 1;
     if(newId){ 
      try {
        const { header, body } = data;
        const { date, reportType, barName } = header;
        const formattedDate = new Date(date).toISOString().split('T')[0];
        const fileName = `${formattedDate}_${reportType}_${barName.replace(/\s+/g, '_')}`;
        const barId = header.barId;
        const userId = header.userId;
        const fileType ="pdf";
        const createdAt = date;
       
        const dbDocument = { id:newId, sharedWith: null,fileName:fileName,shared:false,barId:bar.uid,userId:user.uid,filePath:filePath,fileType:fileType,reportType:reportType,createdAt:createdAt,reportId:reportId};
        const documentCanBeInserted = await checkBeforeCRUDExec('Documents', dbDocument);
        if ( documentCanBeInserted[0] === true) {
          try {
            await addToObjectStoreExec('Documents', dbDocument, null);
            const myReturnedDbDoc = await getWhereFieldEqualsExec('Documents', ["id"], [newId]);
            console.log("--------myReturnedDbDoc--------");
            console.log(myReturnedDbDoc);
            if(myReturnedDbDoc){
            if(fileArray){
              fileUrl = convertFilePathToUrl(fileDate,fileArray);
              console.log(fileUrl);
              return fileUrl;
            }}
            /*const dbDocPath= myReturnedDbDoc[0].filePath;
            const docUrl =convertFilePathToUrl(dbDocPath);
            console.log(docUrl);*/

            
            
          }
          catch (error) {console.error("Product can not  be inserted:", error);}
           
          }


      } catch (error) {
        console.error("❌ Error creating file:", error);
        throw error;
    }

     }
     } 
    else {console.log("------------too bad----------------");}

  
    console.log("✅ Report generated:", folderPath);
    return { folderPath, reportType };
  };


  const handleCreateFolder = async (fileDate) => {
    try {
        const path = await createFolder(fileDate);
        return path;
    } catch (error) {
       return null;
    }



 
    
};
export default generateReport;


    
// This function finds the portion of the path starting with '/documents'
// and prefixes it with the base URL.
//export const convertFilePathToUrl = (filePath) => {
  //const regex = /\/documents\/.*/i;
  //const regex = /.*\/documents\//i;
  //const match = filePath.match(regex);
  //if (match) {
    //return `${baseUrl}${match[0]}`;
  //}
  // Fallback if the regex doesn't match
  //return filePath;
//};

/*export const  convertFilePathToUrl =  async (dateInput,fileArray) => {
  let date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const year = date.getFullYear();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[date.getMonth()];
    const documentsDir = path.join('Documents');
    const yearDir = path.join(documentsDir, String(year));
    const monthDir = path.join(yearDir, monthName);
    // Create folders if they do not exist
    [documentsDir, yearDir, monthDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`📁 Created folder: ${dir}`);
            }
    });
    alert(monthDir);
    const globalDocUrl = window.location.origin + "/Documents";
    const filePath = fileArray[0];
    const fileName = fileArray[1];
  //const fullUrl = window.location.href;
  //const fileUrl = fullUrl+newPath;
  
};*/

export const convertFilePathToUrl = (dateInput, fileArray) => {
  // Convert to Date if necessary
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const year = date.getFullYear();
  
  // Use short month names if you prefer; otherwise, use full names.
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[date.getMonth()];
  
  // Assume fileArray is like [filePath, fileName] and we need the fileName.
  const fileName = fileArray[1];
  
  // Build the URL assuming your files are served at the /Documents endpoint.
  const baseUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
  return `${baseUrl}/Documents/${year}/${monthName}/${fileName}`;
};





  