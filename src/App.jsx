import { useState, useCallback } from "react";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwMEjlGwIrAddMgAZIE8HUtMsDmFMbqrq2UNlIM7r9avylbQxco3jsArWOND76zwAQ3Yw/exec";

const fmt = (n) => Math.round(n || 0).toLocaleString("th-TH");
const num = (v) => parseFloat(v) || 0;

const OTHER_NEEDS = [
  "Health Care Planning การวางแผนกองทุนดูแลสุขภาพ",
  "Tax Planning การวางแผนลดหย่อนภาษี",
  "Income Protection การวางแผนกองทุนคุ้มครองรายได้",
  "Serious Illness Planning การวางแผนกองทุนโรคร้ายแรง",
  "Retirement Planning การวางแผนกองทุนเกษียณ",
  "Accident Planning การวางแผนประกันอุบัติเหตุ",
  "Education Planning การวางแผนกองทุนการศึกษาบุตร",
  "Investment Planning การวางแผนลงทุน",
];

const S = {
  wrap: { maxWidth: 760, margin: "0 auto", padding: "0 16px 40px", fontFamily: "system-ui,sans-serif", fontSize: 14 },
  header: { background: "#1a3a7c", color: "#fff", textAlign: "center", padding: "14px 0", fontSize: 18, fontWeight: 600, letterSpacing: 2, marginBottom: 20 },
  card: { background: "#fff", border: "1px solid #e2e4e8", borderRadius: 12, marginBottom: 16, overflow: "hidden" },
  secHead: (bg) => ({ background: bg, color: "#fff", padding: "10px 16px", fontSize: 14, fontWeight: 500 }),
  gridHead: { display: "grid", padding: "7px 16px", background: "#f7f8fa", borderBottom: "1px solid #eee", fontSize: 12, color: "#888", fontWeight: 500 },
  row: { display: "grid", alignItems: "center", gap: 8, padding: "6px 16px", borderBottom: "1px solid #f3f3f3" },
  inp: { width: "100%", padding: "6px 10px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, textAlign: "right", outline: "none", boxSizing: "border-box" },
  inpL: { width: "100%", padding: "6px 10px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, textAlign: "left", outline: "none", boxSizing: "border-box" },
  calcVal: { fontSize: 13, fontWeight: 500, color: "#1a3a7c", textAlign: "right", padding: "6px 10px", background: "#f7f8fa", borderRadius: 8, border: "1px solid #eee" },
  delBtn: { width: 28, height: 28, border: "1px solid #ddd", borderRadius: 6, background: "#f7f8fa", color: "#aaa", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" },
  addBtn: { width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", fontSize: 13, color: "#1a3a7c", background: "#f0f4ff", border: "none", borderTop: "1px dashed #c5d0e8", cursor: "pointer", textAlign: "left" },
  totalRow: { display: "grid", gridTemplateColumns: "1fr 160px", alignItems: "center", padding: "10px 16px", background: "#f7f8fa" },
  totalLabel: { fontSize: 13, fontWeight: 500, textAlign: "right", color: "#333", paddingRight: 8 },
  totalVal: { fontSize: 14, fontWeight: 600, color: "#1a3a7c", textAlign: "right", padding: "6px 10px", background: "#fff", borderRadius: 8, border: "1px solid #ddd" },
  personalGrid: { display: "grid", gridTemplateColumns: "1fr 90px 1fr 100px", gap: 10, padding: "12px 16px", borderBottom: "1px solid #eee" },
  plabel: { fontSize: 11, color: "#999", marginBottom: 3 },
  sumRow: { display: "grid", gridTemplateColumns: "1fr 180px", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #f3f3f3", gap: 8 },
  sumLabel: { fontSize: 13, color: "#333" },
  sumVal: { fontSize: 14, fontWeight: 500, textAlign: "right", padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", background: "#f7f8fa", color: "#1a3a7c" },
  needRow: { display: "grid", gridTemplateColumns: "1fr 180px", alignItems: "center", padding: "12px 16px", background: "#1a6a2a" },
  needLabel: { fontSize: 14, fontWeight: 500, color: "#fff" },
  needVal: { fontSize: 16, fontWeight: 700, color: "#fff", textAlign: "right", padding: "6px 10px", background: "rgba(255,255,255,0.15)", borderRadius: 8 },
  actionBar: { display: "flex", gap: 10, justifyContent: "flex-end", marginBottom: 16 },
  btnPrint: { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1px solid #ddd", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13, color: "#555" },
  btnSave: (s) => ({ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#fff", background: s === "saved" ? "#1a6a2a" : s === "error" ? "#c0392b" : "#1a3a7c" }),
  needsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 16 },
  needItem: { display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#444" },
  dot: { width: 20, height: 20, borderRadius: "50%", background: "#1a3a7c", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 },
};

function useRows(defaults) {
  const [rows, setRows] = useState(defaults);
  const addRow = useCallback((tpl) => setRows((p) => [...p, { ...tpl, id: Date.now() }]), []);
  const delRow = useCallback((id) => setRows((p) => p.filter((r) => r.id !== id)), []);
  const upd = useCallback((id, f, v) => setRows((p) => p.map((r) => r.id === id ? { ...r, [f]: v } : r)), []);
  return [rows, addRow, delRow, upd];
}

export default function App() {
  const [p, setP] = useState({ name: "", age: "", job: "", family: "", familyCount: "", dependent: "" });
  const [debts, addDebt, delDebt, updDebt] = useRows([
    { id: 1, label: "ค่าผ่อนบ้าน (คงค้าง)", amount: "" },
    { id: 2, label: "ค่าผ่อนรถ (คงค้าง)", amount: "" },
    { id: 3, label: "ทรัพย์สินคงค้าง", amount: "" },
    { id: 4, label: "ภาระหนี้สินอื่นๆ (OD, Credit Card)", amount: "" },
  ]);
  const [expenses, addExp, delExp, updExp] = useRows([
    { id: 1, label: "ค่าใช้จ่ายครอบครัว (ปัจจัยสี่)", perYear: "", years: "" },
    { id: 2, label: "ค่าใช้จ่ายอุปการะ (พ่อ,แม่,พี่,น้อง)", perYear: "", years: "" },
  ]);
  const [edus, addEdu, delEdu, updEdu] = useRows([
    { id: 1, label: "บุตรคนที่ 1", years: "", perYear: "" },
    { id: 2, label: "บุตรคนที่ 2", years: "", perYear: "" },
    { id: 3, label: "บุตรคนที่ 3", years: "", perYear: "" },
  ]);
  const [existing, setExisting] = useState("");
  const [insurance, setInsurance] = useState("");
  const [otherNeeds, setOtherNeeds] = useState([]);
  const [status, setStatus] = useState("idle");

  const t1 = debts.reduce((s, r) => s + num(r.amount), 0);
  const t2 = expenses.reduce((s, r) => s + num(r.perYear) * num(r.years), 0);
  const t3 = edus.reduce((s, r) => s + num(r.years) * num(r.perYear), 0);
  const t4 = t1 + t2 + t3;
  const needMore = Math.max(0, t4 - num(existing) - num(insurance));

  const toggleNeed = (n) => setOtherNeeds((prev) => prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]);

  const handleSave = async () => {
    if (!p.name) { alert("กรุณากรอกชื่อ-นามสกุลก่อนบันทึก"); return; }
    setStatus("saving");
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...p, total1: t1, total2: t2, total3: t3, total4: t4,
          existing: num(existing), insurance: num(insurance), needMore,
          debtsDetail: debts.map((r) => `${r.label}: ${fmt(num(r.amount))}`).join(" | "),
          expensesDetail: expenses.map((r) => `${r.label}: ${fmt(num(r.perYear) * num(r.years))}`).join(" | "),
          educationDetail: edus.map((r) => `${r.label}: ${fmt(num(r.years) * num(r.perYear))}`).join(" | "),
          otherNeeds: otherNeeds.join(", "),
        }),
      });
      setStatus("saved"); setTimeout(() => setStatus("idle"), 3000);
    } catch { setStatus("error"); setTimeout(() => setStatus("idle"), 3000); }
  };

  return (
    <div>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
        input:focus { border-color: #1a3a7c !important; box-shadow: 0 0 0 2px rgba(26,58,124,0.15); }
        button:hover { opacity: 0.88; }
      `}</style>

      <div style={S.header}>PROTECTION PLANNING</div>

      <div style={S.wrap}>
        {/* Action Buttons */}
        <div style={S.actionBar} className="no-print">
          <button style={S.btnPrint} onClick={() => window.print()}>🖨 พิมพ์ / PDF</button>
          <button style={S.btnSave(status)} onClick={handleSave} disabled={status === "saving"}>
            {status === "saving" ? "กำลังบันทึก..." : status === "saved" ? "✓ บันทึกแล้ว" : status === "error" ? "✗ ผิดพลาด" : "💾 บันทึกลง Google Sheets"}
          </button>
        </div>

        {/* Personal Info */}
        <div style={S.card}>
          <div style={S.personalGrid}>
            <div><div style={S.plabel}>ชื่อ-นามสกุล</div><input style={S.inpL} value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} placeholder="ชื่อ นามสกุล" /></div>
            <div><div style={S.plabel}>อายุ (ปี)</div><input style={S.inp} type="number" value={p.age} onChange={(e) => setP({ ...p, age: e.target.value })} placeholder="0" /></div>
            <div><div style={S.plabel}>อาชีพ</div><input style={S.inpL} value={p.job} onChange={(e) => setP({ ...p, job: e.target.value })} placeholder="อาชีพ" /></div>
            <div></div>
          </div>
          <div style={{ ...S.personalGrid, borderBottom: "none" }}>
            <div><div style={S.plabel}>สมาชิกในครอบครัว</div><input style={S.inpL} value={p.family} onChange={(e) => setP({ ...p, family: e.target.value })} placeholder="เช่น ภรรยา, บุตร" /></div>
            <div><div style={S.plabel}>จำนวน (คน)</div><input style={S.inp} type="number" value={p.familyCount} onChange={(e) => setP({ ...p, familyCount: e.target.value })} placeholder="0" /></div>
            <div><div style={S.plabel}>อุปการะดูแล</div><input style={S.inpL} value={p.dependent} onChange={(e) => setP({ ...p, dependent: e.target.value })} placeholder="ผู้อยู่ในอุปการะ" /></div>
            <div></div>
          </div>
        </div>

        {/* Section 1 */}
        <div style={S.card}>
          <div style={S.secHead("#8B1A1A")}>(1) หนี้สินที่อาจเป็นภาระแก่ครอบครัว</div>
          <div style={{ ...S.gridHead, gridTemplateColumns: "1fr 150px 36px" }}>
            <span>รายการหนี้</span><span style={{ textAlign: "right" }}>จำนวนเงิน (บาท)</span><span />
          </div>
          {debts.map((r) => (
            <div key={r.id} style={{ ...S.row, gridTemplateColumns: "1fr 150px 36px" }}>
              <input style={S.inpL} value={r.label} onChange={(e) => updDebt(r.id, "label", e.target.value)} placeholder="รายการ" />
              <input style={S.inp} type="number" value={r.amount} onChange={(e) => updDebt(r.id, "amount", e.target.value)} placeholder="0" />
              <button style={S.delBtn} onClick={() => delDebt(r.id)} className="no-print">×</button>
            </div>
          ))}
          <button style={S.addBtn} onClick={() => addDebt({ label: "", amount: "" })} className="no-print">
            <span style={S.dot}>+</span> เพิ่มรายการ
          </button>
          <div style={S.totalRow}><span style={S.totalLabel}>รวมหนี้สิน (1)</span><div style={S.totalVal}>{fmt(t1)} บาท</div></div>
        </div>

        {/* Section 2 */}
        <div style={S.card}>
          <div style={S.secHead("#7a6010")}>(2) ค่าใช้จ่ายครอบครัว</div>
          <div style={{ ...S.gridHead, gridTemplateColumns: "1fr 110px 80px 130px 36px" }}>
            <span>รายการ</span><span style={{ textAlign: "right" }}>ค่าใช้จ่าย/ปี</span>
            <span style={{ textAlign: "right" }}>จำนวนปี</span><span style={{ textAlign: "right" }}>รวม</span><span />
          </div>
          {expenses.map((r) => {
            const sub = num(r.perYear) * num(r.years);
            return (
              <div key={r.id} style={{ ...S.row, gridTemplateColumns: "1fr 110px 80px 130px 36px" }}>
                <input style={S.inpL} value={r.label} onChange={(e) => updExp(r.id, "label", e.target.value)} placeholder="รายการ" />
                <input style={S.inp} type="number" value={r.perYear} onChange={(e) => updExp(r.id, "perYear", e.target.value)} placeholder="0" />
                <input style={S.inp} type="number" value={r.years} onChange={(e) => updExp(r.id, "years", e.target.value)} placeholder="0" />
                <div style={S.calcVal}>{fmt(sub)}</div>
                <button style={S.delBtn} onClick={() => delExp(r.id)} className="no-print">×</button>
              </div>
            );
          })}
          <button style={S.addBtn} onClick={() => addExp({ label: "", perYear: "", years: "" })} className="no-print">
            <span style={S.dot}>+</span> เพิ่มรายการ
          </button>
          <div style={S.totalRow}><span style={S.totalLabel}>จำนวนเงินที่ครอบครัวต้องการ (2)</span><div style={S.totalVal}>{fmt(t2)} บาท</div></div>
        </div>

        {/* Section 3 */}
        <div style={S.card}>
          <div style={S.secHead("#2d5a1a")}>(3) ทุนการศึกษาบุตร &nbsp;(20 ปี – อายุบุตร = จำนวนปีที่ศึกษา)</div>
          <div style={{ ...S.gridHead, gridTemplateColumns: "1fr 90px 110px 130px 36px" }}>
            <span>บุตร / รายการ</span><span style={{ textAlign: "right" }}>จำนวนปี</span>
            <span style={{ textAlign: "right" }}>ค่าเทอม/ปี</span><span style={{ textAlign: "right" }}>รวม</span><span />
          </div>
          {edus.map((r) => {
            const sub = num(r.years) * num(r.perYear);
            return (
              <div key={r.id} style={{ ...S.row, gridTemplateColumns: "1fr 90px 110px 130px 36px" }}>
                <input style={S.inpL} value={r.label} onChange={(e) => updEdu(r.id, "label", e.target.value)} placeholder="รายการ" />
                <input style={S.inp} type="number" value={r.years} onChange={(e) => updEdu(r.id, "years", e.target.value)} placeholder="0" />
                <input style={S.inp} type="number" value={r.perYear} onChange={(e) => updEdu(r.id, "perYear", e.target.value)} placeholder="0" />
                <div style={S.calcVal}>{fmt(sub)}</div>
                <button style={S.delBtn} onClick={() => delEdu(r.id)} className="no-print">×</button>
              </div>
            );
          })}
          <button style={S.addBtn} onClick={() => addEdu({ label: "", years: "", perYear: "" })} className="no-print">
            <span style={S.dot}>+</span> เพิ่มบุตร / รายการ
          </button>
          <div style={S.totalRow}><span style={S.totalLabel}>รวมทุนการศึกษาที่ต้องเตรียม (3)</span><div style={S.totalVal}>{fmt(t3)} บาท</div></div>
        </div>

        {/* Summary */}
        <div style={S.card}>
          <div style={S.sumRow}>
            <span style={S.sumLabel}>จำนวนเงินที่ต้องการทั้งหมด (1)+(2)+(3) = (4)</span>
            <div style={S.sumVal}>{fmt(t4)} บาท</div>
          </div>
          <div style={S.sumRow}>
            <span style={S.sumLabel}>(5) เงินที่เตรียมไว้แล้ว (เงินสด + ทรัพย์สินแปรสภาพได้)</span>
            <input style={{ ...S.inp, maxWidth: 180 }} type="number" value={existing} onChange={(e) => setExisting(e.target.value)} placeholder="0" />
          </div>
          <div style={S.sumRow}>
            <span style={{ ...S.sumLabel, color: "#1a3a7c", fontWeight: 500 }}>(6) ทุนประกันชีวิตที่มีอยู่</span>
            <input style={{ ...S.inp, maxWidth: 180 }} type="number" value={insurance} onChange={(e) => setInsurance(e.target.value)} placeholder="0" />
          </div>
          <div style={S.needRow}>
            <span style={S.needLabel}>ทุนประกันชีวิตที่ต้องเพิ่ม (4)–(5)–(6)</span>
            <div style={S.needVal}>{fmt(needMore)} บาท</div>
          </div>
        </div>

        {/* Other Needs */}
        <div style={S.card}>
          <div style={S.secHead("#7a6010")}>ความต้องการของลูกค้าในส่วนอื่น ๆ</div>
          <div style={S.needsGrid}>
            {OTHER_NEEDS.map((need) => (
              <label key={need} style={S.needItem}>
                <input type="checkbox" checked={otherNeeds.includes(need)} onChange={() => toggleNeed(need)}
                  style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1, accentColor: "#1a3a7c" }} />
                <span>{need}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
