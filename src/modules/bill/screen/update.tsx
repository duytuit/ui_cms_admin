
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Editor from "components/common/Editor";
import { Accordion } from "components/uiCore/panel/Accordion";
import { AccordionTab } from "primereact/accordion";
import { Button, FormInput, InputSwitch, InputTextarea, Panel } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { listToast, scrollToTop, refreshObject } from "utils";
import { updateBill, addBill, listBill } from "../api";
import { useDispatch } from "react-redux";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
const UpdateBill = () => {
  const { handleParamUrl} = useHandleParamUrl(); 
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [infos, setInfos] = useState<any>({});
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
          const response = await updateBill(info);
          if (response) setLoading(false);
          if (response.data.code === 200) {
              // navigate('/bill');
              dispatch(showToast({ ...listToast[0], detail: 'Cập nhật thành công!' }));
          } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
      } else {
          const response = await addBill(info);
          if (response) setLoading(false);
          if (response.data.code === 200) {
              scrollToTop();
              setInfos({ ...refreshObject(infos), status: true })
              dispatch(showToast({ ...listToast[0], detail: 'Thêm thành công!' }));
          } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
      }
  };
    useEffect(()=>{
       if(id){
          listBill({id:id}).then(res=>{
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
          title="Quốc gia"
          loading={loading}
          onSubmit={handleSubmit}
          routeList="/bill/list"
          route={Number(id) ? "/bill/update" : "/bill/add"}
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
                  id="remark"
                  value={infos.remark}
                  onChange={(e: any) =>
                    setInfos({ ...infos, remark: e.target.value })
                  }
                  label="Ghi chú"
                />
              </div>
            </div>
            <div className="field grid">
              <label
                htmlFor="desc"
                className="col-12 mb-3 md:col-3 md:mb-0"
              >
                Mô tả
              </label>
              <div className="col-12 md:col-9">
              <span className="p-float-label">
                <InputTextarea id="desc" value={infos.desc}  onChange={(e: any) =>
                    setInfos({ ...infos, desc: e.target.value })
                  }  rows={5} cols={30} className="w-full"  />
                <label htmlFor="desc">Mô tả</label>
            </span>
              </div>
            </div>
            <div className="field grid">
              <label
                htmlFor="status"
                className="col-12 mb-2 md:col-3 md:mb-0"
              >
                Trạng thái
              </label>
              <div className="col-12 md:col-9">
              <InputSwitch checked={infos.status}  onChange={(e: any) => setInfos({ ...infos, status: e.target.value })}/>
              </div>
            </div>
          </div>
            </div>
          </Panel>
           </div>
          <div className="field">
            <Button
              type="button"
              label="Thêm Section"
              severity="secondary"
              size="small"
              outlined
            />
          </div>
          <Accordion activeIndex={0}>
            <AccordionTab header="Section 1">
              <div
                style={{ backgroundColor: "#f8f9fa" }}
                className="card p-fluid"
              >
                <h5>Vertical Grid</h5>
                <div className="formgrid grid">
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput
                      id="email2"
                      type="text"
                      label="email2"
                    />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput
                      id="email2"
                      type="text"
                      label="email2"
                    />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput
                      id="email2"
                      type="text"
                      label="email2"
                    />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput
                      id="email2"
                      type="text"
                      label="email2"
                    />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput
                      id="email2"
                      type="text"
                      label="email2"
                    />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput
                      id="email2"
                      type="text"
                      label="email2"
                    />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput
                      id="email2"
                      type="text"
                      label="email2"
                    />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput
                      id="email2"
                      type="text"
                      label="email2"
                    />
                  </div>
                </div>
              </div>
              <Editor data={""} setData={""} className="w-full" />
            </AccordionTab>
          </Accordion>
        </AddForm>
      </>
    );
}

export default UpdateBill;