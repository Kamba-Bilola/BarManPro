// Structure for AppConfig table
export const AppConfigStructure = {
  keyPath: 'id',  
  autoIncrement: false, 
  fields: [
    { name: 'appId', indexed: true },  
    { name: 'mode', indexed: false },  
    { name: 'version', indexed: false },  
    {
      name: 'device', fields: [
        { name: 'deviceId', indexed: true },  
        { name: 'deviceName', indexed: false },  
        { name: 'os', indexed: false },  
        { name: 'manufacturer', indexed: false },  
        { name: 'model', indexed: false },  
        { name: 'lastSyncDate', indexed: false }  
      ]
    },

    {
      name: 'testMode', fields: [
        { name: 'enabled', indexed: false },  
        { name: 'testServerUrl', indexed: false },  
        {
          name: 'testUser', fields: [
            { name: 'userId', indexed: false },  
            { name: 'userName', indexed: false }  
          ]
        }
      ]
    },
    {
      name: 'productionMode', fields: [
        { name: 'enabled', indexed: false },  
        { name: 'productionServerUrl', indexed: false }  
      ]
    },
    {
      name: 'additionalInfo', fields: [
        { name: 'lastUpdate', indexed: false },  
        { name: 'notes', indexed: false }  
      ]
    }
  ]
};

  
  // Structure for GapReports table
  export const GapReportsStructure = {
    keyPath: 'id',
    autoIncrement: false,
    fields: [
      { name: 'barId', indexed: true , keyType: 'foreign', reference: { table: 'Bars', field: 'id' } },
      { name: 'userId', indexed: true , keyType: 'foreign', reference: { table: 'Users', field: 'uid' } },
      { name: 'gapType', indexed: false },
      { name: 'detectedAt', indexed: false },
      { name: 'amount', indexed: false },
      { name: 'description', indexed: false },
      { name: 'status', indexed: false },
      { name: 'validatedBy', indexed: false },
      { name: 'validationDate', indexed: false },
      { name: 'notes', indexed: false }
    ]
  };
  
  
  // Structure for StoreChecks table
  export const StoreChecksStructure = {
    keyPath: 'id',
    autoIncrement: false,
    fields: [
      { name: 'barId', indexed: true , keyType: 'foreign', reference: { table: 'Bars', field: 'id' } },
      { name: 'userId', indexed: true , keyType: 'foreign', reference: { table: 'Users', field: 'uid' } },
      { name: 'checkType', indexed: false },
      { name: 'checkTime', indexed: false },
      { name: 'stockLevels', indexed: false }, // Array of stock levels, not indexed
      { name: 'notes', indexed: false }
    ]
  };
  
  
  // Structure for Documents table
  export const DocumentsStructure = {
    keyPath: 'id',
    autoIncrement: false,
    fields: [
      { name: 'userId', indexed: true , keyType: 'foreign', reference: { table: 'Users', field: 'uid' } },
      { name: 'fileName', indexed: false },
      { name: 'filePath', indexed: false },
      { name: 'fileType', indexed: false },
      { name: 'reportType', indexed: false },
      { name: 'barId', indexed: true , keyType: 'foreign', reference: { table: 'Bars', field: 'id' } },
      { name: 'createdAt', indexed: false },
      { name: 'shared', indexed: false },
      { name: 'sharedWith', indexed: false } // Array of shared users, not indexed
    ]
  };
  
  
  // Structure for Sessions table
  export const SessionsStructure = {
    keyPath: 'id',
    autoIncrement: false,
    fields: [
      { name: 'barId', indexed: true , keyType: 'foreign', reference: { table: 'Bars', field: 'id' } },
      { name: 'userId', indexed: true , keyType: 'foreign', reference: { table: 'Users', field: 'uid' } },
      { name: 'sessionStart', indexed: false },
      { name: 'sessionEnd', indexed: false },
      { name: 'saleStart', indexed: false },
      { name: 'saleEnd', indexed: false },
      { name: 'totalSales', indexed: false },
      { name: 'itemsSold', indexed: false },
      { name: 'status', indexed: false },
      { name: 'dailySalesReportId', indexed: true },
      { name: 'sessionReportId', indexed: true , keyType: 'foreign', reference: { table: 'Documents', field: 'id' } },
      { name: 'itemSalesReportId', indexed: true , keyType: 'foreign', reference: { table: 'Documents', field: 'id' } },
      { name: 'stockReportId', indexed: true , keyType: 'foreign', reference: { table: 'Documents', field: 'id' } },
    ]
  };
  
  
