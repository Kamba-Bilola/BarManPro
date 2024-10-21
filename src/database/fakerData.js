

const AppConfig1 = {
    id: 'app_001',
    appId: 'com.example.myapp',
    mode: 'test',  // could be 'test' or 'production'
    version: '1.0.5',
    device: {
      deviceId: 'dev_101',
      deviceName: 'iPhone 12',
      os: 'iOS 14.4',
      manufacturer: 'Apple',
      model: 'A2172',
      lastSyncDate: '2024-08-15T14:30:00Z'
    },
    testMode: {
      enabled: true,
      testServerUrl: 'https://test.example.com/api',
      testUser: {
        userId: 'test_user_001',
        userName: 'Test User One'
      }
    },
    productionMode: {
      enabled: false,
      productionServerUrl: ''
    },
    additionalInfo: {
      lastUpdate: '2024-08-12T10:00:00Z',
      notes: 'Testing version 1.0.5 features'
    }
  };
  
  const AppConfig2 = {
    id: 'app_002',
    appId: 'com.example.anotherapp',
    mode: 'production',
    version: '2.3.1',
    device: {
      deviceId: 'dev_202',
      deviceName: 'Samsung Galaxy S21',
      os: 'Android 11',
      manufacturer: 'Samsung',
      model: 'SM-G991B',
      lastSyncDate: '2024-09-01T08:45:00Z'
    },
    testMode: {
      enabled: false,
      testServerUrl: '',
      testUser: {
        userId: '',
        userName: ''
      }
    },
    productionMode: {
      enabled: true,
      productionServerUrl: 'https://api.example.com'
    },
    additionalInfo: {
      lastUpdate: '2024-09-01T08:00:00Z',
      notes: 'Production ready'
    }
  };
  
  const AppConfig3 = {
    id: 'app_003',
    appId: 'com.example.finalapp',
    mode: 'test',
    version: '0.9.9',
    device: {
      deviceId: 'dev_303',
      deviceName: 'Google Pixel 5',
      os: 'Android 12',
      manufacturer: 'Google',
      model: 'GD1YQ',
      lastSyncDate: '2024-08-20T12:15:00Z'
    },
    testMode: {
      enabled: true,
      testServerUrl: 'https://dev.example.com/api',
      testUser: {
        userId: 'test_user_003',
        userName: 'Test User Three'
      }
    },
    productionMode: {
      enabled: false,
      productionServerUrl: ''
    },
    additionalInfo: {
      lastUpdate: '2024-08-19T16:30:00Z',
      notes: 'Testing new features and bug fixes'
    }
  };

  



 const GapReport1 = 
    {
      id: 'GR001',
      barId: 'B001',  // Reference to Bars table
      userId: 'U001',  // Reference to Users table
      gapType: 'Stock Discrepancy',
      detectedAt: '2024-09-01T08:30:00Z',
      amount: 250.75,
      description: 'Discrepancy in stock count for product X.',
      status: 'Pending',
      validatedBy: null,
      validationDate: null,
      notes: 'Awaiting review from manager.'
    };
    
    const GapReport2 =  {
      id: 'GR002',
      barId: 'B002',
      userId: 'U002',
      gapType: 'Cash Register Discrepancy',
      detectedAt: '2024-09-02T10:00:00Z',
      amount: 150.50,
      description: 'Difference in cash register at closing.',
      status: 'Validated',
      validatedBy: 'Manager01',
      validationDate: '2024-09-03T15:20:00Z',
      notes: 'Verified by manager after review.'
    };
    
    const GapReport3 =  {
      id: 'GR003',
      barId: 'B001',
      userId: 'U003',
      gapType: 'Missing Stock',
      detectedAt: '2024-09-05T09:45:00Z',
      amount: 300.00,
      description: 'Missing bottles of whiskey in inventory.',
      status: 'Pending',
      validatedBy: null,
      validationDate: null,
      notes: 'Inventory will be checked again.'
    };
  

// Fake data for StoreChecks
const StoreCheck1 = 
    {
      id: 'sc001',
      barId: 'bar001',  // Foreign key referencing Bars table
      userId: 'user001',  // Foreign key referencing Users table
      checkType: 'inventory',
      checkTime: '2024-09-10T10:30:00Z',
      stockLevels: [
        { productId: 'prod001', quantity: 20 },
        { productId: 'prod002', quantity: 15 }
      ],  // Array of stock levels
      notes: 'All stocks in good condition.'
    };
    const StoreCheck2 =   {
      id: 'sc002',
      barId: 'bar002',
      userId: 'user002',
      checkType: 'security',
      checkTime: '2024-09-11T14:00:00Z',
      stockLevels: [
        { productId: 'prod003', quantity: 50 },
        { productId: 'prod004', quantity: 30 }
      ],
      notes: 'Security check completed. No issues.'
    };
    const StoreCheck3 =  
    {
      id: 'sc003',
      barId: 'bar003',
      userId: 'user003',
      checkType: 'maintenance',
      checkTime: '2024-09-12T09:00:00Z',
      stockLevels: [
        { productId: 'prod005', quantity: 10 },
        { productId: 'prod006', quantity: 25 }
      ],
      notes: 'Maintenance check done. Need replacement for some equipment.'
    };
  
  addItem("AppConfig", AppConfig1);
  addItem("AppConfig", AppConfig2);
  addItem("AppConfig", AppConfig3);
  addItem("GapReports", GapReport1);
  addItem("GapReports", GapReport2);
  addItem("GapReports", GapReport3);
  addItem("StoreChecks", StoreCheck1);
  addItem("StoreChecks", StoreCheck2);
  addItem("StoreChecks", StoreCheck3);

  

