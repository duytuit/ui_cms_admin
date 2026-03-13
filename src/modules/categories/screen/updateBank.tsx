
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { Panel } from "components/uiCore";
import { addBank, showBank } from "../api";
export default function UpdateBank() {
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
          const response = await addBank(info);
          if (response) setLoading(false);
          if (response.status === 200) {
              if(response.data.status){
                dispatch(showToast({ ...listToast[0], detail: response.data.message }));
                navigate('/bank/list');
              }else{
                dispatch(showToast({ ...listToast[2], detail: response.data.message }))
              }
          } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      } else {
          const response = await addBank(info);
          if (response) setLoading(false);
          if (response.status === 200) {
              if(response.data.status){
                setInfos({ ...refreshObject(infos), status: true })
                dispatch(showToast({ ...listToast[0], detail: response.data.message }));
                navigate('/bank/list');
              }else{
                dispatch(showToast({ ...listToast[2], detail: response.data.message }))
              }
          } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      }
  };
    useEffect(()=>{
       if(id){
          showBank({id:id}).then(res=>{
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
          title="ngân hàng"
          loading={loading}
          onSubmit={handleSubmit}
          routeList="/bank/list"
          route={Number(id) ? "/bank/update" : "/bank/create"}
        >
           <div className="field">
           <Panel header="Thông tin">
            <div className="flex justify-content-center">
            <div style={{ backgroundColor: "#f8f9fa" }} className="card col-6">
            <div className="field grid">
              <label
                htmlFor="accountNumber"
                className="col-12 mb-2 md:col-3 md:mb-0"
              >
                Số tài khoản
              </label>
              <div className="col-12 md:col-9">
                <InputForm className="w-full"
                  id="accountNumber"
                  value={infos.accountNumber}
                  onChange={(e: any) =>
                    setInfos({ ...infos, accountNumber: e.target.value })
                  }
                  label="Số tài khoản"
                  required
                />
              </div>
            </div>
            <div className="field grid">
              <label
                htmlFor="accountHolder"
                className="col-12 mb-2 md:col-3 md:mb-0"
              >
                Tên tài khoản
              </label>
              <div className="col-12 md:col-9">
                <InputForm className="w-full"
                  id="accountHolder"
                  value={infos.accountHolder}
                  onChange={(e: any) =>
                    setInfos({ ...infos, accountHolder: e.target.value })
                  }
                  label="Tên tài khoản"
                  required
                />
              </div>
            </div>
            <div className="field grid">
              <label
                htmlFor="bankName"
                className="col-12 mb-3 md:col-3 md:mb-0"
              >
                Ngân hàng
              </label>
              <div className="col-12 md:col-9">
                <InputForm className="w-full"
                  id="bankName"
                  value={infos.bankName}
                  onChange={(e: any) =>
                    setInfos({ ...infos, bankName: e.target.value })
                  }
                  label="Ngân hàng"
                />
              </div>
            </div>
             <div className="field grid">
              <label
                htmlFor="branchName"
                className="col-12 mb-3 md:col-3 md:mb-0"
              >
                Chi nhánh
              </label>
              <div className="col-12 md:col-9">
                <InputForm className="w-full"
                  id="branchName"
                  value={infos.branchName}
                  onChange={(e: any) =>
                    setInfos({ ...infos, branchName: e.target.value })
                  }
                  label="Chi nhánh"
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
