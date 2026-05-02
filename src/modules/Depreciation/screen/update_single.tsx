
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { InputSwitch, Panel } from "components/uiCore";
import { addDepreciation, showDepreciation, updateDepreciation } from "../api";
import { Helper } from "utils/helper";
export default function UpdateSingleDepreciation() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    const [loading, setLoading] = useState(false);
    const [infos, setInfos] = useState<any>({type:CategoryEnum.country,isExternalDriver:0,  status: 0});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = (e:any) => {
        e.preventDefault();
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
          showDepreciation({id:id,type:CategoryEnum.country}).then(res=>{
              const detail = res.data.data
              if(detail){
                let info = {
                  ...detail
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
          title="sửa thông tin"
          loading={loading}
          onSubmit={handleSubmit}
          routeList={type === "1" ? "/depreciation/list?type=1" : type === "3" ? "/depreciation/ListChiPhiChung?type=3" : "/depreciation/listChiPhiTraTruoc?type=2"}
          route={Number(id) ? "/depreciation/update" : "/depreciation/create"}
        >
          <div className="field">
            <Panel header="Thông tin">
              <div className="flex justify-content-center">
                <div
                  style={{ backgroundColor: "#f8f9fa" }}
                  className="card col-6"
                >
                  <div className="field grid">
                    <label
                      htmlFor="codeNumber"
                      className="col-12 mb-2 md:col-3 md:mb-0"
                    >
                      Mã Khấu hao
                    </label>
                    <div className="col-12 md:col-9">
                      <InputForm
                        className="w-full"
                        id="codeNumber"
                        value={infos.codeNumber}
                        onChange={(e: any) =>
                          setInfos({ ...infos, codeNumber: e.target.value })
                        }
                        label="Mã Khấu hao"
                        required
                      />
                    </div>
                  </div>
                  <div className="field grid">
                    <label
                      htmlFor="name"
                      className="col-12 mb-2 md:col-3 md:mb-0"
                    >
                      Tên Khấu Hao
                    </label>
                    <div className="col-12 md:col-9">
                      <InputForm
                        className="w-full"
                        id="name"
                        value={infos.name}
                        onChange={(e: any) =>
                          setInfos({ ...infos, name: e.target.value })
                        }
                        label="Tên Khấu Hao"
                        required
                      />
                    </div>
                  </div>
                  <div className="field grid">
                    <label
                      htmlFor="originalCost"
                      className="col-12 mb-3 md:col-3 md:mb-0"
                    >
                      Giá trị gốc
                    </label>
                    <div className="col-12 md:col-9">
                      <InputForm
                        className="w-full"
                        id="originalCost"
                        value={Helper.formatCurrency(
                          (infos.originalCost || 0).toString(),
                        )}
                        onChange={(e: any) =>
                          setInfos({
                            ...infos,
                            originalCost: e.target.value,
                            monthlyDepreciation:
                              infos.usefulLife && e.target.value
                                ? Math.round(
                                    Number(
                                      e.target.value
                                        .toString()
                                        .replaceAll(".", ""),
                                    ) / Number(infos.usefulLife),
                                  )
                                : 0,
                          })
                        }
                        label="Giá trị gốc"
                      />
                    </div>
                  </div>
                  <div className="field grid">
                    <label
                      htmlFor="usefulLife"
                      className="col-12 mb-3 md:col-3 md:mb-0"
                    >
                      Thời gian sử dụng
                    </label>
                    <div className="col-12 md:col-9">
                      <InputForm
                        className="w-full"
                        type="number"
                        id="usefulLife"
                        value={infos.usefulLife}
                        onChange={(e: any) =>
                          setInfos({
                            ...infos,
                            usefulLife: e.target.value,
                            monthlyDepreciation:
                              infos.originalCost && e.target.value
                                ? Math.round(
                                    Number(
                                      infos.originalCost
                                        .toString()
                                        .replaceAll(".", ""),
                                    ) / Number(e.target.value),
                                  )
                                : 0,
                          })
                        }
                        label="Thời gian sử dụng"
                      />
                    </div>
                  </div>
                  <div className="field grid">
                    <label
                      htmlFor="monthlyDepreciation"
                      className="col-12 mb-3 md:col-3 md:mb-0"
                    >
                      Khấu hao hàng tháng
                    </label>
                    <div className="col-12 md:col-9">
                      <InputForm
                        className="w-full"
                        id="monthlyDepreciation"
                        value={Helper.formatCurrency(
                          (infos.monthlyDepreciation || 0).toString(),
                        )}
                        disabled={true}
                        label="Khấu hao hàng tháng"
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
                      <InputForm
                        className="w-full"
                        id="note"
                        value={infos.note}
                        onChange={(e: any) =>
                          setInfos({ ...infos, note: e.target.value })
                        }
                        label="Ghi chú"
                      />
                    </div>
                  </div>
                  <div className="field grid">
                    <label
                      htmlFor="status"
                      className="col-12 mb-3 md:col-3 md:mb-0"
                    >
                      Trạng thái
                    </label>
                    <div className="col-12 md:col-9">
                      <InputSwitch
                        id="status"
                        checked={Number(infos.status) === 1}
                        onChange={(e: any) =>
                        {
                           setInfos({ ...infos, status: e.value ? 1 : 0 })
                        }
                        }
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
