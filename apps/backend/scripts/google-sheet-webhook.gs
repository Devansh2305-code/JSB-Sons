// Apps Script web app that upserts JSB Sons orders into a Google Sheet.
// Setup:
// 1. Create a Google Sheet (optionally a fresh tab named "Orders").
// 2. Extensions -> Apps Script, delete the sample code, paste this file.
// 3. Replace TOKEN below with a long random value; use the same value for
//    GOOGLE_SHEETS_TOKEN in the backend environment.
// 4. Deploy -> New deployment -> Web app.
//    Execute as: Me. Who has access: Anyone.
// 5. Copy the /exec URL into GOOGLE_SHEETS_WEBHOOK_URL in the backend environment.
// If the script is standalone (not bound to the sheet), add a Script Property
// SPREADSHEET_ID with the sheet's ID.

const TOKEN = "replace-with-a-long-random-value"
const SHEET_NAME = "Orders"
const HEADERS = [
  "Order #",
  "Order ID",
  "Placed",
  "Customer",
  "Mobile",
  "Email",
  "Items",
  "Qty",
  "Total (INR)",
  "Payment",
  "Status",
  "Address",
  "Updated",
]

function doGet() {
  return json({ ok: true })
}

function doPost(event) {
  var body
  try {
    body = JSON.parse(event.postData.contents)
  } catch (error) {
    return json({ ok: false, error: "Invalid JSON" })
  }

  if (!TOKEN || body.token !== TOKEN) {
    return json({ ok: false, error: "Unauthorized" })
  }

  if (!body.order_id) {
    return json({ ok: false, error: "Missing order_id" })
  }

  var lock = LockService.getScriptLock()
  lock.waitLock(30000)

  try {
    var book = spreadsheet()
    var sheet = book.getSheetByName(SHEET_NAME)

    if (!sheet) {
      sheet = book.insertSheet(SHEET_NAME)
    }

    ensureHeaders(sheet)

    var row = [
      body.display_id,
      body.order_id,
      formatDate(body.created_at),
      body.customer_name || "",
      body.mobile || "",
      body.email || "",
      body.items || "",
      Number(body.item_count || 0),
      Number(body.total || 0),
      body.payment_status || "",
      body.status || "",
      body.address || "",
      formatDate(body.updated_at || new Date().toISOString()),
    ]

    var lastRow = sheet.getLastRow()
    var targetRow = 0

    if (lastRow > 1) {
      var ids = sheet.getRange(2, 2, lastRow - 1, 1).getValues()

      for (var i = 0; i < ids.length; i++) {
        if (ids[i][0] === body.order_id) {
          targetRow = i + 2
          break
        }
      }
    }

    if (targetRow) {
      sheet.getRange(targetRow, 1, 1, row.length).setValues([row])
    } else {
      sheet.appendRow(row)
    }

    sheet
      .getRange(1, 9, Math.max(sheet.getMaxRows(), 2), 1)
      .setNumberFormat("#,##0.00")

    return json({ ok: true })
  } catch (error) {
    return json({ ok: false, error: String(error) })
  } finally {
    lock.releaseLock()
  }
}

function spreadsheet() {
  var id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID")

  return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet()
}

function ensureHeaders(sheet) {
  var range = sheet.getRange(1, 1, 1, HEADERS.length)
  var current = range.getValues()[0]
  var matches = HEADERS.every(function (header, index) {
    return current[index] === header
  })

  if (!matches) {
    range.setValues([HEADERS])
    range.setFontWeight("bold")
    sheet.setFrozenRows(1)
  }
}

function formatDate(value) {
  if (!value) {
    return ""
  }

  try {
    return Utilities.formatDate(
      new Date(value),
      "Asia/Kolkata",
      "dd MMM yyyy, HH:mm"
    )
  } catch (error) {
    return String(value)
  }
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  )
}
