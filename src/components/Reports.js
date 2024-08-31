import React, { useState } from 'react';
import { Table, Button, ButtonGroup, Dropdown } from 'react-bootstrap';

// Mock data for daily sales report
const dailySalesReport = [
    { date: '2024-08-01', itemsSold: 20, totalAmount: 40000 },
    { date: '2024-08-02', itemsSold: 35, totalAmount: 70000 },
    { date: '2024-08-03', itemsSold: 40, totalAmount: 80000 },
    { date: '2024-08-04', itemsSold: 25, totalAmount: 50000 },
    { date: '2024-08-05', itemsSold: 30, totalAmount: 60000 },
    { date: '2024-08-06', itemsSold: 45, totalAmount: 90000 },
    { date: '2024-08-07', itemsSold: 50, totalAmount: 100000 },
    { date: '2024-08-08', itemsSold: 28, totalAmount: 56000 },
    { date: '2024-08-09', itemsSold: 34, totalAmount: 68000 },
    { date: '2024-08-10', itemsSold: 48, totalAmount: 96000 },
    { date: '2024-08-11', itemsSold: 52, totalAmount: 104000 },
    { date: '2024-08-12', itemsSold: 37, totalAmount: 74000 },
    { date: '2024-08-13', itemsSold: 29, totalAmount: 58000 },
    { date: '2024-08-14', itemsSold: 31, totalAmount: 62000 },
    { date: '2024-08-15', itemsSold: 42, totalAmount: 84000 },
    { date: '2024-08-16', itemsSold: 46, totalAmount: 92000 },
    { date: '2024-08-17', itemsSold: 33, totalAmount: 66000 },
    { date: '2024-08-18', itemsSold: 39, totalAmount: 78000 },
    { date: '2024-08-19', itemsSold: 44, totalAmount: 88000 },
    { date: '2024-08-20', itemsSold: 38, totalAmount: 76000 },
    { date: '2024-08-21', itemsSold: 43, totalAmount: 86000 },
    { date: '2024-08-22', itemsSold: 49, totalAmount: 98000 },
    { date: '2024-08-23', itemsSold: 41, totalAmount: 82000 },
    { date: '2024-08-24', itemsSold: 55, totalAmount: 110000 },
    { date: '2024-08-25', itemsSold: 25, totalAmount: 50000 },
    { date: '2024-08-26', itemsSold: 30, totalAmount: 60000 },
    { date: '2024-08-27', itemsSold: 45, totalAmount: 90000 },
    { date: '2024-08-28', itemsSold: 37, totalAmount: 74000 },
    { date: '2024-08-29', itemsSold: 50, totalAmount: 100000 },
    { date: '2024-08-30', itemsSold: 60, totalAmount: 120000 },
    { date: '2024-08-31', itemsSold: 20, totalAmount: 40000 },
  
    { date: '2024-09-01', itemsSold: 30, totalAmount: 60000 },
    { date: '2024-09-02', itemsSold: 40, totalAmount: 80000 },
    { date: '2024-09-03', itemsSold: 35, totalAmount: 70000 },
    { date: '2024-09-04', itemsSold: 45, totalAmount: 90000 },
    { date: '2024-09-05', itemsSold: 50, totalAmount: 100000 },
    { date: '2024-09-06', itemsSold: 60, totalAmount: 120000 },
    { date: '2024-09-07', itemsSold: 25, totalAmount: 50000 },
    { date: '2024-09-08', itemsSold: 35, totalAmount: 70000 },
    { date: '2024-09-09', itemsSold: 40, totalAmount: 80000 },
    { date: '2024-09-10', itemsSold: 45, totalAmount: 90000 },
  
    { date: '2024-10-01', itemsSold: 50, totalAmount: 100000 },
    { date: '2024-10-02', itemsSold: 55, totalAmount: 110000 },
    { date: '2024-10-03', itemsSold: 60, totalAmount: 120000 },
    { date: '2024-10-04', itemsSold: 65, totalAmount: 130000 },
    { date: '2024-10-05', itemsSold: 70, totalAmount: 140000 },
    { date: '2024-10-06', itemsSold: 75, totalAmount: 150000 },
    { date: '2024-10-07', itemsSold: 80, totalAmount: 160000 },
    { date: '2024-10-08', itemsSold: 85, totalAmount: 170000 },
    { date: '2024-10-09', itemsSold: 90, totalAmount: 180000 },
    { date: '2024-10-10', itemsSold: 95, totalAmount: 190000 },
  
    // Add more mock data as needed for different months and years
  ];
