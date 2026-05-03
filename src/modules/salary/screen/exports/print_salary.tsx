import { useListEmployeeWithState } from "modules/employee/service";
import { showPayrollPeriodByCycleName } from "modules/salary/api";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const formatCurrency = (n: number) =>
  (n ?? 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 });

export default function PrintPayrollTable() {
  const [searchParams] = useSearchParams();
  const cycleName = searchParams.get("CycleName") || "";
  const employeeId = searchParams.get("EmployeeId") || "";
  const [payroll, setPayroll] = useState<any>({ 
    company: "CÔNG TY TNHH VUDACO",
    address: "Số 6C/195 Kiều Hạ, P. Đông Hải 2, Q. Hải An, TP. Hải Phòng",
  });
  const { data: listEmployee } = useListEmployeeWithState({});
  useEffect(() => {
    if(cycleName && employeeId){
        showPayrollPeriodByCycleName({ cycleName, employeeId }).then(res => {
             const detail = res.data.data
              if(detail){
              
                
                const _employee = listEmployee.find((x: any) => x.id === detail.employee_id);
                const _khoanChi = detail.chiTietKhoanChi ? JSON.parse(detail.chiTietKhoanChi) : [];
                const info = {
                    ...payroll,
                    ...detail,
                    employeeName: `${_employee?.last_name ?? ""} ${_employee?.first_name ?? ""}`.trim(),
                    baseSalary: detail.base_salary,
                    khoanChi : _khoanChi,
                }
                console.log(info);
                setPayroll(info);
              }
        });
    }
  }, [cycleName, employeeId, listEmployee]);


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
                <b>Lương cơ bản</b>: {formatCurrency(payroll.baseSalary)}
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
              <td colSpan={2} style={cell({ textAlign: "center", fontWeight: 700 })}>STT</td>
              <td colSpan={2} style={cell({ fontWeight: 700 })}>Các Khoản Thu Nhập</td>
              <td colSpan={2} style={cell({ textAlign: "right", fontWeight: 700 })}>Số tiền</td>
            </tr>

            {/* Rows */}
            {/* {rows.map((r, idx) => (
              <tr key={idx}>
                <td colSpan={2} style={cell({ textAlign: "center" })}>{r.left.stt}</td>
                <td colSpan={2} style={cell()}>{r.left.name}</td>
                <td colSpan={2} style={cell({ textAlign: "right" })}>
                  {r.left.amount === null ? "" : formatCurrency(r.left.amount)}
                </td>
              </tr>
            ))} */}
          
            {/* Totals */}
            <tr>
              <td colSpan={4} style={cell({ fontWeight: 800 })}>
                Tổng Cộng
              </td>
              <td colSpan={2} style={cell({ textAlign: "right", fontWeight: 800 })}>
                {/* {formatCurrency(incomeTotal)} */}
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={cell({ textAlign: "center", fontWeight: 700 })}>STT</td>
              <td colSpan={2} style={cell({ fontWeight: 700 })}>Các Khoản Trừ Vào Lương</td>
              <td colSpan={2} style={cell({ textAlign: "right", fontWeight: 700 })}>Số tiền</td>
            </tr>
              {/* Rows */}
            {/* {rows.map((r, idx) => (
              <tr key={idx}>
                <td colSpan={2} style={cell({ textAlign: "center" })}>{r.right.stt}</td>
                <td colSpan={2} style={cell()}>{r.right.name}</td>
                <td colSpan={2} style={cell({ textAlign: "right" })}>
                  {r.right.amount === null ? "" : formatCurrency(r.right.amount)}
                </td>
              </tr>
            ))} */}
             <tr>
              <td colSpan={4} style={cell({ fontWeight: 800 })}>
                Tổng Cộng
              </td>
              <td colSpan={2} style={cell({ textAlign: "right", fontWeight: 800 })}>
                {/* {formatCurrency(deductionTotal)} */}
              </td>
            </tr>
            {/* Net */}
            <tr>
              <td colSpan={6} style={cell({ fontWeight: 800 })}>
                Tổng Số Tiền Lương Thực Nhận:{" "}
                {/* <span style={{ float: "right" }}>{formatCurrency(net)}</span> */}
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
