// Code.gs

// *** CONFIGURATION ***
const SHEET_ID = '1YmEQiZi04oOy1slBttXQ1paQB9ZS8kThj3ZjtyH4jDQ'; // *** PASTE YOUR GOOGLE SHEET ID HERE ***
const TEMPLATE_ID = ''; // *** PASTE YOUR GOOGLE DOC TEMPLATE ID HERE ***
const UPLOAD_FOLDER_ID = ''; // *** OPTIONAL: Folder ID to save images. If empty, saves to root ***

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);

    let action = '';
    let payload = {};

    if (e.parameter && e.parameter.action) {
        action = e.parameter.action;
    } else if (e.postData && e.postData.contents) {
        // Handle POST body
        const json = JSON.parse(e.postData.contents);
        action = json.action;
        payload = json;
    }

    const ss = SpreadsheetApp.openById(SHEET_ID);
    let result = {};

    } else if (action === 'getPermissions') {
       result = getPermissions(ss);
    } else if (action === 'savePermission') {
       result = savePermission(ss, payload);
    } else if (action === 'createReimbursementPdf') {
       result = createReimbursementPdf(ss, payload);
    } else {
       result = { status: 'error', message: 'Unknown action: ' + action };
    }

    output.setContent(JSON.stringify(result));
    return output;

  } catch (err) {
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify({ status: 'error', message: err.toString() }));
    return output;
  } finally {
    lock.releaseLock();
  }
}

function getPermissions(ss) {
  const ws = ss.getSheetByName('Permissions');
  if (!ws) return { status: 'error', message: 'Sheet "Permissions" not found' };

  const data = ws.getDataRange().getValues();
  const headers = data.shift();
  
  const permissions = data.map(row => {
    let obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i];
    });
    return obj;
  });

  return { status: 'success', data: permissions };
}

function savePermission(ss, data) {
  const ws = ss.getSheetByName('Permissions');
  if (!ws) return { status: 'error', message: 'Sheet "Permissions" not found. Run setup() first.' };

  const id = Utilities.getUuid();
  const timestamp = new Date();

  // Handle Image Uploads
  const mapOriginUrl = data.map_url_origin ? saveImageToDrive(data.map_url_origin, `map_origin_${id}`) : '';
  const mapDestUrl = data.map_url_destination ? saveImageToDrive(data.map_url_destination, `map_dest_${id}`) : '';

  // Data Array matching Header Order
  const row = [
    id,
    timestamp,
    data.ref_no || '',
    data.doc_date || '',
    data.subject || '',
    data.to_person || '',
    data.office || '',
    data.person_name || '',
    data.position || '',
    data.department || '',
    data.objective || '',
    data.destination || '',
    data.start_date || '',
    data.end_date || '',
    data.vehicle_type || '',
    data.license_plate || '',
    data.province || '',
    data.distance || '',
    data.budget_source || '',
    mapOriginUrl,
    mapDestUrl,
    'Pending'
  ];
  
  ws.appendRow(row);
  return { status: 'success', id: id };
}

function saveImageToDrive(base64String, filename) {
  try {
    const contentType = base64String.split(';')[0].split(':')[1];
    const base64Data = base64String.split(',')[1];
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), contentType, filename);
    
    let folder;
    if (UPLOAD_FOLDER_ID) {
      folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
    } else {
      folder = DriveApp.getRootFolder();
    }
    
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getDownloadUrl();
  } catch (e) {
    Logger.log('Error saving image: ' + e.toString());
    return 'Error: ' + e.toString();
  }
}

// function saveImageToDrive... (existing)

function createReimbursementPdf(ss, data) {
  if (!TEMPLATE_ID) {
    return { status: 'error', message: 'TEMPLATE_ID is missing in Code.gs' };
  }

  try {
    const templateFile = DriveApp.getFileById(TEMPLATE_ID);
    const newFile = templateFile.makeCopy('Reimbursement_' + (data.person_name || 'Draft') + '_' + new Date().toISOString());
    const doc = DocumentApp.openById(newFile.getId());
    const body = doc.getBody();

    // Replace placeholders
    const replacements = {
      '{{doc_date}}': data.doc_date || '',
      '{{subject}}': data.subject || '',
      '{{to_person}}': data.to_person || '',
      '{{person_name}}': data.person_name || '',
      '{{position}}': data.position || '',
      '{{department}}': data.department || '',
      '{{destination}}': data.destination || '',
      '{{start_date}}': data.start_date || '',
      '{{end_date}}': data.end_date || '',
      '{{vehicle_type}}': data.vehicle_type || '',
      '{{license_plate}}': data.license_plate || '',
      '{{distance}}': data.distance || '',
      '{{allowance_days}}': data.allowance_days || '',
      '{{allowance_rate}}': data.allowance_rate || '',
      '{{allowance_total}}': data.allowance_total || '',
      '{{transport_cost}}': data.transport_cost || '',
      '{{accommodation_cost}}': data.accommodation_cost || '',
      '{{total_amount_num}}': data.total_amount_num || '',
      '{{total_amount_text}}': data.total_amount_text || '',
    };

    for (const [key, value] of Object.entries(replacements)) {
      body.replaceText(key, String(value));
    }

    doc.saveAndClose();

    // Convert to PDF
    const pdfBlob = newFile.getAs(MimeType.PDF);
    const pdfFile = DriveApp.getRootFolder().createFile(pdfBlob);
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Cleanup temp doc (optional, maybe keep for manual edit)
    // newFile.setTrashed(true);

    return { status: 'success', url: pdfFile.getDownloadUrl() };

  } catch (e) {
    return { status: 'error', message: e.toString() };
  }
}

// *** RUN THIS FUNCTION ONCE TO SETUP SHEETS ***
function setup() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // 1. Permissions Sheet
  let pSheet = ss.getSheetByName('Permissions');
  if (!pSheet) {
    pSheet = ss.insertSheet('Permissions');
    pSheet.appendRow([
      'id', 'timestamp', 'ref_no', 'doc_date', 'subject', 'to_person', 'office',
      'person_name', 'position', 'department', 'objective', 'destination', 
      'start_date', 'end_date', 'vehicle_type', 'license_plate', 'province', 'distance',
      'budget_source', 'map_url_origin', 'map_url_destination', 'status'
    ]);
  }

  // 2. Reimbursements Sheet
  let rSheet = ss.getSheetByName('Reimbursements');
  if (!rSheet) {
    rSheet = ss.insertSheet('Reimbursements');
    rSheet.appendRow([
      'id', 'permission_id', 'allowance_days', 'allowance_rate', 'allowance_total',
      'transport_cost', 'accommodation_cost', 'total_amount_num', 'total_amount_text', 'status'
    ]);
  }
  
  Logger.log('Setup Complete');
}
