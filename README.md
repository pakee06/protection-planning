# Protection Planning App

## ขั้นตอนติดตั้งและ deploy

### 1. ตั้ง Google Apps Script
1. เปิด Google Sheets ใหม่
2. ไปที่ Extensions → Apps Script
3. วาง Code.gs ทั้งหมดลงไป
4. กด Deploy → New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
5. คัดลอก URL ที่ได้

### 2. แก้ไข URL ใน App
เปิดไฟล์ `src/App.jsx` และแก้บรรทัดที่ 3:
```
const APPS_SCRIPT_URL = "วาง URL ที่ได้จาก Apps Script ตรงนี้";
```

### 3. รันในเครื่อง
```bash
npm install
npm run dev
```

### 4. Deploy บน Vercel (แนะนำ — ฟรี)
```bash
npm install -g vercel
vercel
```
เสร็จแล้วจะได้ URL เช่น https://protection-planning-abc.vercel.app

### 5. Deploy บน Netlify (ทางเลือก)
```bash
npm run build
# ลาก folder `dist` ไปวางที่ netlify.com/drop
```

## โครงสร้างไฟล์
- `src/App.jsx` — React component หลัก
- `Code.gs` — Google Apps Script (วางใน Google Sheets)
- `index.html` — HTML entry point

## หมายเหตุ
- ใช้ `mode: "no-cors"` เพราะ Apps Script ไม่รองรับ CORS headers
- บันทึกข้อมูลสำเร็จแม้ browser จะไม่ได้รับ response กลับมา
- พิมพ์ PDF ใช้ window.print() built-in ของ browser
