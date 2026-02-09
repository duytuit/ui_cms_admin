import React, { useMemo } from "react";

const formatCurrency = (n: number) =>
  (n ?? 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 });

export default function PrintPayrollTable() {
  // =========================
  // DATA MẪU
  // =========================
  const payroll = {
    company: "CÔNG TY TNHH VUDACO",
    address: "Số 6C/195 Kiều Hạ, P. Đông Hải 2, Q. Hải An, TP. Hải Phòng",
    dateText: "Ngày 05 tháng 02 năm 2026",

    employeeCode: "NV-0012",
    employeeName: "Nguyễn Văn A",
    position: "Kế toán tổng hợp",

    bhbbSalary: 12000000,
    workDays: 24,
    standardDays: 26,

    incomes: [
      { stt: "1", name: "Lương Chính", amount: 15000000 },
      { stt: "2", name: "Phụ Cấp:", amount: null },
      { stt: "2,1", name: "Trách nhiệm", amount: 500000 },
      { stt: "2,2", name: "Ăn trưa", amount: 780000 },
      { stt: "2,3", name: "Điện thoại", amount: 300000 },
      { stt: "2,4", name: "Xăng xe", amount: 400000 },
      { stt: "2,5", name: "Nhà ở", amount: 0 },
      { stt: "2,6", name: "Nuôi con nhỏ", amount: 0 },
    ],

    deductions: [
      { stt: "1", name: "Bảo Hiểm Bắt Buộc", amount: null },
      { stt: "1,1", name: "Bảo hiểm xã hội (8%)", amount: 12000000 * 0.08 },
      { stt: "1,2", name: "Bảo hiểm y tế (1,5%)", amount: 12000000 * 0.015 },
      { stt: "1,3", name: "Bảo hiểm thất nghiệp (1%)", amount: 12000000 * 0.01 },
      { stt: "2", name: "Thuế Thu Nhập Cá Nhân", amount: 350000 },
      { stt: "3", name: "Tạm Ứng", amount: 1000000 },
      { stt: "4", name: "Khác", amount: 0 },
    ],
  };

  // =========================
  // MERGE 2 LIST THÀNH ROWS
  // =========================
  const rows = useMemo(() => {
    const max = Math.max(payroll.incomes.length, payroll.deductions.length);

    return Array.from({ length: max }).map((_, i) => {
      const left = payroll.incomes[i] || { stt: "", name: "", amount: null };
      const right = payroll.deductions[i] || { stt: "", name: "", amount: null };

      return { left, right };
    });
  }, []);

  // =========================
  // TOTALS
  // =========================
  const incomeTotal = useMemo(() => {
    return payroll.incomes.reduce((sum, x) => sum + (x.amount || 0), 0);
  }, []);

  const deductionTotal = useMemo(() => {
    return payroll.deductions.reduce((sum, x) => sum + (x.amount || 0), 0);
  }, []);

  const net = incomeTotal - deductionTotal;

  // =========================
  // UI TABLE
  // =========================
  return (
    <div style={{ padding: 12, background: "#fff" }}>
      <div style={{ width: 900, margin: "0 auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "2px solid #000",
            fontSize: 14,
            color: "#000",
          }}
        >
          <tbody>
            {/* Công ty */}
            <tr>
              <td colSpan={6} style={cell()}>
                <b>Công ty</b> {payroll.company}
              </td>
            </tr>

            {/* Địa chỉ */}
            <tr>
              <td colSpan={6} style={cell()}>
                <b>Địa chỉ</b>: {payroll.address}
              </td>
            </tr>

            {/* Title */}
            <tr>
              <td colSpan={6} style={cell({ textAlign: "center", padding: "14px 0" })}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>PHIẾU LƯƠNG</div>
              </td>
            </tr>

            {/* Ngày */}
            <tr>
              <td colSpan={6} style={cell()}>
                {payroll.dateText}
              </td>
            </tr>

            {/* Info row 1 */}
            <tr>
              <td colSpan={3} style={cell()}>
                <b>Mã Nhân Viên</b>: {payroll.employeeCode}
              </td>
              <td colSpan={3} style={cell()}>
                <b>Lương đóng BHBB</b>: {formatCurrency(payroll.bhbbSalary)}
              </td>
            </tr>

            {/* Info row 2 */}
            <tr>
              <td colSpan={3} style={cell()}>
                <b>Họ Và Tên</b>: {payroll.employeeName}
              </td>
              <td colSpan={3} style={cell()}>
                <b>Ngày công đi làm</b>: {payroll.workDays}
              </td>
            </tr>

            {/* Info row 3 */}
            <tr>
              <td colSpan={3} style={cell()}>
                <b>Chức Danh</b>: {payroll.position}
              </td>
              <td colSpan={3} style={cell()}>
                <b>Ngày công chuẩn</b>: {payroll.standardDays}
              </td>
            </tr>

            {/* Header 2 bên */}
            <tr>
              <td style={cell({ textAlign: "center", fontWeight: 700 })}>STT</td>
              <td style={cell({ fontWeight: 700 })}>Các Khoản Thu Nhập</td>
              <td style={cell({ textAlign: "right", fontWeight: 700 })}>Số tiền</td>

              <td style={cell({ textAlign: "center", fontWeight: 700 })}>STT</td>
              <td style={cell({ fontWeight: 700 })}>Các Khoản Trừ Vào Lương</td>
              <td style={cell({ textAlign: "right", fontWeight: 700 })}>Số tiền</td>
            </tr>

            {/* Rows */}
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td style={cell({ textAlign: "center" })}>{r.left.stt}</td>
                <td style={cell()}>{r.left.name}</td>
                <td style={cell({ textAlign: "right" })}>
                  {r.left.amount === null ? "" : formatCurrency(r.left.amount)}
                </td>

                <td style={cell({ textAlign: "center" })}>{r.right.stt}</td>
                <td style={cell()}>{r.right.name}</td>
                <td style={cell({ textAlign: "right" })}>
                  {r.right.amount === null ? "" : formatCurrency(r.right.amount)}
                </td>
              </tr>
            ))}

            {/* Totals */}
            <tr>
              <td colSpan={2} style={cell({ fontWeight: 800 })}>
                Tổng Cộng
              </td>
              <td style={cell({ textAlign: "right", fontWeight: 800 })}>
                {formatCurrency(incomeTotal)}
              </td>

              <td colSpan={2} style={cell({ fontWeight: 800 })}>
                Tổng Cộng
              </td>
              <td style={cell({ textAlign: "right", fontWeight: 800 })}>
                {formatCurrency(deductionTotal)}
              </td>
            </tr>

            {/* Net */}
            <tr>
              <td colSpan={6} style={cell({ fontWeight: 800 })}>
                Tổng Số Tiền Lương Thực Nhận:{" "}
                <span style={{ float: "right" }}>{formatCurrency(net)}</span>
              </td>
            </tr>

            {/* Bằng chữ */}
            <tr>
              <td colSpan={6} style={cell()}>
                <b>Bằng chữ</b>: Mười bốn triệu sáu trăm mười nghìn đồng
              </td>
            </tr>

            {/* Signatures */}
            <tr>
              <td colSpan={3} style={cell({ textAlign: "center", padding: "18px 0" })}>
                <b>Người lập phiếu</b>
              </td>
              <td colSpan={3} style={cell({ textAlign: "center", padding: "18px 0" })}>
                <b>Người nhận tiền</b>
              </td>
            </tr>

            <tr>
              <td colSpan={3} style={cell({ textAlign: "center", height: 90 })}>
                Ký và ghi rõ họ tên
              </td>
              <td colSpan={3} style={cell({ textAlign: "center", height: 90 })}>
                Ký và ghi rõ họ tên
              </td>
            </tr>
          </tbody>
        </table>

        {/* Nút in */}
        {/* <div style={{ marginTop: 14, textAlign: "right" }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #000",
              cursor: "pointer",
              background: "#fff",
              fontWeight: 700,
            }}
          >
            In phiếu lương
          </button>
        </div> */}
      </div>
    </div>
  );
}

// =========================
// STYLE CELL
// =========================
function cell(extra?: React.CSSProperties): React.CSSProperties {
  return {
    border: "1px solid #000",
    padding: "6px 8px",
    verticalAlign: "middle",
    ...extra,
  };
}
