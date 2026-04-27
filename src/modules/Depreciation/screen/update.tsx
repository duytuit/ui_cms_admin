
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { Button, Checkbox, Column, DataTable, Dropdown, Panel } from "components/uiCore";
import { addDepreciation, showDepreciation, updateDepreciation } from "../api";
import { Helper } from "utils/helper";
import { Input } from "components/common/ListForm";
export default function UpdateDepreciation() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [productTaiSan, setProductTaiSan] = useState<any[]>([]);
    const [newTaiSan, setNewTaiSan] = useState<any>({CodeNumber:"", Name: "", OriginalCost: 0,UsefulLife:0,MonthlyDepreciation:0,Note:"" });
    const [infos, setInfos] = useState<any>({type:CategoryEnum.country,isExternalDriver:0});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = (e:any) => {
        e.preventDefault();
        let info = {
          ...infos, status: infos.status ? 0 : 1,
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
                navigate('/depreciation/list');
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
                navigate('/depreciation/list');
              }else{
                dispatch(showToast({ ...listToast[2], detail: response.data.message }))
              }
          } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      }
  };
    useEffect(()=>{
       if(id){
          showDepreciation({id:id,type:CategoryEnum.country}).then(res=>{
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
          title="tài sản"
          loading={loading}
          onSubmit={handleSubmit}
          routeList="/depreciation/list"
          route={Number(id) ? "/depreciation/update" : "/depreciation/create"}
        >
           <div className="field">
               <Panel header="Chi tiết tài sản">
            <div className="formgrid grid">
              <div className="field col-1">
                <InputForm
                  className="w-full"
                  id="CodeNumber"
                  value={newTaiSan.CodeNumber}
                  onChange={(e: any) =>
                    setNewTaiSan({ ...newTaiSan, CodeNumber: e.target.value })
                  }
                  label="Mã tài sản"
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
                  label="Tên tài sản"
                />
              </div>
              <div className="field col-2">
                <InputForm
                  className="w-full"
                  id="OriginalCost"
                  value={Helper.formatCurrency(newTaiSan.OriginalCost)}
                  onChange={(e: any) =>
                    setNewTaiSan({ ...newTaiSan, OriginalCost: e.target.value })
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
                    setNewTaiSan({ ...newTaiSan, UsefulLife: e.target.value })
                  }
                  label="Thời gian sử dụng"
                />
              </div>
              <div className="field col-2">
                <InputForm
                  className="w-full"
                  id="MonthlyDepreciation"
                  value={Helper.formatCurrency(newTaiSan.MonthlyDepreciation)}
                  onChange={(e: any) =>
                    setNewTaiSan({ ...newTaiSan, MonthlyDepreciation: e.target.value })
                  }
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
                    setProductTaiSan([...productTaiSan, newTaiSan]);
                    setNewTaiSan({CodeNumber:"", Name: "", OriginalCost: 0,UsefulLife:0,MonthlyDepreciation:0,Note:"" }); 
                  }}
                />
              </div>
            </div>

            <div className="child-table">
              <DataTable rowHover value={productTaiSan}>
                <Column field="CodeNumber" header="Mã tài sản" />
                <Column field="Name" header="Tên tài sản" />
                <Column field="OriginalCost" header="Giá trị gốc" />
                <Column field="UsefulLife" header="Thời gian sử dụng" />
                <Column field="MonthlyDepreciation" header="Khấu hao hàng tháng" />
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
