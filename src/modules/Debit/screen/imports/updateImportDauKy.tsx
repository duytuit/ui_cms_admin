
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, scrollToTop, refreshObject } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import * as XLSX from 'xlsx';
import { FileUpload } from "primereact/fileupload";
import { addPartner, showPartner } from "modules/partner/api";
import { addDebitDauKyKH, importDebitDauKyKH } from "modules/Debit/api";
import { Helper } from "utils/helper";
import { Button, Column, DataTable } from "components/uiCore";
export default function UpdateImportDauKy() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({ type: CategoryEnum.country });
  const [dataRow, setDataRow] = useState<any[]>([]);
  const fileRef = useRef<FileUpload>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clearFile = () => {
      setDataRow([])
      fileRef.current?.clear();   // ← không báo lỗi nữa
  };
  const handleSelect = (e:any) => {
      const file = e.files[0];
      readExcel(file);
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    let info = {
      ...infos,
      Data:JSON.stringify(dataRow)
    };
    console.log(info);
    
    setLoading(true);
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
      const response = await importDebitDauKyKH(info);
        if (response) setLoading(false);
        if (response.status === 200) {
          if (response.data.status) {
            setInfos({ ...refreshObject(infos), status: true });
            dispatch(
              showToast({ ...listToast[0], detail: response.data.message })
            );
            navigate("/debit/ListDauKyKh");
          } else {
            dispatch(
              showToast({ ...listToast[2], detail: response.data.message })
            );
          }
        } else
          dispatch(
            showToast({ ...listToast[1], detail: response.data.message })
          );
   };
const readExcel = (file: any) => {
  const reader = new FileReader();

  reader.onload = (event: any) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array", cellDates: true });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const json: any[] = XLSX.utils.sheet_to_json(sheet, { raw: false });

    // Hàm format ngày sang "Y-M-d"
    const formatDate = (value: any) => {
      if (!value) return null;

      // Nếu là Date object
      if (value instanceof Date && !isNaN(value.getTime())) {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, "0");
        const day = String(value.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      // Nếu là chuỗi kiểu "9/4/25"
      if (typeof value === "string" && value.includes("/")) {
        const parts = value.split("/");
        let month = parseInt(parts[0], 10);
        let day = parseInt(parts[1], 10);
        let year = parseInt(parts[2], 10);
        if (year < 100) year += 2000; // 25 -> 2025
        return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      }

      // Nếu là số serial của Excel
      if (typeof value === "number") {
        const base = new Date(Date.UTC(1899, 11, 30));
        const d = new Date(base.getTime() + value * 86400 * 1000);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      return value;
    };

    // Map tất cả row và convert cột Ngay
    const formatted = json.map(row => ({
      ...row,
      ngay: formatDate(row.ngay),
      tien_dv:Helper.parseMoney(row.tien_dv),
      tien_ch:Helper.parseMoney(row.tien_ch)
    }));

    setDataRow(formatted);
  };

  reader.readAsArrayBuffer(file);
};
  useEffect(() => {
    if (id) {
      showPartner({ id: id, type: CategoryEnum.country }).then(res => {
        const detail = res.data.data
        if (detail) {
          let info = {
            ...detail, status: detail.status === 0 ? true : false,
          };
          setInfos(info)
        }
      }).catch(err => {
        //setHasError(true)
      });
    }
  }, [])
  return (
    <>
      <AddForm
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        title="nhập dữ liệu đầu kỳ từ Excel"
        loading={loading}
        onSubmit={handleSubmit}
        routeList="/debit/ListDauKyKh"
      >
        <div className="field">
            <div className="field">
                <FileUpload
                    ref={fileRef}
                    mode="basic"
                    accept=".xlsx,.xls"
                    customUpload={true}
                    chooseLabel="Chọn Excel"
                    onSelect={handleSelect}
                />
                 <Button
                   type="button"
                    label="Clear file"
                    severity="secondary"
                    onClick={clearFile}
                    className="mt-2"
                />
            </div>
           <DataTable 
              rowHover
              scrollable
              scrollHeight="flex"
              style={{ flex: 1 }}
              value={dataRow}
              >
                <Column field="ten_kh" header="Tên viết tắt KH" />
                <Column field="ngay" header="Ngày hạch toán" />
                <Column field="noi_dung" header="Nội dung" />
                <Column field="tien_dv" body={(row: any) => Helper.formatCurrency(row.tien_dv.toString())} header="Số tiền dịch vụ" />
                <Column field="tien_ch" body={(row: any) => Helper.formatCurrency(row.tien_ch.toString())}  header="Số tiền chi hộ" />
            </DataTable>
        </div>
      </AddForm>
    </>
  );
}