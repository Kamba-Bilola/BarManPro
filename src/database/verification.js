import { getAllObjectStoreDataExec } from "./indexedDB";

  
  
 // Helper function to validate required fields
function validateRequiredFields(schema, storeName, data) {
  const tableSchema = schema[storeName];
  const requiredFields = tableSchema.indexes.filter(index => index.required).map(index => ({
    name: index.name,
    label: index.label
  }));

  const missingFields = [];

  for (const field of requiredFields) {
    if (!data[field.name]) {
      missingFields.push(field.label || field.name);
    }
  }

  if (missingFields.length > 0) {
    const error = new Error(`Required fields are missing in ${storeName}`);
    error.labels = missingFields;
    throw error;
  }
}

// Helper function to check for unique fields
async function checkUniqueFields(schema, storeName, data) {
  const tableSchema = schema[storeName];
  const uniqueFields = tableSchema.indexes.filter(index => index.unique).map(index => ({
    name: index.name,
    label: index.label
  }));

  if (uniqueFields.length > 0) {
    const allRecords = await getAllObjectStoreDataExec(storeName);
    const duplicateFields = [];

    for (const field of uniqueFields) {
      const isDuplicate = allRecords.some(record => record[field.name] === data[field.name]);
      if (isDuplicate) {
        duplicateFields.push(field.label || field.name);
      }
    }

    if (duplicateFields.length > 0) {
      const error = new Error(`Duplicate entry found for unique fields in ${storeName}`);
      error.labels = duplicateFields;
      throw error;
    }
  }
}

