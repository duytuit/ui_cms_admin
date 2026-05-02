
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject, typeDepreciation } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { Button, Checkbox, Column, DataTable, Dropdown, Panel } from "components/uiCore";
import { addDepreciation, showDepreciation, updateDepreciation } from "../api";
import { Helper } from "utils/helper";
export default function UpdateDepreciation() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    const [loading, setLoading] = useState(false);
    const [productTaiSan, setProductTaiSan] = useState<any[]>([]);
    const [newTaiSan, setNewTaiSan] = useState<any>({CodeNumber:"", Name: "", OriginalCost: 0,UsefulLife:0,MonthlyDepreciation:0,Note:"" });
    const [infos, setInfos] = useState<any>({isExternalDriver:0});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = (e:any) => {
        e.preventDefault();
       infos.Data = productTaiSan;
       infos.type = type; // khấu hao tài sản cố định
        let info = {
          ...infos
      };
      console.log('info',info);
      setLoading(true);
      fetchDataSubmit(info);
    };
     async function fetchDataSubmit(info:any) {
      if (info.id) {
          const response = await updateDepreciation(info);
          if (response) setLoading(false);
          if (response.status === 200) {
              if(response.data.status){
                dispatch(showToast({ ...listToast[0], detail: response.data.message }));
                if(type === "1"){
                  navigate('/depreciation/list?type=1');
                }else if(type === "3"){
                  navigate('/depreciation/ListChiPhiChung?type=3');
                }else{
                  navigate('/depreciation/listChiPhiTraTruoc?type=2');
                }
              }else{
                dispatch(showToast({ ...listToast[2], detail: response.data.message }))
              }
          } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      } else {
          const response = await addDepreciation(info);
          if (response) setLoading(false);
          if (response.status === 200) {
              if(response.data.status){
                setInfos({ ...refreshObject(infos), status: true })
                dispatch(showToast({ ...listToast[0], detail: response.data.message }));
                if(type === "1"){
                  navigate('/depreciation/list?type=1');
                }else if(type === "3"){
                  navigate('/depreciation/ListChiPhiChung?type=3');
                }else{
                  navigate('/depreciation/listChiPhiTraTruoc?type=2');
                }
              }else{
                dispatch(showToast({ ...listToast[2], detail: response.data.message }))
              }
          } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      }
  };
    useEffect(()=>{
       if(id){
          showDepreciation({id:id}).then(res=>{
              const detail = res.data.data
              if(detail){
                let info = {
                  ...detail, status: detail.status === 0 ? true : false,
                };
                setInfos(info)
              }
          }).catch(err => {
            //setHasError(true)
        });
       }
    },[])
    return (
      <>
        <AddForm
          className="w-full"
          style={{ margin: "0 auto" }}
          checkId={infos.id}
          title={typeDepreciation.find((x) => x.type.toString() === type)?.name || "Thêm khấu hao"}
          loading={loading}
          onSubmit={handleSubmit}
          routeList={type === "1" ? "/depreciation/list?type=1" : type === "3" ? "/depreciation/ListChiPhiChung?type=3" : "/depreciation/listChiPhiTraTruoc?type=2"}
          route={Number(id) ? "/depreciation/update" : "/depreciation/create"}
        >
           <div className="field">
               <Panel header="Chi tiết khấu hao">
            <div className="formgrid grid">
              <div className="field col-1">
                <InputForm
                  className="w-full"
                  id="CodeNumber"
                  value={newTaiSan.CodeNumber}
                  onChange={(e: any) =>
                    setNewTaiSan({ ...newTaiSan, CodeNumber: e.target.value })
                  }
                  label="Mã khấu hao"
                />
              </div>
               <div className="field col-2">
                <InputForm
                  className="w-full"
                  id="Name"
                  value={newTaiSan.Name}
                  onChange={(e: any) =>
                    setNewTaiSan({ ...newTaiSan, Name: e.target.value })
                  }
                  label="Tên khấu hao"
                />
              </div>
              <div className="field col-2">
                <InputForm
                  className="w-full"
                  id="OriginalCost"
                  value={Helper.formatCurrency(newTaiSan.OriginalCost)}
                  onChange={(e: any) =>
                    setNewTaiSan({ ...newTaiSan, OriginalCost: e.target.value ,MonthlyDepreciation: newTaiSan.UsefulLife && e.target.value ? Math.round(Number(e.target.value.toString().replaceAll(".", "")) / Number(newTaiSan.UsefulLife)) : 0 })
                  }
                  label="Giá trị gốc"
                />
              </div>
              <div className="field col-2">
                <InputForm
                  className="w-full"
                  type="number"
                  id="UsefulLife"
                  value={newTaiSan.UsefulLife}
                  onChange={(e: any) =>
                    setNewTaiSan({ ...newTaiSan, UsefulLife: e.target.value ,MonthlyDepreciation: newTaiSan.OriginalCost && e.target.value ? Math.round(Number(newTaiSan.OriginalCost.toString().replaceAll(".", "")) / Number(e.target.value)) : 0 })
                  }
                  label="Thời gian sử dụng"
                />
              </div>
              <div className="field col-2">
                <InputForm
                  className="w-full"
                  id="MonthlyDepreciation"
                  value={Helper.formatCurrency(newTaiSan.MonthlyDepreciation.toString())}
                  disabled={true}
                  label="Khấu hao hàng tháng"
                />
              </div>
               <div className="field col-2">
                <InputForm
                  className="w-full"
                  id="Note"
                  value={newTaiSan.Note}
                  onChange={(e: any) =>
                    setNewTaiSan({ ...newTaiSan, Note: e.target.value })
                  }
                  label="Ghi chú"
                />
              </div>
              <div className="field col-1">
                <Button
                  type="button"
                  className="w-full p-button-normal"
                  label="Thêm"
                  severity="success"
                  raised
                  onClick={() => {
                    if (!newTaiSan.CodeNumber || !newTaiSan.Name || !newTaiSan.OriginalCost || !newTaiSan.UsefulLife || !newTaiSan.MonthlyDepreciation)
                    return dispatch(showToast({ ...listToast[2], detail: "Nhập đủ thông tin mua hàng" }));
                    newTaiSan.OriginalCost = Number(newTaiSan.OriginalCost.toString().replaceAll(".", ""));
                    newTaiSan.MonthlyDepreciation = Number(newTaiSan.MonthlyDepreciation.toString().replaceAll(".", ""));
                    newTaiSan.UsefulLife = Number(newTaiSan.UsefulLife);
                    setProductTaiSan([...productTaiSan, newTaiSan]);
                    setNewTaiSan({CodeNumber:"", Name: "", OriginalCost: 0,UsefulLife:0,MonthlyDepreciation:0,Note:"" }); 
                  }}
                />
              </div>
            </div>

            <div className="child-table">
              <DataTable rowHover value={productTaiSan}>
                <Column field="CodeNumber" header="Mã khấu hao" />
                <Column field="Name" header="Tên khấu hao" />
                <Column field="OriginalCost" body={(rowData: any) => Helper.formatCurrency(rowData.OriginalCost.toString())} header="Giá trị gốc" />
                <Column field="UsefulLife" header="Thời gian sử dụng" />
                <Column field="MonthlyDepreciation" body={(rowData: any) => Helper.formatCurrency(rowData.MonthlyDepreciation.toString())}  header="Khấu hao hàng tháng" />
                <Column field="Note" header="Ghi chú" />
                <Column
                  header="Thao tác"
                  body={(_: any, opt: any) => (
                    <Button
                      type='button'
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      onClick={() =>
                        setProductTaiSan(productTaiSan.filter((_, i) => i !== opt.rowIndex))
                      }
                    />
                  )}
                />
              </DataTable>
            </div>
          </Panel>
           </div>
        </AddForm>
      </>
    );
}
