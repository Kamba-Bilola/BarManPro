import axios from 'axios';

export const handleGenerateReport = async (date, format, reportData) => {
  try {
    const response = await axios.post('/api/generate-report', { 
      date, 
      format,
      data: reportData 
    });

    if (response.data.success) {
      console.log("Report generated:", response.data.fileUrl);
      // Return the URL for UI consumption
      return response.data.fileUrl;
    }
  } catch (error) {
    // Handle axios error structure properly
    const errorMessage = error.response?.data?.error || 
                        error.message || 
                        'Failed to generate report';
    
    console.error("Error generating report:", errorMessage);
    
    // Create proper error object for UI handling
    throw new Error(errorMessage);
  }
};