import React, { useState, useEffect } from 'react';
import { Table, Button, ButtonGroup } from 'react-bootstrap';

// Retrieve data from localStorage or use fallback mock data
const getDataFromLocalStorage = (key, fallbackData) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : fallbackData;
};


const dailySalesReportKey = 'dailySalesReport';
const itemSalesReportKey = 'itemSalesReport';
// Mock data for daily sales report
const  initialDailySalesReport = [];
// Mock data for item-wise sales report
const initialItemSalesReport = [];

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Daily');
  const [dailySalesReport, setDailySalesReport] = useState([]);
  const [itemSalesReport, setItemSalesReport] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Load data from local storage
    const storedDailySalesReport = getDataFromLocalStorage(dailySalesReportKey, initialDailySalesReport);
    const storedItemSalesReport = getDataFromLocalStorage(itemSalesReportKey, initialItemSalesReport);

    setDailySalesReport(storedDailySalesReport);
    setItemSalesReport(storedItemSalesReport);
    setFilteredData(storedDailySalesReport);
  }, []);

  useEffect(() => {
    // Save updated data to local storage whenever the data changes
    localStorage.setItem(dailySalesReportKey, JSON.stringify(dailySalesReport));
    localStorage.setItem(itemSalesReportKey, JSON.stringify(itemSalesReport));
  }, [dailySalesReport, itemSalesReport]);

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