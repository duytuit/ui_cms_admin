import { showDataShareEmployeeByCycleName } from "modules/department/api";
import { useListDataShareDepartment, useListDataShareEmployee, useListDepartmentWithState } from "modules/department/service";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helper } from "utils/helper";
export default function PrintPayrollTable() {
  const [searchParams] = useSearchParams();
  const cycleName = searchParams.get("cycleName") || "";
  const employeeId = searchParams.get("employeeId") || "";
  const storageId = searchParams.get("storageId") || 1;

  const [payroll, setPayroll] = useState<any>({
    company: "CÔNG TY TNHH VUDACO",
    address: "Số 6C/195 Kiều Hạ, P. Đông Hải 2, Q. Hải An, TP. Hải Phòng",
    khoanChi: [],
  });

  const { data: listEmployee } = useListDataShareEmployee({});
  const { data: departments } = useListDataShareDepartment({});

  // =========================
  // HELPER
  // =========================
  const toNumber = (v: any) => Number(v) || 0;

  const parseKhoanChi = (arr: any[] = []) =>
    arr.map((x) => ({
      ...x,
      dataParsed: typeof x.data === "string" ? JSON.parse(x.data) : x.data,
    }));

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    if (!cycleName || !employeeId || !listEmployee || !departments) return;

    const load = async () => {
      const res = await showDataShareEmployeeByCycleName({ cycleName, employeeId ,storageId});
      const detail = res?.data?.data;
      if (!detail) return;

      const employee = listEmployee.find((x: any) => x.id === detail.employeeId);

      const deptId = employee?.employee_departments?.[0]?.department_id;
      const dept = departments.find((d: any) => d.id === deptId);

      const khoanChi = parseKhoanChi(
        detail.chiTietPhieuChi ? JSON.parse(detail.chiTietPhieuChi) : []
      );
      setPayroll({
        company: "CÔNG TY TNHH VUDACO",
        address: "Số 6C/195 Kiều Hạ, P. Đông Hải 2, Q. Hải An, TP. Hải Phòng",
        ...detail,
        employeeCode: employee?.code || "",
        employeeName: `${employee?.last_name ?? ""} ${employee?.first_name ?? ""}`.trim(),
        position: dept?.name || "",
        khoanChi,
      });
      console.log(khoanChi);
    };
    
    load();
  }, [cycleName, employeeId, listEmployee, departments]);

  // =========================
  // CONFIG TABLE
  // =========================
  const thuNhapList = [
    { label: "Lương thực tế", key: "luongThucTe" },
    { label: "Điểm trả hàng", key: "diemTraHang" },
    { label: "Tiền ăn", key: "tienAn" },
    { label: "Qua đêm", key: "quaDem" },
    { label: "Điện thoại", key: "dienThoai" },
    { label: "Tiền vé", key: "tienVe" },
    { label: "Luật", key: "luat" },
    { label: "Lương hàng về", key: "luongHangVe" },
    { label: "Trợ cấp khác", key: "troCapKhac" },
  ];

  const khauTruList = [
    { label: "Tổng tạm ứng", key: "tongUng" },
    { label: "Bảo hiểm xã hội", key: "baoHiemXaHoi" },
    { label: "Trừ phép", key: "truPhep" },
    { label: "Lái xe thu cước", key: "laiXeThuCuoc" },
    { label: "Chi khác", key: "chiKhac" },
  ];

  // =========================
  // CALC TOTAL
  // =========================
  const totalThuNhap = useMemo(
    () => thuNhapList.reduce((sum, i) => sum + toNumber(payroll[i.key]), 0),
    [payroll]
  );

  const totalKhauTru = useMemo(
    () => khauTruList.reduce((sum, i) => sum + toNumber(payroll[i.key]), 0),
    [payroll]
  );

  const net = totalThuNhap - totalKhauTru;

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: 12, background: "#fff" }}>
      <div style={{ width: "100%", margin: "0 auto" }}>
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
                <div style={{ fontWeight: 800, fontSize: 18 }}>PHIẾU LƯƠNG {payroll.cycleName}</div>
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
                <b>Lương cơ bản</b>: {Helper.formatCurrency((payroll.luongCung || "").toString())}
              </td>
            </tr>

            {/* Info row 2 */}
            <tr>
              <td colSpan={3} style={cell()}>
                <b>Họ Và Tên</b>: {payroll.employeeName}
              </td>
              <td colSpan={3} style={cell()}>
                <b>Ngày công đi làm</b>: {payroll.soNgayLam}
              </td>
            </tr>

            {/* Info row 3 */}
            <tr>
              <td colSpan={3} style={cell()}>
                <b>Chức Danh</b>: {payroll.position}
              </td>
              <td colSpan={3} style={cell()}>
                <b>Ngày nghỉ phép</b>: {payroll.nghiPhep}
              </td>
            </tr>

            {/* Header 2 bên */}
            <tr>
              <td colSpan={2} style={cell({ textAlign: "center", fontWeight: 700 })}>STT</td>
              <td colSpan={2} style={cell({ fontWeight: 700 })}>Các Khoản Thu Nhập</td>
              <td colSpan={2} style={cell({ textAlign: "right", fontWeight: 700 })}>Số tiền</td>
            </tr>
            {/* Rows */}
            {thuNhapList.map((item, index) => (
              <tr key={index}>
                <td colSpan={2} style={cell({ textAlign: "center" })}>{index + 1}</td>
                <td colSpan={2} style={cell()}>{item.label}</td>
                <td colSpan={2} style={cell({ textAlign: "right" })}>
                  {Helper.formatCurrency((payroll[item.key] || "").toString())}
                </td>
              </tr>
            ))}

             {/* Tổng thu nhập */}
             <tr>
              <td colSpan={4} style={cell({ fontWeight: 800 })}>
                Tổng Cộng
              </td>
              <td colSpan={2} style={cell({ textAlign: "right", fontWeight: 800 })}>
                {Helper.formatCurrency(totalThuNhap.toString())}
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={cell({ textAlign: "center", fontWeight: 700 })}>STT</td>
              <td colSpan={2} style={cell({ fontWeight: 700 })}>Các Khoản Trừ Vào Lương</td>
              <td colSpan={2} style={cell({ textAlign: "right", fontWeight: 700 })}>Số tiền</td>
            </tr>
              {/* Rows */}
              {khauTruList.map((item, index) => (
              <tr key={index}>
                <td colSpan={2} style={cell({ textAlign: "center" })}>{index + 1}</td>
                <td colSpan={2} style={cell()}>
                  <div>
                    {item.label}
                  </div>
                  {payroll.khoanChi && index === 0 && payroll.khoanChi.length > 0 && (
                    <div style={{ marginTop: 4, paddingLeft: 12 }}>
                      {payroll.khoanChi.map((kc: any, idx: number) => (
                        <div key={idx} style={{ fontSize: 12 }}>
                          {kc.note || ""}: {Helper.formatCurrency((kc.total || 0).toString())}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td colSpan={2} style={cell({ textAlign: "right" })}>
                  {Helper.formatCurrency((payroll[item.key] || "").toString())}
                </td>
              </tr>
            ))}

             {/* Tổng khấu trừ */}
             <tr>
              <td colSpan={4} style={cell({ fontWeight: 800 })}>
                Tổng Cộng
              </td>
              <td colSpan={2} style={cell({ textAlign: "right", fontWeight: 800 })}>
                {Helper.formatCurrency(totalKhauTru.toString())}
              </td>
            </tr>
            {/* Net */}
            <tr>
              <td colSpan={4} style={cell({ fontWeight: 800 })}>
                Tổng Số Tiền Lương Thực Nhận
              </td>
              <td colSpan={2} style={cell({ textAlign: "right", fontWeight: 800 })}>
                {Helper.formatCurrency(net.toString())}
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
              </td>
              <td colSpan={3} style={cell({ textAlign: "center", height: 90 })}>
              </td>
            </tr>
          </tbody>
        </table>
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