// Helper function to check for unique combinations
async function checkUniqueCombination(schema, storeName, data) {
  const tableSchema = schema[storeName];
  const uniqueCombination = tableSchema.uniqueCombination;

  if (uniqueCombination) {
    const allRecords = await getAllObjectStoreDataExec(storeName);
    const duplicateCombinations = [];

    for (const combination of uniqueCombination) {
      const isDuplicate = allRecords.some(record => {
        return Object.keys(combination).every(index => {
          const field = combination[index];
          return record[field] === data[field];
        });
      });

      if (isDuplicate) {
        const combinationLabels = Object.values(combination).map(field => {
          const index = tableSchema.indexes.find(index => index.name === field);
          return index ? index.label || field : field;
        });
        duplicateCombinations.push(combinationLabels.join(', '));
      }
    }

    if (duplicateCombinations.length > 0) {
      const error = new Error(`Duplicate entry found for unique combinations in ${storeName}`);
      error.labels = duplicateCombinations;
      throw error;
    }
  }
}


  const schema = {
    sync_table: {
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'operation', unique: false, required: true, label: 'Opération' },
        { name: 'tableName', unique: false, required: true, label: 'Nom de la table' },
        { name: 'indexedDBId', unique: false, required: true, label: 'ID IndexedDB' },
        { name: 'firestoreId', unique: false, required: false, label: 'ID Firestore' },
        { name: 'timestamp', unique: false, required: true, label: 'Horodatage' },
        { name: 'status', unique: false, required: true, label: 'Statut' },
        { name: 'retryCount', unique: false, required: false, label: 'Nombre de tentatives' },
        { name: 'lastSyncAttempt', unique: false, required: false, label: 'Dernière tentative de synchronisation' }
      ]
    },
  
    GapReports: {
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'barId', unique: false, required: true, label: 'ID du bar' },
        { name: 'userId', unique: false, required: true, label: 'ID de l\'utilisateur' },
        { name: 'gapType', unique: false, required: true, label: 'Type d\'écart' },
        { name: 'detectedAt', unique: false, required: true, label: 'Détecté à' },
        { name: 'amount', unique: false, required: true, label: 'Montant' },
        { name: 'description', unique: false, required: false, label: 'Description' },
        { name: 'status', unique: false, required: true, label: 'Statut' },
        { name: 'validatedBy', unique: false, required: false, label: 'Validé par' },
        { name: 'validationDate', unique: false, required: false, label: 'Date de validation' },
        { name: 'notes', unique: false, required: false, label: 'Notes' }
      ]
    },
  
    StoreChecks: {
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'barId', unique: false, required: true, label: 'ID du bar' },
        { name: 'userId', unique: false, required: true, label: 'ID de l\'utilisateur' },
        { name: 'checkType', unique: false, required: true, label: 'Type de vérification' },
        { name: 'checkTime', unique: false, required: true, label: 'Heure de vérification' },
        { name: 'stockLevels', unique: false, required: false, label: 'Niveaux de stock' },
        { name: 'notes', unique: false, required: false, label: 'Notes' }
      ]
    },
  
    Documents: {
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'userId', unique: false, required: true, label: 'ID de l\'utilisateur' },
        { name: 'fileName', unique: false, required: true, label: 'Nom du fichier' },
        { name: 'filePath', unique: false, required: true, label: 'Chemin du fichier' },
        { name: 'fileType', unique: false, required: true, label: 'Type de fichier' },
        { name: 'reportType', unique: false, required: false, label: 'Type de rapport' },
        { name: 'barId', unique: false, required: true, label: 'ID du bar' },
        { name: 'createdAt', unique: false, required: true, label: 'Créé à' },
        { name: 'shared', unique: false, required: false, label: 'Partagé' },
        { name: 'sharedWith', unique: false, required: false, label: 'Partagé avec' }
      ]
    },
  
    Sessions: {
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'barId', unique: false, required: false, label: 'ID du bar' },
        { name: 'userId', unique: false, required: true, label: 'ID de l\'utilisateur' },
        { name: 'sessionStart', unique: false, required: false, label: 'Début de session' },
        { name: 'sessionEnd', unique: false, required: false, label: 'Fin de session' },
        { name: 'saleStart', unique: false, required: false, label: 'Début des ventes' },
        { name: 'saleEnd', unique: false, required: false, label: 'Fin des ventes' },
        { name: 'totalSales', unique: false, required: false, label: 'Ventes totales' },
        { name: 'itemsSold', unique: false, required: false, label: 'Articles vendus' },
        { name: 'status', unique: false, required: true, label: 'Statut' },
        { name: 'dailySalesReportId', unique: false, required: false, label: 'ID du rapport de ventes quotidien' },
        { name: 'sessionReportId', unique: false, required: false, label: 'ID du rapport de session' },
        { name: 'itemSalesReportId', unique: false, required: false, label: 'ID du rapport de ventes d\'articles' },
        { name: 'stockReportId', unique: false, required: false, label: 'ID du rapport de stock' }
      ]
    },
  
    Bars: {
      keyPath: 'id',
      autoIncrement: false,
      indexes: [
        { name: 'name', unique: false, required: true, label: 'Nom' },
        { name: 'location', unique: false, required: true, label: 'Localisation' },
        { name: 'ownerUid', unique: false, required: true, label: 'UID du propriétaire' },
        { name: 'uid', unique: false, required: true, label: 'UID du Bar' },
        { name: 'status', unique: false, required: true, label: 'Statut' },
        { name: 'subscriptionExpiration', unique: false, required: false, label: 'Expiration de l\'abonnement' },
        { name: 'lastPaymentCode', unique: false, required: false, label: 'Dernier code de paiement' },
        { name: 'lastPaymentMethod', unique: false, required: false, label: 'Dernier mode de paiement' },
        { name: 'numberOfTables', unique: false, required: true, label: 'Nombre de tables' },
        { name: 'totalSales', unique: false, required: false, label: 'Ventes totales' },
        { name: 'totalGap', unique: false, required: false, label: 'Écart total' },
        { name: 'subscriptionLevel', unique: false, required: true, label: 'Niveau d\'abonnement' }
      ],
      uniqueCombination: [{ 0: 'name', 1: 'location' }]
    },
  
    Users: {
      keyPath: 'uid',
      autoIncrement: false,
      indexes: [
        { name: 'displayName', unique: false, required: true, label: 'Nom d\'affichage' },
        { name: 'photoURL', unique: false, required: false, label: 'URL de la photo' },
        { name: 'email', unique: true, required: true, label: 'Email' },
        { name: 'createdAt', unique: false, required: true, label: 'Créé à' },
        { name: 'lastLoginAt', unique: false, required: false, label: 'Dernière connexion à' },
        { name: 'barControled', unique: false, required: false, label: 'Bar contrôlé' },
        { name: 'fullName', unique: false, required: false, label: 'Nom complet' },
        { name: 'phone', unique: false, required: false, label: 'Téléphone' },
        { name: 'password', unique: false, required: false, label: 'Mot de passe' },
        { name: 'role', unique: false, required: false, label: 'Rôle' },
        { name: 'Subscription', unique: false, required: false, label: 'Abonnement' }
      ]
    },
  
    Stock: {
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'name', unique: false, required: true, label: 'Nom' },
        { name: 'sizes', unique: false, required: false, label: 'Tailles' },
        { name: 'barId', unique: false, required: true, label: 'ID du bar' }
      ],
      uniqueCombination: [{ 0: 'name', 1: 'sizes' }]
    },
  
    SalesReports: {
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'barId', unique: false, required: true, label: 'ID du bar' },
        { name: 'items', unique: false, required: true, label: 'Articles' },
        { name: 'soldAt', unique: false, required: true, label: 'Vendu à' },
        { name: 'userId', unique: false, required: true, label: 'ID de l\'utilisateur' },
        { name: 'total', unique: false, required: true, label: 'Total' },
        { name: 'sessionId', unique: false, required: false, label: 'ID de la session' },
        { name: 'stockId', unique: false, required: false, label: 'ID du stock' }
      ]
    },    
    ItemSalesReport: {
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
      { name: 'name', unique: false, required: true, label: 'Nom' },
      { name: 'quantitySold', unique: false, required: true, label: 'Quantité vendue' },
      { name: 'totalSales', unique: false, required: true, label: 'Ventes totales' },
      { name: 'barId', unique: false, required: true, label: 'ID du bar' }
      ]
    },
    
    BarUserPermissions: { 
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
      { name: 'barId', unique: false, required: true, label: 'Bar ID' },
      { name: 'userId', unique: false, required: true, label: 'ID de l\'utilisateur' },
      { name: 'canUpdateSales', unique: false, required: false, label: 'Peut mettre à jour les ventes' },
      { name: 'canUpdateStock', unique: false, required: false, label: 'Peut mettre à jour le stock' },
      { name: 'grantedBy', unique: false, required: true, label: 'Accordé par' },
      { name: 'grantedAt', unique: false, required: true, label: 'Accordé à' },
      { name: 'Status', unique: false, required: false, label: 'Status' }
      ],
      uniqueCombination: [{ 0: 'barId', 1: 'userId' }]
    }
  };
  

// Main checkBeforeCRUD function
export async function checkBeforeCRUD(storeName, data) {
  try {
    // Validate required fields
    validateRequiredFields(schema, storeName, data);

    // Check unique fields
    await checkUniqueFields(schema, storeName, data);

    // Check unique combinations
    await checkUniqueCombination(schema, storeName, data);

    console.log("All validations passed for CRUD operation on " + storeName);
    // Return true when all validations pass
    return { success: true, message: "All validations passed" };

  } catch (error) {
    // Return false and the error message when validation fails
  
    return { success: false, message: error.message, labels: error.labels || [] };
  }
}

export async function checkBeforeCRUDExec(objectStoreName, data) {
  const validationResult = await checkBeforeCRUD(objectStoreName, data);
  if (!validationResult.success) {
    // Validation failed, return or handle the error message and labels
    console.error("Validation failed: ", validationResult.message);

    // If labels exist, include them in the result
    const labels = validationResult.labels ? `Fields concerned: ${validationResult.labels.join(', ')}` : '';
    
    // Return both the validation message and labels
    const result = [false, validationResult.message, labels];
    return result;  // Early exit, do not proceed to add data
  } else {
    const result = [true, validationResult.message];
    return result; 

  }}
  