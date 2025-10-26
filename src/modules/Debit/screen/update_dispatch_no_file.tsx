
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject, typeDebit } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { addDebit, showDebit, updateDebit } from "../api";
import { Dropdown } from "components/common/ListForm";
import { Panel } from "components/uiCore";
export default function UpdateDebit() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
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
          const response = await updateDebit(info);
          if (response) setLoading(false);
          if (response.status === 200) {
              if(response.data.status){
                dispatch(showToast({ ...listToast[0], detail: response.data.message }));
                navigate('/debit/list');
              }else{
                dispatch(showToast({ ...listToast[2], detail: response.data.message }))
              }
          } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      } else {
          const response = await addDebit(info);
          if (response) setLoading(false);
          if (response.status === 200) {
              if(response.data.status){
                setInfos({ ...refreshObject(infos), status: true })
                dispatch(showToast({ ...listToast[0], detail: response.data.message }));
                navigate('/debit/list');
              }else{
                dispatch(showToast({ ...listToast[2], detail: response.data.message }))
              }
          } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      }
  };
    useEffect(()=>{
       if(id){
          showDebit({id:id,type:CategoryEnum.country}).then(res=>{
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
          title="xe"
          loading={loading}
          onSubmit={handleSubmit}
          routeList="/debit/list"
          route={Number(id) ? "/debit/update" : "/debit/create"}
        >
           <div className="field">
           <Panel header="Thông tin">
            <div className="flex justify-content-center">
            <div style={{ backgroundColor: "#f8f9fa" }} className="card col-6">
              
            <div className="field grid">
              <label
                htmlFor="name"
                className="col-12 mb-2 md:col-3 md:mb-0"
              >
                Biển số xe
              </label>
              <div className="col-12 md:col-9">
                <InputForm className="w-full"
                  id="numberCode"
                  value={infos.numberCode}
                  onChange={(e: any) =>
                    setInfos({ ...infos, numberCode: e.target.value })
                  }
                  label="Biển số xe"
                  required
                />
              </div>
            </div>
            
            <div className="field grid">
              <label
                htmlFor="remark"
                className="col-12 mb-3 md:col-3 md:mb-0"
              >
                Loại xe
              </label>
              <div className="col-12 md:col-9">
                <Dropdown
                    value={infos.isExternalDriver}
                    optionValue="isExternalDriver"
                    optionLabel="name"
                    options={typeDebit}
                    label="Loại xe"
                    className="p-inputtext-sm"
                    onChange={(e: any) =>
                      setInfos({ ...infos, isExternalDriver: e.target.value })
                    }
                  />
              </div>
            </div>
            <div className="field grid">
              <label
                htmlFor="note"
                className="col-12 mb-3 md:col-3 md:mb-0"
              >
                Ghi chú
              </label>
              <div className="col-12 md:col-9">
                <InputForm className="w-full"
                  id="note"
                  value={infos.note}
                  onChange={(e: any) =>
                    setInfos({ ...infos, note: e.target.value })
                  }
                  label="Ghi chú"
                />
              </div>
            </div>
          </div>
            </div>
          </Panel>
           </div>
        </AddForm>
      </>
    );
}
