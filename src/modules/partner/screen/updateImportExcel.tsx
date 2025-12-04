
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, scrollToTop, refreshObject } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { Panel } from "primereact/panel";
import { addPartner, showPartner, updatePartner } from "../api";
import { Input } from "components/common/ListForm";
import * as XLSX from 'xlsx';
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
export default function UpdateImportExcel() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({ type: CategoryEnum.country });
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSelect = (e:any) => {
      const file = e.files[0];
      readExcel(file);
  };

  const readExcel = (file:any) => {
      const reader = new FileReader();

      reader.onload = async (event:any) => {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          const json = XLSX.utils.sheet_to_json(sheet);  
           for (const element of json) {
              await addPartner(element);
            }
          console.log(json);
          
        }
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
  const menuRight = useRef<Menu>(null);

    const items = [
        {
            items: [
                {
                    label: 'Công nợ chi tiết',
                    command: () => console.log("Thêm mới")
                },
                {
                    label: 'Công nợ chi tiết 1',
                    command: () => console.log("Chỉnh sửa")
                }
            ]
        }
    ];
  return (
    <>
       <div>
            <h3>Đọc Excel bằng PrimeReact FileUpload</h3>

            <FileUpload
                mode="basic"
                accept=".xlsx,.xls"
                customUpload={true}
                chooseLabel="Chọn Excel"
                onSelect={handleSelect}
            />
        </div>
      <table>
          <thead>
              <tr>
                  {rows[0] && Object.keys(rows[0]).map(key => <th key={key}>{key}</th>)}
              </tr>
          </thead>
          <tbody>
              {rows.map((row, i) => (
                  <tr key={i}>
                      {Object.values(row).map((val:any, j) => <td key={j}>{val}</td>)}
                  </tr>
              ))}
          </tbody>
      </table>
       <div className="card flex justify-content-center">
            <Menu model={items} popup ref={menuRight} id="popup_menu_right" />
            <Button 
                label="Export"
                icon="pi pi-file-export"
                severity="info" 
                onClick={(e) => menuRight.current?.toggle(e)}
                aria-controls="popup_menu_right"
                aria-haspopup
            />
        </div>
    </>
  );
}