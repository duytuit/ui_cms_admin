
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Panel } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { listToast, scrollToTop, refreshObject, tinhChat, loaiToKhai, loaiHang, nghiepVu, phatSinh } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { addContractFile, listContractFile, updateContractFile } from "../api";
import { Calendar, Dropdown, MultiSelect } from "components/common/ListForm";
import { MyCalendar } from "components/common/MyCalendar";
import { classNames } from "primereact/utils";
import { useListPartner, useListPartnerDetail } from "modules/partner/service";
import { useListEmployee } from "modules/employee/service";
export default function UpdateContractFile () {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({ feature:0 ,declaration_type:0,type:0,business:0,occurrence:0,DeclarationQuantity:1});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    let info = {
      ...infos, status: infos.status ? 0 : 1,
    };
    console.log('info', info);

    setLoading(true);
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
    if (info.id) {
      const response = await updateContractFile(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          navigate('/ContractFile/list');
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    } else {
      const response = await addContractFile(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          setInfos({ ...refreshObject(infos), status: true })
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          navigate('/ContractFile/list');
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    }
  };
   const { data: partnerDetails } = useListPartnerDetail({
    params: { status: 1 },// lấy danh sách khách hàng
    debounce: 500,
  });
  const { data: employees } = useListEmployee({
    params: { keyword: "abc" },
    debounce: 500,
  });
 // --- chuyển sang options bằng useMemo ---
const partnerOptions = useMemo(() => {
  if (!Array.isArray(partnerDetails.data)) return [];
  return partnerDetails.data.map((x: any) => ({
    label: x?.partners?.abbreviation ?? "(không tên)",
    value: x.id,
  }));
}, [partnerDetails]);

const employeeOptions = useMemo(() => {
   if (!Array.isArray(employees.data)) return [];
  return employees.data.map((x: any) => ({
    label: `${x.last_name ?? ""} ${x.first_name ?? ""}`.trim(),
    value: x.id,
  }));
}, [employees]);
  useEffect(() => {
    if (id) {
      listContractFile({ id: id, type: CategoryEnum.country }).then(res => {
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
        title="theo dõi số file"
        loading={loading}
        onSubmit={handleSubmit}
        routeList="/ContractFile/list"
        route={Number(id) ? "/ContractFile/update" : "/ContractFile/add"}
      >
        <div className="field">
          <Panel header="Thông tin">
            <div className="formgrid grid">
                <div className="field col-12">
                    <InputForm className="w-full"
                      id="FileNumber"
                      value={infos.FileNumber}
                      onChange={(e: any) =>
                        setInfos({ ...infos, FileNumber: e.target.value })
                      }
                      label="Số file"
                      required
                    />
                </div>
                <div className="field col-2">
                    <MyCalendar dateFormat="dd/mm/yy" 
                      onChange={(e: any) =>
                        setInfos({ ...infos, AccountingDate: e.target.value })
                      } 
                      className={classNames("w-full","p-inputtext","input-form-sm")}/>
                </div>
                <div className="field col-2">
                    <InputForm className="w-full"
                      id="Declaration"
                      value={infos.Declaration}
                      onChange={(e: any) =>
                        setInfos({ ...infos, Declaration: e.target.value })
                      }
                      label="Số tờ khai"
                      required
                    />
                </div>
                 <div className="field col-2">
                   <Dropdown
                      value={infos.feature}
                      optionValue="feature"
                      optionLabel="name"
                      options={tinhChat}
                      label="Chọn tính chất"
                      className="p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, feature: e.target.value })
                      }
                      required
                    />
                </div>
                 <div className="field col-2">
                    <InputForm className="w-full"
                      id="bill"
                      value={infos.bill}
                      onChange={(e: any) =>
                        setInfos({ ...infos, bill: e.target.value })
                      }
                      label="Số bill"
                      required
                    />
                </div>
                <div className="field col-2">
                    <InputForm className="w-full"
                      id="quantity"
                      value={infos.quantity}
                      onChange={(e: any) =>
                        setInfos({ ...infos, quantity: e.target.value })
                      }
                      label="Số lượng"
                      required
                    />
                </div>
                <div className="field col-2">
                    <InputForm className="w-full"
                      id="ContainerCode"
                      value={infos.ContainerCode}
                      onChange={(e: any) =>
                        setInfos({ ...infos, ContainerCode: e.target.value })
                      }
                      label="Số cont"
                      required
                    />
                </div>
                 <div className="field col-12">
                    <Dropdown
                      filter
                      value={infos.PartnerDetailId}
                      options={partnerOptions}
                      onChange={(e: any) =>
                                setInfos({ ...infos, PartnerDetailId: e.target.value })
                              }
                      label="Khách hàng"
                      className="w-full"
                      required
                    />
                </div>
                 <div className="field col-2">
                    <InputForm className="w-full"
                      id="Sales"
                      value={infos.Sales}
                      onChange={(e: any) =>
                        setInfos({ ...infos, Sales: e.target.value })
                      }
                      label="Tên sales"
                      required
                    />
                </div>
                 <div className="field col-2">
                    <InputForm className="w-full"
                      id="DeclarationQuantity"
                      type="number"
                      min={1}
                      value={infos.DeclarationQuantity}
                      onChange={(e: any) => {
                        let v = Number(e.target.value);
                        if (v < 0) v = 1;
                        setInfos({ ...infos, DeclarationQuantity: v });
                      }}
                      label="Số lượng tờ khai"
                      required
                    />
                </div>
                 <div className="field col-2">
                    <Dropdown
                      value={infos.DeclarationType}
                      optionValue="declaration_type"
                      optionLabel="name"
                      options={loaiToKhai}
                      label="Loại tờ khai"
                      className="p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, DeclarationType: e.target.value })
                      }
                      required
                    />
                </div>
                 <div className="field col-2">
                     <Dropdown
                      value={infos.type}
                      optionValue="type"
                      optionLabel="name"
                      options={loaiHang}
                      label="Loại hàng"
                      className="p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, type: e.target.value })
                      }
                      required
                    />
                </div>
                 <div className="field col-2">
                    <Dropdown
                      value={infos.business}
                      optionValue="business"
                      optionLabel="name"
                      options={nghiepVu}
                      label="Nghiệp vụ"
                      className="p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, business: e.target.value })
                      }
                      required
                    />
                </div>
                 <div className="field col-2">
                     <Dropdown
                      value={infos.occurrence}
                      optionValue="occurrence"
                      optionLabel="name"
                      options={phatSinh}
                      label="Phát sinh"
                      className="p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, occurrence: e.target.value })
                      }
                      required
                    />
                </div>
                 <div className="field col-12">
                      <MultiSelect
                        value={infos.EmployeeIds} 
                        onChange={(e:any) => setInfos({ ...infos, EmployeeIds: e.value })}
                        options={employeeOptions}
                        optionLabel="label"
                        optionValue="value"
                        filter
                        label="Tên giao nhận"
                        className="w-full"
                      />
                </div>
                 <div className="field col-12">
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
          </Panel>
        </div>
      </AddForm>
    </>
  );
}