// Mock data for item-wise sales report
const itemSalesReport = [
  { id: 1, name: 'Beer', quantitySold: 100, totalSales: 100000 },
  { id: 2, name: 'Whiskey', quantitySold: 50, totalSales: 100000 },
  { id: 3, name: 'Wine', quantitySold: 75, totalSales: 112500 },
  // Add more mock data as needed
];

const Reports = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('Daily');
    const [filteredData, setFilteredData] = useState(dailySalesReport);
  
    const aggregateData = (reports, periodLength) => {
      const aggregatedReports = [];
      for (let i = 0; i < reports.length; i += periodLength) {
        const periodReports = reports.slice(i, i + periodLength);
        const totalItemsSold = periodReports.reduce((sum, report) => sum + report.itemsSold, 0);
        const totalAmount = periodReports.reduce((sum, report) => sum + report.totalAmount, 0);
        const startDate = periodReports[0].date;
        const endDate = periodReports[periodReports.length - 1].date;
  
        aggregatedReports.push({
          dateRange: `${startDate} - ${endDate}`,
          itemsSold: totalItemsSold,
          totalAmount,
        });
      }
      return aggregatedReports;
    };
  
    const handleSelectPeriod = (period) => {
      setSelectedPeriod(period);
  
      let filteredReports;
      switch (period) {
        case 'Weekly':
          filteredReports = aggregateData(dailySalesReport, 7);
          break;
        case 'Monthly':
          filteredReports = aggregateData(dailySalesReport, 30);
          break;
        case 'Annual':
          filteredReports = aggregateData(dailySalesReport, 365);
          break;
        default:
          filteredReports = dailySalesReport;
          break;
      }
      setFilteredData(filteredReports);
    };
  
    return (
      <div className="container mt-4">
        <h2>Sales Reports</h2>
  
        {/* Period Selection Buttons */}
        <ButtonGroup className="mb-3">
          <Button
            variant={selectedPeriod === 'Daily' ? 'primary' : 'outline-primary'}
            onClick={() => handleSelectPeriod('Daily')}
          >
            Daily
          </Button>
          <Button
            variant={selectedPeriod === 'Weekly' ? 'primary' : 'outline-primary'}
            onClick={() => handleSelectPeriod('Weekly')}
          >
            Weekly
          </Button>
          <Button
            variant={selectedPeriod === 'Monthly' ? 'primary' : 'outline-primary'}
            onClick={() => handleSelectPeriod('Monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={selectedPeriod === 'Annual' ? 'primary' : 'outline-primary'}
            onClick={() => handleSelectPeriod('Annual')}
          >
            Annual
          </Button>
        </ButtonGroup>
  
        {/* Filtered Sales Report Table */}
        <h3 className="mt-4">{selectedPeriod} Sales Report</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>{selectedPeriod === 'Daily' ? 'Date' : 'Period'}</th>
              <th>Items Sold</th>
              <th>Total Amount (FCFA)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((report, index) => (
              <tr key={index}>
                <td>{selectedPeriod === 'Daily' ? report.date : report.dateRange}</td>
                <td>{report.itemsSold}</td>
                <td>{report.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
  
        {/* Item-wise Sales Report Table */}
        <h3 className="mt-4">Item-wise Sales Report</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity Sold</th>
              <th>Total Sales (FCFA)</th>
            </tr>
          </thead>
          <tbody>
            {itemSalesReport.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantitySold}</td>
                <td>{item.totalSales}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };
  
  export default Reports;