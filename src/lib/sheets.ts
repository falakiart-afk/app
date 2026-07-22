// Google Sheets and Drive API client utilities

// Fetch list of spreadsheets from Google Drive
export async function fetchSpreadsheets(accessToken: string) {
  const q = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=50`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  if (!res.ok) {
    throw new Error(`Failed to list spreadsheets: ${await res.text()}`);
  }
  
  const data = await res.json();
  return data.files || [];
}

// Create a new spreadsheet in Google Drive
export async function createSpreadsheet(accessToken: string, title: string) {
  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: title,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create spreadsheet: ${await res.text()}`);
  }

  const data = await res.json();
  return data; // contains spreadsheetId and spreadsheetUrl
}

// Sync WooCommerce orders to a spreadsheet (clear and complete rewrite for clean state)
export async function syncOrdersToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  orders: any[]
) {
  // First, let's find out the sheet name. By default, it's usually "Sheet1" or "Feuille 1" or similar.
  // We can fetch spreadsheet details to find the exact title of the first sheet.
  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  let sheetName = 'Sheet1';
  if (metaRes.ok) {
    const metaData = await metaRes.json();
    if (metaData.sheets && metaData.sheets.length > 0) {
      sheetName = metaData.sheets[0].properties.title;
    }
  }

  // 1. Clear existing sheet contents to ensure a clean sync
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A1:Z5000:clear`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  // 2. Prepare headers and rows
  const headers = [
    'Order ID',
    'Date Created',
    'Customer Name',
    'Phone',
    'City',
    'Address',
    'Products Ordered',
    'Total Price (DH)',
    'WooCommerce Status'
  ];

  const rows = orders.map((o: any) => {
    // Determine billing or shipping customer details
    const billing = o.billing || {};
    const shipping = o.shipping || {};
    const firstName = shipping.first_name || billing.first_name || '';
    const lastName = shipping.last_name || billing.last_name || '';
    const name = `${firstName} ${lastName}`.trim() || 'No Name';
    const phone = billing.phone || shipping.phone || '';
    const city = shipping.city || billing.city || '';
    const address = `${shipping.address_1 || ''} ${shipping.address_2 || ''} ${billing.address_1 || ''}`.trim() || 'No Address';
    
    // List line items
    const products = (o.line_items || []).map((item: any) => `${item.name} (x${item.quantity})`).join(', ');
    const total = o.total || '0';
    const status = o.status || 'pending';
    const dateCreated = o.date_created ? o.date_created.substring(0, 19).replace('T', ' ') : '';

    return [
      o.id.toString(),
      dateCreated,
      name,
      phone,
      city,
      address,
      products,
      total,
      status
    ];
  });

  const values = [headers, ...rows];

  // 3. Write new values
  const writeRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range: `${sheetName}!A1`,
      majorDimension: 'ROWS',
      values: values,
    }),
  });

  if (!writeRes.ok) {
    throw new Error(`Failed to write values to spreadsheet: ${await writeRes.text()}`);
  }

  return true;
}
