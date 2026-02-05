# Google Sheets Integration Guide

## Overview
This guide explains how to push BLE Explorer data to your Google Sheets spreadsheet.

**Target Sheet**: https://docs.google.com/spreadsheets/d/1IT2gzD_IJwbd_-txg-yhZd9JnBalm9IsVNn7gBRhfpQ/edit?gid=0#gid=0

---

## Part 1: Set Up Your Google Sheet

### Step 1: Add Column Headers
Open your Google Sheet and add these headers in Row 1 (columns A-AZ, BA-BU):

```
A: Timestamp
B: Device_Type
C: Device_Name
D: Device_ID
E: Adapter_Type
F: Signal_Strength_RSSI
G: BLE_Manufacturer
H: BLE_Model
I: BLE_Firmware
J: BLE_Hardware
K: Battery_Level_Percent
L: Services_Count
M: Connection_Status
N: Charger_Device_Name
O: Charger_Device_ID
P: Charger_Firmware
Q: Charger_Hardware
R: Charger_Status
S: Charger_VIN_High_Error
T: Charger_VIN_Low_Error
U: Charger_Init_Error
V: Charger_Coil_Temp_Low_Error
W: Slot1_Status
X: Slot1_Battery_Voltage_mV
Y: Slot1_Battery_Current_mA
Z: Slot1_Battery_Temperature_C
AA: Slot1_Charge_Cycles
AB: Slot1_Production_Date
AC: Slot1_IC_Number
AD: Slot1_Fast_Charge
AE: Slot1_Normal_End
AF: Slot1_Raw_Buffer
AG: Slot2_Status
AH: Slot2_Battery_Voltage_mV
AI: Slot2_Battery_Current_mA
AJ: Slot2_Battery_Temperature_C
AK: Slot2_Charge_Cycles
AL: Slot2_Production_Date
AM: Slot2_IC_Number
AN: Slot2_Fast_Charge
AO: Slot2_Normal_End
AP: Slot2_Raw_Buffer
AQ: Health_Inspection_Status
AR: HA_Performance
AS: HA_Usage
AT: Wax_Guard_Status
AU: Dome_Earmold_Condition
AV: Microphone_Port_Clarity
AW: Physical_Comfort_Score
AX: Moisture_Exposure
AY: Primary_Sound_Environment
AZ: Daily_Wear_Time_Hours
BA: App_Sync_Stability
BB: Feedback_Whistling
BC: Custom_Program_Usage
```

**Quick Setup**: Copy the header row from `sample-data-export.csv` and paste it into Row 1 of your Google Sheet.

---

## Part 2: Create Google Apps Script Web App

### Step 1: Open Script Editor
1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code in `Code.gs`

### Step 2: Add This Code

```javascript
/**
 * BLE Explorer Data Receiver
 * POST endpoint to receive data from BLE Explorer app
 */
function doPost(e) {
  try {
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Log for debugging
    Logger.log('Received data: ' + JSON.stringify(data));
    
    // Prepare row data in correct column order
    const row = [
      data.Timestamp || new Date().toISOString(),
      data.Device_Type || 'Hearing_Aid',
      data.Device_Name || '---',
      data.Device_ID || '---',
      data.Adapter_Type || 'Internal',
      data.Signal_Strength_RSSI || '',
      data.BLE_Manufacturer || '---',
      data.BLE_Model || '---',
      data.BLE_Firmware || '---',
      data.BLE_Hardware || '---',
      data.Battery_Level_Percent || '',
      data.Services_Count || '',
      data.Connection_Status || 'Disconnected',
      data.Charger_Device_Name || '---',
      data.Charger_Device_ID || '---',
      data.Charger_Firmware || '---',
      data.Charger_Hardware || '---',
      data.Charger_Status || '---',
      data.Charger_VIN_High_Error || 0,
      data.Charger_VIN_Low_Error || 0,
      data.Charger_Init_Error || 0,
      data.Charger_Coil_Temp_Low_Error || 0,
      data.Slot1_Status || 'Empty',
      data.Slot1_Battery_Voltage_mV || 0,
      data.Slot1_Battery_Current_mA || 0,
      data.Slot1_Battery_Temperature_C || 0,
      data.Slot1_Charge_Cycles || 0,
      data.Slot1_Production_Date || '---',
      data.Slot1_IC_Number || '---',
      data.Slot1_Fast_Charge || 'No',
      data.Slot1_Normal_End || 'No',
      data.Slot1_Raw_Buffer || '---',
      data.Slot2_Status || 'Empty',
      data.Slot2_Battery_Voltage_mV || 0,
      data.Slot2_Battery_Current_mA || 0,
      data.Slot2_Battery_Temperature_C || 0,
      data.Slot2_Charge_Cycles || 0,
      data.Slot2_Production_Date || '---',
      data.Slot2_IC_Number || '---',
      data.Slot2_Fast_Charge || 'No',
      data.Slot2_Normal_End || 'No',
      data.Slot2_Raw_Buffer || '---',
      data.Health_Inspection_Status || '---',
      data.HA_Performance || '---',
      data.HA_Usage || '---',
      data.Wax_Guard_Status || '---',
      data.Dome_Earmold_Condition || '---',
      data.Microphone_Port_Clarity || '---',
      data.Physical_Comfort_Score || '',
      data.Moisture_Exposure || '---',
      data.Primary_Sound_Environment || '---',
      data.Daily_Wear_Time_Hours || '',
      data.App_Sync_Stability || '---',
      data.Feedback_Whistling || '---',
      data.Custom_Program_Usage || '---'
    ];
    
    // Append the row to the sheet
    sheet.appendRow(row);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Data added successfully',
        row: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function to verify setup
 */
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        Timestamp: new Date().toISOString(),
        Device_Type: 'Hearing_Aid',
        Device_Name: 'Test Device',
        Device_ID: 'TEST123',
        BLE_Manufacturer: 'Widex',
        Battery_Level_Percent: 85
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
```

### Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click gear icon ⚙️ → Select **Web app**
3. Configure:
   - **Description**: BLE Explorer Data Receiver
   - **Execute as**: Me (your@email.com)
   - **Who has access**: Anyone (or "Anyone with Google account" for security)
4. Click **Deploy**
5. **Authorize access** when prompted
6. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycby...XXXXX.../exec
   ```

---

## Part 3: Update BLE Explorer App

### Add Google Sheets Export Functionality

Create a new file: `src/export/googlesheets.js`

```javascript
/**
 * Export data to Google Sheets
 * @param {string} webAppUrl - The Google Apps Script web app URL
 * @param {object} data - Data object to export
 * @returns {Promise<object>} Response from Google Sheets
 */
export async function exportToGoogleSheets(webAppUrl, data) {
  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    // Note: no-cors mode doesn't allow reading response
    // Assume success if no error thrown
    console.log('Data sent to Google Sheets');
    return { success: true };
    
  } catch (error) {
    console.error('Failed to export to Google Sheets:', error);
    throw error;
  }
}

/**
 * Collect all current UI data into export object
 * @returns {object} Complete data snapshot
 */
export function collectExportData() {
  const data = {
    Timestamp: new Date().toISOString(),
    Device_Type: 'Hearing_Aid',
    
    // BLE Device Data
    Device_Name: document.getElementById('gattDeviceName')?.textContent || '---',
    Device_ID: document.getElementById('gattDeviceId')?.textContent || '---',
    Adapter_Type: document.getElementById('gattDeviceAdapter')?.textContent || 'Internal',
    Signal_Strength_RSSI: document.getElementById('gattSignal')?.textContent?.replace(/[^-\d]/g, '') || '',
    BLE_Manufacturer: document.getElementById('gattManufacturer')?.textContent || '---',
    BLE_Model: document.getElementById('gattModel')?.textContent || '---',
    BLE_Firmware: document.getElementById('gattFirmware')?.textContent || '---',
    BLE_Hardware: document.getElementById('gattHardware')?.textContent || '---',
    Battery_Level_Percent: document.getElementById('gattBattery')?.textContent?.replace(/[^\d]/g, '') || '',
    Services_Count: document.getElementById('gattServicesList')?.textContent || '',
    Connection_Status: document.getElementById('gattConnectionStatus')?.textContent || 'Disconnected',
    
    // Charger Data
    Charger_Device_Name: document.getElementById('chargerDeviceName')?.textContent || '---',
    Charger_Device_ID: document.getElementById('chargerDeviceId')?.textContent?.replace('ID: ', '') || '---',
    Charger_Firmware: document.getElementById('chargerFirmware')?.textContent || '---',
    Charger_Hardware: document.getElementById('chargerHardware')?.textContent || '---',
    Charger_Status: document.getElementById('chargerStatus')?.textContent || '---',
    Charger_VIN_High_Error: parseInt(document.getElementById('chargerVinHighError')?.textContent || '0'),
    Charger_VIN_Low_Error: parseInt(document.getElementById('chargerVinLowError')?.textContent || '0'),
    Charger_Init_Error: parseInt(document.getElementById('chargerInitError')?.textContent || '0'),
    Charger_Coil_Temp_Low_Error: parseInt(document.getElementById('chargerCoilTempLowError')?.textContent || '0'),
    
    // Slot 1
    Slot1_Status: document.getElementById('chargerSlot1StatusBadge')?.textContent || 'Empty',
    Slot1_Battery_Voltage_mV: parseFloat(document.getElementById('chargerSlot1Voltage')?.textContent?.replace(/[^\d.]/g, '') || '0'),
    Slot1_Battery_Current_mA: parseFloat(document.getElementById('chargerSlot1Current')?.textContent?.replace(/[^\d.]/g, '') || '0'),
    Slot1_Battery_Temperature_C: parseFloat(document.getElementById('chargerSlot1Temp')?.textContent?.replace(/[^\d.]/g, '') || '0'),
    Slot1_Charge_Cycles: parseInt(document.getElementById('chargerSlot1Cycles')?.textContent || '0'),
    Slot1_Production_Date: document.getElementById('chargerSlot1ProdDate')?.textContent || '---',
    Slot1_IC_Number: document.getElementById('chargerSlot1IcNo')?.textContent || '---',
    Slot1_Fast_Charge: document.getElementById('chargerSlot1FastCharge')?.textContent || 'No',
    Slot1_Normal_End: document.getElementById('chargerSlot1NormalEnd')?.textContent || 'No',
    Slot1_Raw_Buffer: document.getElementById('chargerSlot1RawBuffer')?.textContent || '---',
    
    // Slot 2
    Slot2_Status: document.getElementById('chargerSlot2StatusBadge')?.textContent || 'Empty',
    Slot2_Battery_Voltage_mV: parseFloat(document.getElementById('chargerSlot2Voltage')?.textContent?.replace(/[^\d.]/g, '') || '0'),
    Slot2_Battery_Current_mA: parseFloat(document.getElementById('chargerSlot2Current')?.textContent?.replace(/[^\d.]/g, '') || '0'),
    Slot2_Battery_Temperature_C: parseFloat(document.getElementById('chargerSlot2Temp')?.textContent?.replace(/[^\d.]/g, '') || '0'),
    Slot2_Charge_Cycles: parseInt(document.getElementById('chargerSlot2Cycles')?.textContent || '0'),
    Slot2_Production_Date: document.getElementById('chargerSlot2ProdDate')?.textContent || '---',
    Slot2_IC_Number: document.getElementById('chargerSlot2IcNo')?.textContent || '---',
    Slot2_Fast_Charge: document.getElementById('chargerSlot2FastCharge')?.textContent || 'No',
    Slot2_Normal_End: document.getElementById('chargerSlot2NormalEnd')?.textContent || 'No',
    Slot2_Raw_Buffer: document.getElementById('chargerSlot2RawBuffer')?.textContent || '---',
    
    // Health Inspection (placeholder - you can expand this)
    Health_Inspection_Status: document.getElementById('healthInspectionStatus')?.textContent || '---',
    HA_Performance: '---',
    HA_Usage: '---',
    Wax_Guard_Status: '---',
    Dome_Earmold_Condition: '---',
    Microphone_Port_Clarity: '---',
    Physical_Comfort_Score: '',
    Moisture_Exposure: '---',
    Primary_Sound_Environment: '---',
    Daily_Wear_Time_Hours: '',
    App_Sync_Stability: '---',
    Feedback_Whistling: '---',
    Custom_Program_Usage: '---'
  };
  
  return data;
}
```

### Update index.html

Add a button to export data to Google Sheets in the config section (around line 403):

```html
<div class="config-section">
  <label for="googleSheetsUrl">Google Sheets Web App URL:</label>
  <input 
    type="url" 
    id="googleSheetsUrl" 
    placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec" 
    value=""
  />
  <button id="exportToSheetsBtn" class="btn-primary" style="margin-top: 10px;">
    <span class="btn-icon">📊</span>
    Export to Google Sheets
  </button>
