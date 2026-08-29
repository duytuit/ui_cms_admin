
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { Panel } from "components/uiCore";
import { addWork, showWork, updateWork } from "../api";
import { Helper } from "utils/helper";
import { MyCalendar } from "components/common/MyCalendar";
import { classNames } from "primereact/utils";
export default function UpdateWork() {
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
          const response = await updateWork(info);
          if (response) setLoading(false);
          if (response.status === 200) {
              if(response.data.status){
                dispatch(showToast({ ...listToast[0], detail: response.data.message }));
                navigate('/work/list');
              }else{
                dispatch(showToast({ ...listToast[2], detail: response.data.message }))
              }
          } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      } else {
          const response = await addWork(info);
          if (response) setLoading(false);
          if (response.status === 200) {
              if(response.data.status){
                setInfos({ ...refreshObject(infos), status: true })
                dispatch(showToast({ ...listToast[0], detail: response.data.message }));
                navigate('/work/list');
              }else{
                dispatch(showToast({ ...listToast[2], detail: response.data.message }))
              }
          } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      }
  };
    useEffect(()=>{
       if(id){
          showWork({id:id,type:CategoryEnum.country}).then(res=>{
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
          title="công việc"
          loading={loading}
          onSubmit={handleSubmit}
          routeList="/work/list"
          route={Number(id) ? "/work/update" : "/work/create"}
        >
           <div className="field">
           <Panel header="Thông tin">
              <div className="formgrid grid">
                    <div className="field col-12">
                      <InputForm className="w-full"
                        id="fileNumber"
                        value={infos.fileNumber}
                        label="Tiêu đề"
                        required
                      />
                  </div>
                   <div className="field col-2">
                      <MyCalendar dateFormat="dd/mm/yy"
                        value={Helper.formatDMYLocal(infos.accountingDate ? infos.accountingDate : '')}
                        onChange={(e: any) =>
                          setInfos({ ...infos, accountingDate: e })}
                        className={classNames("w-full", "p-inputtext", "input-form-sm")} />
                    </div>
              </div>
          </Panel>
           </div>
        </AddForm>
      </>
    );
}
