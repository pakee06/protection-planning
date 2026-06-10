// วางโค้ดนี้ใน Google Apps Script (Extensions → Apps Script)
// แล้วกด Deploy → New deployment → Web app
// Execute as: Me | Who has access: Anyone

const SHEET_NAME = "ข้อมูลลูกค้า";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // สร้าง sheet และ header ถ้ายังไม่มี
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      const headers = [
        "วันที่บันทึก", "ชื่อ-นามสกุล", "อายุ", "อาชีพ", "สมาชิกครอบครัว",
        "รวมหนี้สิน (1)", "รวมค่าใช้จ่าย (2)", "รวมทุนการศึกษา (3)",
        "รวมทั้งหมด (4)", "เงินที่เตรียมไว้ (5)", "ทุนประกันที่มี (6)",
        "ทุนประกันที่ต้องเพิ่ม", "รายละเอียดหนี้", "รายละเอียดค่าใช้จ่าย",
        "รายละเอียดการศึกษา", "ความต้องการอื่นๆ"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight("bold")
        .setBackground("#1a3a7c")
        .setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    const data = JSON.parse(e.postData.contents);

    const row = [
      new Date().toLocaleString("th-TH"),
      data.name || "",
      data.age || "",
      data.job || "",
      data.family || "",
      data.total1 || 0,
      data.total2 || 0,
      data.total3 || 0,
      data.total4 || 0,
      data.existing || 0,
      data.insurance || 0,
      data.needMore || 0,
      data.debtsDetail || "",
      data.expensesDetail || "",
      data.educationDetail || "",
      data.otherNeeds || ""
    ];

    sheet.appendRow(row);

    // จัดรูปแบบคอลัมน์ตัวเลข (F ถึง L = คอลัมน์ 6-12)
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 6, 1, 7)
      .setNumberFormat("#,##0");

    // สีพื้นหลังสลับแถว
    if (lastRow % 2 === 0) {
      sheet.getRange(lastRow, 1, 1, 16).setBackground("#f8f9ff");
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "Protection Planning API is running" }))
    .setMimeType(ContentService.MimeType.JSON);
}