</div>
```

### Update main.js

Add the export handler:

```javascript
import { exportToGoogleSheets, collectExportData } from './export/googlesheets.js';

// In initializeApp() function, add this button handler:
const exportToSheetsBtn = document.getElementById('exportToSheetsBtn');
if (exportToSheetsBtn) {
  exportToSheetsBtn.addEventListener('click', async () => {
    const urlInput = document.getElementById('googleSheetsUrl');
    const webAppUrl = urlInput?.value;
    
    if (!webAppUrl) {
      addInspectionLog('❌ Please enter Google Sheets Web App URL', 'error');
      return;
    }
    
    try {
      addInspectionLog('📊 Collecting data for export...', 'info');
      const data = collectExportData();
      
      addInspectionLog('📤 Sending data to Google Sheets...', 'info');
      await exportToGoogleSheets(webAppUrl, data);
      
      addInspectionLog('✅ Data exported successfully to Google Sheets', 'success');
    } catch (error) {
      addInspectionLog(`❌ Export failed: ${error.message}`, 'error');
    }
  });
}
```

---

## Part 4: Testing & Usage

### Step 1: Test the Script
1. In Apps Script editor, run `testDoPost()` function
2. Check execution log (View → Logs)
3. Verify a test row appears in your spreadsheet

### Step 2: Get Your Web App URL
After deployment, your URL format is:
```
https://script.google.com/macros/s/AKfycby...YOUR_SCRIPT_ID.../exec
```

### Step 3: Configure BLE Explorer
1. Open BLE Explorer in browser
2. Paste your Web App URL into the "Google Sheets Web App URL" field
3. Click "Export to Google Sheets" button

### Step 4: Verify Data
1. Check your Google Sheet
2. New row should appear with current UI data

---

## Security Considerations

### Option 1: Public Access (Easier)
- Deploy as "Anyone" can access
- ⚠️ Anyone with the URL can write to your sheet
- Consider using a separate "staging" sheet

### Option 2: Authenticated Access (Secure)
- Deploy as "Anyone with Google account"
- Requires OAuth authentication
- More complex implementation needed

### Option 3: API Key Protection
Add to Apps Script:

```javascript
function doPost(e) {
  const apiKey = 'YOUR_SECRET_KEY_HERE';
  const providedKey = e.parameter.apiKey;
  
  if (providedKey !== apiKey) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: 'Invalid API key' })
    );
  }
  
  // ... rest of code
}
```

---

## Troubleshooting

### Common Issues

1. **CORS Error**
   - Google Apps Script requires `mode: 'no-cors'`
   - You won't see response data, but request will succeed

2. **Authorization Required**
   - First deployment needs manual authorization
   - Click "Authorize access" and allow permissions

3. **Data Not Appearing**
   - Check Apps Script execution log (View → Executions)
   - Verify column headers match exactly
   - Test with `testDoPost()` function

4. **Spreadsheet URL Not Working**
   - Must use the **Web App deployment URL**, not the spreadsheet URL
   - Format: `https://script.google.com/macros/s/.../exec`

