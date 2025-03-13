const viewPrintReport = (filePath) => {
    console.log("🖨️ Opening report:", filePath);
    window.open(filePath, "_blank");
  };
  
  export default viewPrintReport;
  