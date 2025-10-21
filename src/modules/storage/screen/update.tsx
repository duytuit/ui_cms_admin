
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, FormInput, InputSwitch, InputTextarea, Panel } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { listToast, scrollToTop, refreshObject } from "utils";
import { useDispatch } from "react-redux";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { addStorage, listStorage, showStorage, updateStorage } from "../api";
const UpdateStorages = () => {
  const { handleParamUrl} = useHandleParamUrl(); 
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [infos, setInfos] = useState<any>({type:CategoryEnum.country});
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
          const response = await updateStorage(info);
          if (response) setLoading(false);
          if (response.status === 200) {
              // navigate('/categories');
              dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      } else {
          const response = await addStorage(info);
          if (response) setLoading(false);
          if (response.status === 200) {
              if(response.data.status){
                setInfos({ ...refreshObject(infos), status: true })
                dispatch(showToast({ ...listToast[0], detail: response.data.message }));
                navigate('/storage/list');
              }else{
                dispatch(showToast({ ...listToast[2], detail: response.data.message }))
              }
          } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      }
  };
    useEffect(()=>{
       if(id){
          showStorage({id:id,type:CategoryEnum.country}).then(res=>{
              const detail = res.data.data?.rows[0]
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
          title="Dữ liệu"
          loading={loading}
          onSubmit={handleSubmit}
          routeList="/storage/list"
          route={Number(id) ? "/storage/update" : "/storage/create"}
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
                Tên
              </label>
              <div className="col-12 md:col-9">
                <InputForm className="w-full"
                  id="name"
                  value={infos.name}
                  onChange={(e: any) =>
                    setInfos({ ...infos, name: e.target.value })
                  }
                  label="Tên"
                  required
                />
              </div>
            </div>
            <div className="field grid">
              <label
                htmlFor="remark"
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

export default UpdateStorages;