// Structure for Bars table
export const BarsStructure = {
  keyPath: 'id',
  autoIncrement: false,
  fields: [
    { name: 'name', indexed: false },
    { name: 'location', indexed: false },
    { name: 'ownerUid', indexed: true, keyType: 'foreign', reference: { table: 'Users', field: 'uid' } },
    { name: 'status', indexed: false },
    { name: 'subscriptionExpiration', indexed: false },
    { name: 'lastPaymentCode', indexed: false },
    { name: 'lastPaymentMethod', indexed: false },
    { name: 'numberOfTables', indexed: false },
    { name: 'totalSales', indexed: false },
    { name: 'totalGap', indexed: false },
    { name: 'subscriptionLevel', indexed: false }
  ]
};

  
  // Structure for Users table
  export const UsersStructure = {
    keyPath: 'uid',
    autoIncrement: false,
    fields: [
      { name: 'displayName', indexed: false },
      { name: 'photoURL', indexed: false },
      { name: 'email', indexed: true },
      { name: 'emailVerified', indexed: false },
      { name: 'isAnonymous', indexed: false },
      { name: 'providerData', indexed: false, type: 'array',
        fields: [
          { name: 'providerId', indexed: true },
          { name: 'uid', indexed: true },
          { name: 'displayName', indexed: false },
          { name: 'email', indexed: true },
          { name: 'phoneNumber', indexed: false },
          { name: 'photoURL', indexed: false }
        ]
      },
      { name: 'stsTokenManager', indexed: false, type: 'object',
        fields: [
          { name: 'refreshToken', indexed: false },
          { name: 'accessToken', indexed: false },
          { name: 'expirationTime', indexed: false }
        ]
      },
      { name: 'createdAt', indexed: true },
      { name: 'lastLoginAt', indexed: true },
      { name: 'apiKey', indexed: false },
      { name: 'appName', indexed: false },
      { name: 'tokenExpiration', indexed: false }
    ]
  };
  
  
  // Structure for Stocks table
  export const StockStructure = {
    keyPath: 'id',
    autoIncrement: false,
    fields: [
      { name: 'name', indexed: false },
      { name: 'sizes', indexed: false, type: 'array', 
        fields: [
          { name: 'size', indexed: false },
          { name: 'price', indexed: false },
          { name: 'image', indexed: false }
        ]
      }
    ]
  };
  
  
  // Structure for SalesReports table
  export const SalesReportsStructure = {
    keyPath: 'id',
    autoIncrement: true,
    fields: [
      { name: 'barId', indexed: true, keyType: 'foreign', reference: { table: 'Bars', field: 'id' } },
      { name: 'totalSales', indexed: false },
      { name: 'reportDate', indexed: true },
      { name: 'numberOfItemsSold', indexed: false },
      { name: 'items', indexed: false }, // Could store item sales data here as an array
    ]
  };
  // Structure for ItemSalesReport table
  export const ItemSalesReportStructure = {
    keyPath: 'id',
    autoIncrement: false,
    fields: [
      { name: 'name', indexed: false },
      { name: 'quantitySold', indexed: false },
      { name: 'totalSales', indexed: false }
    ]
  };
  
  
  // Structure for BarUserPermissions table
  export const BarUserPermissionsStructure = {
    keyPath: 'id',
    autoIncrement: false,
    fields: [
      { name: 'barId', indexed: true , keyType: 'foreign', reference: { table: 'Bars', field: 'id' } },
      { name: 'userId', indexed: true , keyType: 'foreign', reference: { table: 'Users', field: 'uid' } },
      { name: 'canUpdateSales', indexed: false },
      { name: 'canUpdateStock', indexed: false },
      { name: 'grantedBy', indexed: true , keyType: 'foreign', reference: { table: 'Users', field: 'uid' } },
      { name: 'grantedAt', indexed: false }
    ]
  };

  export const SyncMapStructure = {
    keyPath: 'indexedDBId',
    autoIncrement: false,
    fields: [
      { name: 'tableName', indexed: false },
      { name: 'indexedDBId', indexed: true },
      { name: 'firestoreId', indexed: true }
    ]
  };
  
  
  