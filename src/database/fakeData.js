// database/fakeData.js

export const fakeData = {
    
    AppConfig : [
        {
          id: 'config001',  // Unique ID for the app configuration
          appId: 'app-12345',  // Unique ID for the app instance
          mode: 'Production',  // Can be 'Test' or 'Production'
          version: '1.0.0',    // Current version of the app
          device: {
            deviceId: 'device-67890',  // Unique ID for the device
            deviceName: 'Samsung Galaxy S21',  // Name/model of the device
            os: 'Android 12',  // Operating system of the device
            manufacturer: 'Samsung',  // Manufacturer of the device
            model: 'SM-G991B',  // Device model number
            lastSyncDate: '2024-09-10T14:00:00',  // Last synchronization date
          },
          testMode: {
            enabled: false,  // Whether test mode is currently enabled
            testServerUrl: '',  // URL for test server (if applicable)
            testUser: {
              userId: 'test-user-001',  // ID of the test user (if applicable)
              userName: 'Test User',  // Name of the test user
            },
          },
          productionMode: {
            enabled: true,  // Whether production mode is currently enabled
            productionServerUrl: 'https://prod.example.com',  // URL for production server
          },
          additionalInfo: {
            lastUpdate: '2024-09-10T12:00:00',  // Date and time when the app was last updated
            notes: 'Initial setup for production deployment.',  // Any additional notes
          },
        }],

    GapReports : [
        {
          id: 'gap001',  // Unique ID for the gap report
          barId: 1,  // Bar where the gap was detected
          userId: 1,  // User who reported the gap (usually the barman)
          gapType: 'Money',  // Type of gap: 'Money' or 'Stock'
          detectedAt: '2024-09-10T23:30:00',  // Timestamp when the gap was detected
          amount: -5000,  // The amount missing or extra (-5000 means 5000 is missing)
          description: '5000 FCFA missing from the register at the end of the day.',
          status: 'Pending',  // Status: 'Pending', 'Validated', or 'Rejected'
          validatedBy: null,  // ID of the owner who validated it, initially null
          validationDate: null,  // Date of validation, initially null
          notes: 'To be validated by the bar owner.',
        },
        {
          id: 'gap002',
          barId: 1,
          userId: 1,
          gapType: 'Stock',
          detectedAt: '2024-09-09T22:00:00',
          itemDetails: [  // For stock discrepancies, include items
            { itemId: 'item001', itemName: 'Beer', expectedQuantity: 50, actualQuantity: 45 },
            { itemId: 'item003', itemName: 'Soda', expectedQuantity: 100, actualQuantity: 95 }
          ],
          status: 'Pending',
          validatedBy: null,
          validationDate: null,
          notes: 'Stock mismatch detected at the end of the shift.',
        },
        {
          id: 'gap003',
          barId: 2,
          userId: 2,
          gapType: 'Money',
          detectedAt: '2024-09-08T21:30:00',
          amount: 2000,  // A positive number means there is extra money
          description: '2000 FCFA extra found in the register.',
          status: 'Validated',
          validatedBy: 3,  // ID of the owner who validated it
          validationDate: '2024-09-09T09:00:00',  // Validation date
          notes: 'Validated by bar owner on 2024-09-09.',
        }
      ],
    StoreChecks : [
        {
          id: 'check001',  // Unique ID for the check
          barId: 1,  // Bar where the check was performed
          userId: 1,  // User performing the check (bar man or owner)
          checkType: 'Pre-shift',  // Either 'Pre-shift' or 'Post-shift'
          checkTime: '2024-09-10T08:00:00',  // Timestamp of when the check was done
          stockLevels: [
            { itemId: 'item001', itemName: 'Beer', quantity: 50 },  // Example item and its stock count
            { itemId: 'item002', itemName: 'Whiskey', quantity: 30 },
            { itemId: 'item003', itemName: 'Soda', quantity: 100 }
          ],
          notes: 'All stock accounted for and in good condition',  // Any additional comments
        },
        {
          id: 'check002',
          barId: 1,
          userId: 1,
          checkType: 'Post-shift',
          checkTime: '2024-09-10T23:00:00',
          stockLevels: [
            { itemId: 'item001', itemName: 'Beer', quantity: 20 },
            { itemId: 'item002', itemName: 'Whiskey', quantity: 15 },
            { itemId: 'item003', itemName: 'Soda', quantity: 80 }
          ],
          notes: 'Some items were low on stock; need to restock beer and soda.',
        },
        {
          id: 'check003',
          barId: 2,  // Another bar performing the check
          userId: 2,
          checkType: 'Pre-shift',
          checkTime: '2024-09-09T09:00:00',
          stockLevels: [
            { itemId: 'item004', itemName: 'Rum', quantity: 40 },
            { itemId: 'item005', itemName: 'Vodka', quantity: 35 }
          ],
          notes: 'No issues with stock levels.',
        }
      ],
    Documents:[
        {
            id: 1,
            userId: 1, // Links to the user who owns the document
            fileName: "daily_sales_report_2024-09-10.pdf",
            filePath: "/storage/emulated/0/Documents/Reports/daily_sales_report_2024-09-10.pdf",
            fileType: "pdf",
            reportType: "Daily Sales",
            barId: 1, // Can be related to a session or bar
            createdAt: "2024-09-10T22:30:00",
            shared: false,
            sharedWith: [],
        },
        {
            id: 2,
            userId: 1,
            fileName: "session_report_2024-09-09.csv",
            filePath: "/storage/emulated/0/Documents/Reports/session_report_2024-09-09.csv",
            fileType: "csv",
            reportType: "Session Report",
            barId: 2, // Links to sessionId
            createdAt: "2024-09-09T23:30:00",
            shared: true,
            sharedWith: ["manager@example.com"],
        },
        {
            id: 3,
            userId: 2,
            fileName: "item_sales_report_2024-09-08.xlsx",
            filePath: "/storage/emulated/0/Documents/Reports/item_sales_report_2024-09-08.xlsx",
            fileType: "xlsx",
            reportType: "Post-shift Stock Report",
            barId: 3, // Links to a specific item or session
            createdAt: "2024-09-08T20:15:00",
            shared: false,
            sharedWith: [],
        },
        {
            id: 4,
            userId: 2,
            fileName: "stock_report_2024-09-07.pdf",
            filePath: "/storage/emulated/0/Documents/Reports/stock_report_2024-09-07.pdf",
            fileType: "pdf",
            reportType: "Pre-shift Stock Report",
            relatedId: 1, // Can be related to a specific bar or session
            createdAt: "2024-09-07T18:45:00",
            shared: true,
            sharedWith: ["owner@example.com", "inventory@example.com"],
        }
    ],
   Sessions :[
        {
            id: 1,
            barId: 1, // Links to 'Bar de la paix'
            userId: 1, // Links to the user managing this session
            sessionStart: '2024-09-10T14:00:00',
            sessionEnd: '2024-09-10T22:00:00',
            saleStart: '2024-09-10T14:00:00',
            saleEnd: '2024-09-10T22:00:00',
            totalSales: 150000, // Total amount from sales in the session
            itemsSold: 50, // Total number of items sold
            status: 'Closed',
            dailySalesReportId: 101, // Links to the Daily Sales Report
            sessionReportId: 201,    // Links to the Session Report
            itemSalesReportId: 301,  // Links to the Item Sales Report
            stockReportId: 401,      // Links to the Stock Report
        },
        {
            id: 2,
            barId: 2, // Links to 'MASSANGA BAR'
            userId: 2,
            sessionStart: '2024-09-09T15:00:00',
            sessionEnd: '2024-09-09T23:00:00',            
            saleStart: '2024-09-10T14:00:00',
            saleEnd: '2024-09-10T22:00:00',
            totalSales: 180000,
            itemsSold: 60,
            status: 'Closed',
            dailySalesReportId: 102, // Links to the Daily Sales Report
            sessionReportId: 202,    // Links to the Session Report
            itemSalesReportId: 302,  // Links to the Item Sales Report
            stockReportId: 402,      // Links to the Stock Report
        },
        {
            id: 3,
            barId: 3, // Links to 'Entre Nous Bar'
            userId: 3,
            sessionStart: '2024-09-08T16:00:00',
            sessionEnd: '2024-09-08T00:00:00',            
            saleStart: '2024-09-10T14:00:00',
            saleEnd: '2024-09-10T22:00:00',
            totalSales: 200000,
            itemsSold: 70,
            paymentMethod: 'Cash',
            paymentCode: 'PAY003',
            status: 'Closed',
            dailySalesReportId: 103, // Links to the Daily Sales Report
            sessionReportId: 203,    // Links to the Session Report
            itemSalesReportId: 303,  // Links to the Item Sales Report
            stockReportId: 403,      // Links to the Stock Report
        }],

    Bars:[
        {
            id: 1,
            name: 'Bar de la paix',
            location: 'Libreville',
            ownerUid: "O3PlSdCr5aGzRbV2H6K7Z8jAqVe1", // Links to the users table
            status: 'Active',
            subscriptionExpiration: '2024-12-31',
            lastPaymentCode: 'PAY123',
            lastPaymentMethod: 'Mobile Money',
            numberOfTables: 15,
            subscriptionLevel:"Normal"
        },
        {
            id: 2,
            name: 'MASSANGA BAR',
            location: 'Owendo',
            ownerUid: "PzKnSaFw9hWJxLmH9VjV6h2FqVz3", // Links to the users table
            status: 'Non-Active',
            subscriptionExpiration: '2023-11-15',
            lastPaymentCode: 'PAY456',
            lastPaymentMethod: 'Credit Card',
            numberOfTables: 10,
            subscriptionLevel:"Premium"
        },
        {
            id: 3,
            name: 'Entre Nous Bar',
            location: 'Akanda',
            ownerUid: "NwJKQiWA9cSTxhkHhIfbUON1Zkk2", // Links to the users table
            status: 'Active',
            subscriptionExpiration: '2024-01-10',
            lastPaymentCode: 'PAY789',
            lastPaymentMethod: 'Cash',
            numberOfTables: 20,
            subscriptionLevel:"Normal"
        }
    ],
  BarUserPermissions: [
  {
    id: 1,  // Unique ID for the permission record
    barId: 1,  // Bar where the permission applies
    userId: 2,  // User to whom the permission applies (barman)
    canUpdateSales: false,  // Whether the user can update sales or not
    canUpdateStock: true,  // Whether the user can update stock or not
    grantedBy: 3,  // ID of the bar owner who granted the permission
    grantedAt: '2024-09-10T09:00:00',  // Date and time when permission was granted
  },
  {
    id: 2,
    barId: 2,
    userId: 3,
    canUpdateSales: true,
    canUpdateStock: true,
    grantedBy: 3,
    grantedAt: '2024-09-09T08:00:00',
  }
], 
Report:[
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
      ], 
    ItemSalesReport:[
    { id: 1, name: 'Beer', quantitySold: 100, totalSales: 100000 },
    { id: 2, name: 'Whiskey', quantitySold: 50, totalSales: 100000 },
    { id: 3, name: 'Wine', quantitySold: 75, totalSales: 112500 },
    // Add more mock data as needed
  ], 
  InitStock:[
      { id: 1, name: 'Beer', sizes: [
          { size: 'Small', price: 500, image: 'beer_small.png' },
          { size: 'Medium', price: 1000, image: 'beer_medium.png' },
          { size: 'Large', price: 1500, image: 'beer_large.png' },
          { size: 'Extra Large', price: 2000, image: 'beer_extra_large.png' },
      ]},
      { id: 2, name: 'Whiskey', sizes: [
          { size: 'Small', price: 1500, image: 'whiskey_small.png' },
          { size: 'Medium', price: 2000, image: 'whiskey_medium.png' },
          { size: 'Large', price: 2500, image: 'whiskey_large.png' },
          { size: 'Extra Large', price: 3000, image: 'whiskey_extra_large.png' },
      ]},
      { id: 3, name: 'Wine', sizes: [
          { size: 'Small', price: 1000, image: 'wine_small.png' },
          { size: 'Medium', price: 1500, image: 'wine_medium.png' },
          { size: 'Large', price: 2000, image: 'wine_large.png' },
          { size: 'Extra Large', price: 2500, image: 'wine_extra_large.png' },
      ]},
      { id: 4, name: 'Vodka', sizes: [
          { size: 'Small', price: 2000, image: 'vodka_small.png' },
          { size: 'Medium', price: 2500, image: 'vodka_medium.png' },
          { size: 'Large', price: 3000, image: 'vodka_large.png' },
          { size: 'Extra Large', price: 3500, image: 'vodka_extra_large.png' },
      ]},
      { id: 5, name: 'Rum', price: 1800, image: 'rum.png' },
      { id: 6, name: 'Gin', price: 2300, image: 'gin.png' },
      { id: 7, name: 'Tequila', price: 2700, image: 'tequila.png' },
      { id: 8, name: 'Brandy', price: 2600, image: 'brandy.png' },
      { id: 9, name: 'Champagne', price: 3000, image: 'champagne.png' },
      { id: 10, name: 'Cider', price: 800, image: 'cider.png' },
      { id: 11, name: 'Sake', price: 2200, image: 'sake.png' },
      { id: 12, name: 'Scotch', price: 3200, image: 'scotch.png' },
      { id: 13, name: 'Bourbon', price: 2900, image: 'bourbon.png' },
      { id: 14, name: 'Rosé Wine', price: 1600, image: 'rose_wine.png' },
      { id: 15, name: 'White Wine', price: 1400, image: 'white_wine.png' },
      { id: 16, name: 'Red Wine', price: 1700, image: 'red_wine.png' },
      { id: 17, name: 'Port Wine', price: 2100, image: 'port_wine.png' },
      { id: 18, name: 'Sherry', price: 1900, image: 'sherry.png' },
      { id: 19, name: 'Absinthe', price: 3500, image: 'absinthe.png' },
      { id: 20, name: 'Mead', price: 1300, image: 'mead.png' },
      { id: 21, name: 'Aperol', price: 2400, image: 'aperol.png' },
      { id: 22, name: 'Campari', price: 2500, image: 'campari.png' },
      { id: 23, name: 'Vermouth', price: 2000, image: 'vermouth.png' },
      { id: 24, name: 'Cognac', price: 3400, image: 'cognac.png' },
      { id: 25, name: 'Armagnac', price: 3300, image: 'armagnac.png' },
      { id: 26, name: 'Baijiu', price: 4000, image: 'baijiu.png' },
      { id: 27, name: 'Soju', price: 1000, image: 'soju.png' },
      { id: 28, name: 'Schnapps', price: 2100, image: 'schnapps.png' },
      { id: 29, name: 'Amaretto', price: 2300, image: 'amaretto.png' },
      { id: 30, name: 'Limoncello', price: 1500, image: 'limoncello.png' },
      { id: 31, name: 'Grappa', price: 2700, image: 'grappa.png' },
      { id: 32, name: 'Pisco', price: 2800, image: 'pisco.png' },
      { id: 33, name: 'Jägermeister', price: 2100, image: 'jagermeister.png' },
      { id: 34, name: 'Cachaça', price: 2000, image: 'cachaca.png' },
      { id: 35, name: 'Irish Cream', price: 1800, image: 'irish_cream.png' },
      { id: 36, name: 'Bitters', price: 1400, image: 'bitters.png' },
      { id: 37, name: 'Triple Sec', price: 1300, image: 'triple_sec.png' },
      { id: 38, name: 'Blue Curacao', price: 1500, image: 'blue_curacao.png' },
      { id: 39, name: 'Kahlúa', price: 1900, image: 'kahlua.png' },
      { id: 40, name: 'Fernet', price: 2500, image: 'fernet.png' },
      { id: 41, name: 'Ouzo', price: 1600, image: 'ouzo.png' },
      { id: 42, name: 'Pastis', price: 1800, image: 'pastis.png' },
      { id: 43, name: 'Rakija', price: 2200, image: 'rakija.png' },
      { id: 44, name: 'Slivovitz', price: 2300, image: 'slivovitz.png' },
      { id: 45, name: 'Arak', price: 1900, image: 'arak.png' },
      { id: 46, name: 'Tej', price: 1100, image: 'tej.png' },
      { id: 47, name: 'Palm Wine', price: 1200, image: 'palm_wine.png' },
      { id: 48, name: 'Toddy', price: 900, image: 'toddy.png' },
      { id: 49, name: 'Hard Cider', price: 1000, image: 'hard_cider.png' },
      { id: 50, name: 'Kombucha', price: 800, image: 'kombucha.png' },
    ], 
    // database/fakeData.js

  Users :[
    {
        uid: "NwJKQiWA9cSTxhkHhIfbUON1Zkk2",
        displayName:null,
        photoURL:null,
        email: "mayomboted2@gmail.com",
        emailVerified: false,
        isAnonymous: false,
        providerData: [
            {
                providerId: "password",
                uid: "mayomboted2@gmail.com",
                displayName: null,
                email: "mayomboted2@gmail.com",
                phoneNumber: null,
                photoURL: null
            }
        ],
        stsTokenManager: {
            refreshToken: "AMf-vBwK022Ci27VXvkCgX8y6VEIzTpWGvNUDRWijdVVNJmnHzIy3fpg33VUjd4FFesCCw97qQxSBFwNHrP1R7jHkC_GfT74HNmTBbzM6CNpzb87CwOjTnYSTyKC-HX3yS0op6irtYG9UsnUAbEa0W0B6tWW3C-D8l-Y8AeUJcih9h8zL53W3Wed_FB7-abFDid39bo3GDExcv69GrzHZ7CqlB98T_epnw",
            accessToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNjNWU0MTg0M2M1ZDUyZTY4ZWY1M2UyYmVjOTgxNDNkYTE0NDkwNWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYmFyLW1hbi1wcm8iLCJhdWQiOiJiYXItbWFuLXBybyIsImF1dGhfdGltZSI6MTcyNTk0NjM1NCwidXNlcl9pZCI6Ik53SktRaVdBOWNTVHhoa0hoSWZiVU9OMVprazIiLCJzdWIiOiJOd0pLUWlXQTljU1R4aGtIaElmYlVPTjFaa2syIiwiaWF0IjoxNzI1OTQ2MzU0LCJleHAiOjE3MjU5NDk5NTQsImVtYWlsIjoibWF5b21ib3RlZDJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbIm1heW9tYm90ZWQyQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.kPKlk8s7CJxeuzB1mSN48Nd0kQC1kZrq7TmMjNnHjTeZ_6Mfk_qP5qjO_OGm-zYRYYWkNHRymdGTO0GzzNiU5yAnpwn-LdvXhDfxx9ZGYXGC6WvgW-mFdoKGvNzx-O_jQkt8cpIOh9_ankAspXYdTnX9i4J3fD4X6h85NSsv9Nl_D8Xbe3-t-36GftHJJmS_HYcodDB_kRbw5qsbdBjGurUYeXRDXcvxI1uLT8Me1rCNLO3xHtajqBcONcEzljz8nqDjQQwoH4isYU2J0BwnYUi2m_tOkCsPFKj15k46OVdHR0bRSj3J4zRfoqBdkFQ226PBU6HW5hSOhJURwlfm2g",
            expirationTime: 1725949955077
        },
        createdAt: "1725786790895",
        lastLoginAt: "1725946354955",
        apiKey: "AIzaSyCdR7rt7_Z0khHVLLeZA7mc_AtR2Ht2_pI",
        appName: "[DEFAULT]",
        tokenExpiration: new Date(1725949955077).toISOString()
    },
    {
        uid: "PzKnSaFw9hWJxLmH9VjV6h2FqVz3",
        displayName:null,
        photoURL:null,
        email: "christian.milenzi@example.com",
        emailVerified: false,
        isAnonymous: false,
        providerData: [
            {
                providerId: "password",
                uid: "christian.milenzi@example.com",
                displayName: null,
                email: "christian.milenzi@example.com",
                phoneNumber: null,
                photoURL: null
            }
        ],
        stsTokenManager: {
            refreshToken: "BKy3gVrQ9mL3Ki4Zm5AjRgX1HntE9W4PDeB2hVm9Gk5U0Y8S0PRewOw6g1Gg3Q4rCdK1ph8zN2xZt3xjYVsx9aWFP2V6kKFVv5aH0lbTBpYtUj8NGXlO86C3k1TLvZV7NZdD5TCthvf8QJMCjLiq9wJHgKL_WKt6vq7yZ9Afk3w4wTRg7WhPloH5Z8w",
            accessToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNzYmMyZDIxM2QzNzFhZDE0Y2RkYTc4NjE5OTYxMGJlYjMwNzUwMTciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYmFyLW1hbi1wcm8iLCJhdWQiOiJiYXItbWFuLXBybyIsImF1dGhfdGltZSI6MTcyNTk0NjM1NCwidXNlcl9pZCI6IlB6S25TYjZ5b1lvOXY2MGhFZGsyZyIsInN1YiI6IlB6S25TYjZ5b1lvOXY2MGhFZGsyZyIsImlhdCI6MTcyNTk0NjM1NCwiZXhwIjoxNzI1OTQ5OTU0LCJlbWFpbCI6ImNoX2FwcF9tZcXtZ2g0eGdZNm8iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsibWF5b21ib3RlZCI6InNjaGFsbGFyaW5nZWFkIn19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifQ.c4f9Yg-4yHgJepgMCz7iUbscFh7T4Kp9n4eX3KJfxTxP5JjA5bV2ItLktGzZkSK8CDrM4wFkIQ0XnDbWMCmj6FwzzQNRmH_pwpw4lTLd7q5bdmMwlMxKmZXf6tYkI6yx0T8n6uDzsmHJ9h1KPwmV5DrLB0HJd_NM_Ze21E2hKpKztKxT7m6rfoBtrKp7dpsZZ0X6cDwtJxAq0Fv5G56k19q9ZwhPl4zRA4HKNCZ0l4P_FI5jT14zbYYplV_z1rGPIfOpdRyzrKDB3cnz2Vz5wFOcfw9gSzMofD9d9ZhRs3w7MHK4ePlGGGduSo3YowU9PYP7LQFkOL_Ro7JzFz6kHeQh2kbyfJp_vzPvmxirzNSIM6nJivK3Y2Dp0w",
            expirationTime: 1725949955077
        },
        createdAt: "1725786790895",
        lastLoginAt: "1725946354955",
        apiKey: "AIzaSyCdR7rt7_Z0khHVLLeZA7mc_AtR2Ht2_pI",
        appName: "[DEFAULT]",
        tokenExpiration: new Date(1725949955077).toISOString()
    },
    {
        uid: "O3PlSdCr5aGzRbV2H6K7Z8jAqVe1",
        displayName:null,
        photoURL:null,
        email: "carmen.sama@example.com",
        emailVerified: false,
        isAnonymous: false,
        providerData: [
            {
                providerId: "password",
                uid: "carmen.sama@example.com",
                displayName: null,
                email: "carmen.sama@example.com",
                phoneNumber: null,
                photoURL: null
            }
        ],
        stsTokenManager: {
            refreshToken: "C4H9yHkq0H3K5NkN8L8q9vHb0U7Eo4T5aT8UoJ6t0nP5I2EgO5LaqH4GBH2A7R5F1Z1c5mPmZ9tS5Hb1LqwX6c4RHt1K0WJNc1EOJf_mLRzQto2X92m9P_YKQ8ZMO3H8coTijP9tDehe5MjRmZZ_UHDdpuH86cM7R8Ep8VrZKmRHQ",
            accessToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNjNWU0MTg0M2M1ZDUyZTY4ZWY1M2UyYmVjOTgxNDNkYTE0NDkwNWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYmFyLW1hbi1wcm8iLCJhdWQiOiJiYXItbWFuLXBybyIsImF1dGhfdGltZSI6MTcyNTk0NjM1NCwidXNlcl9pZCI6Ik8zUGxTZENyNWFGelI4QWxqTG5TQU4iLCJzdWIiOiJPT3BsU2ROeVYjR0FqVGVwdjJWczdSQSIsImlhdCI6MTcyNTk0NjM1NCwiZXhwIjoxNzI1OTQ5OTU0LCJlbWFpbCI6ImNhcm1lbl9zYW1hQGV4YW1wbGUuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImNhcm1lbl9zYW1hQGV4YW1wbGUuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifQ.PPz1_hjkmCqzGk2ahgHeT_3yY1qZCDOBNh0d0tfd7W9Zp9qaG8lZz_9g3LqHDpYYA1e1UV8kPZepu_ksS6AcKm7VRmyWZrZXbXORn8t3R0w9H6SDoqZRtZr3fXz4H_Mm70u6UwYBGUzpWo1D6T-VrJrG8-L9HVySwCl32lb97jIMaRSg5B8H-CFs6m9wjlDGEpNL3L-3qRMy7SzmB7v34X_U0zrSOaRAB_rK4uZYha6t-eo8pWfJzDrfsKz1s4Tkw16P0hu5g_fqxfHWxEZJ9Ut2U_GzZlyiq8DE7q8k8tuWPSdm1w11GE3RC0nUG_yBkEDpT4j6TmjkvG_Vm7tGgWg0Qxk",
            expirationTime: 1725949955077
        },
        createdAt: "1725786790895",
        lastLoginAt: "1725946354955",
        apiKey: "AIzaSyCdR7rt7_Z0khHVLLeZA7mc_AtR2Ht2_pI",
        appName: "[DEFAULT]",
        tokenExpiration: new Date(1725949955077).toISOString()
    }
],
SyncMap : [
    {
        tableName: null,  // Table name or entity name used in both IndexedDB and Firestore
        indexedDBId: null, // Local IndexedDB ID
        firestoreId: null, // Corresponding Firestore document ID
    }
]


}