---

## Advanced Features

### Auto-Export on Data Change
Add this to main.js to export automatically when charger data updates:

```javascript
// Auto-export after charger refresh
if (window._chargerController) {
  const originalOnStatus = window._chargerController.onStatus;
  window._chargerController.onStatus = (status) => {
    originalOnStatus(status);
    
    // Auto-export if configured
    const autoExport = localStorage.getItem('autoExportToSheets');
    if (autoExport === 'true') {
      setTimeout(() => {
        document.getElementById('exportToSheetsBtn')?.click();
      }, 1000);
    }
  };
}
```

### Data Validation in Sheet
Add data validation formulas in Google Sheets:
- Column K (Battery %): `=AND(K2>=0, K2<=100)`
- Column F (RSSI): `=AND(F2>=-100, F2<=0)`

---

## Summary

✅ **Setup Checklist**:
1. ☐ Add headers to Google Sheet (Row 1)
2. ☐ Create Apps Script with doPost function
3. ☐ Deploy as Web App
4. ☐ Copy deployment URL
5. ☐ Create `src/export/googlesheets.js`
6. ☐ Update `index.html` with input field & button
7. ☐ Update `main.js` with export handler
8. ☐ Test with sample data
9. ☐ Configure auto-export (optional)

**Your Web App URL will be**:
```
https://script.google.com/macros/s/[YOUR_SCRIPT_ID]/exec
```

Paste this into the BLE Explorer UI and click "Export to Google Sheets" to send data!
