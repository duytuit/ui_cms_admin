
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Panel } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { listToast, scrollToTop, refreshObject, tinhChat, loaiToKhai, loaiHang, nghiepVu, phatSinh } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { addContractFile, getCodeContractFile, listContractFile, showContractFile, updateContractFile } from "../api";
import { Calendar, Dropdown, MultiSelect } from "components/common/ListForm";
import { MyCalendar } from "components/common/MyCalendar";
import { classNames } from "primereact/utils";
import { useListPartner, useListPartnerDetail } from "modules/partner/service";
import { useListEmployee } from "modules/employee/service";
import { Helper } from "utils/helper";
export default function UpdateContractFile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({
    feature: 0, DeclarationType: 0, type: 0,
    business: 0, occurrence: 0, DeclarationQuantity: 1,
    sales:"",employeeIds:[],accountingDate:Helper.toDayString()
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
    // ===== LIST PARTNER & EMPLOYEE =====
  const { data: partnerDetails } = useListPartnerDetail({ params: { status: 1 }, debounce: 500 });
  const { data: employees } = useListEmployee({ params: { keyword: "abc" }, debounce: 500 });

  const partnerOptions = useMemo(() => {
    if (!Array.isArray(partnerDetails?.data)) return [];
    return partnerDetails.data.map((x: any) => ({
      label: x?.partners?.abbreviation ?? "(không tên)",
      value: x.id,
    }));
  }, [partnerDetails]);

  const employeeOptions = useMemo(() => {
    if (!Array.isArray(employees?.data)) return [];
    return employees.data.map((x: any,index:number) => ({
      label: `${index+1}.${x.last_name ?? ""} ${x.first_name ?? ""}`.trim(),
      value: x.id,
    }));
  }, [employees]);
  // ===== FETCH DETAIL LÚC EDIT =====
  useEffect(() => {
    getCode(0);
    if (!id) return;
    setLoading(true);
    showContractFile({ id: id, type: CategoryEnum.country })
      .then(res => {
        const detail = res.data.data;
        if (detail) {
           const _employeeIds = detail.fileInfoDetails.map((x:any)=> { return x.employeeId} )
           detail.employeeIds = _employeeIds
          setInfos({
            ...detail,
            status: detail.status === 0 ? true : false,
          });
        }
      })
    .finally(() => setLoading(false));

  }, []);

  // ===== SUBMIT =====
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const infoSubmit = {
      ...infos,
      status: infos.status ? 0 : 1,
    };
    setLoading(true);
    fetchDataSubmit(infoSubmit);
  };

  async function fetchDataSubmit(info: any) {
    const api = info.id ? updateContractFile : addContractFile;
    const response = await api(info);
    if (response) setLoading(false);

    if (response?.status === 200) {
      if (response.data.status) {
        if (!info.id) setInfos({ ...refreshObject(infos), status: true });
        dispatch(showToast({ ...listToast[0], detail: response.data.message }));
        navigate('/ContractFile/list');
      } else {
        dispatch(showToast({ ...listToast[2], detail: response.data.message }));
      }
    } else {
      dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    }
  }

  async function getCode(value:number) {
    if (!id){
      getCodeContractFile({type: value == 0 ? "IS":"ES"}).then(res => {
          const detail = res.data.data;
          if (detail) {
            setInfos({ ...infos, fileNumber:detail.extra.code,feature:value});
          }
        })
    }
     
  }

  // ===== LOADING SCREEN =====
  if (loading) return (<></>);
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
                  id="fileNumber"
                  value={infos.fileNumber}
                  label="Số file"
                  disabled
                  required
                />
              </div>
              <div className="field col-2">
                <MyCalendar dateFormat="dd/mm/yy"
                  value={Helper.formatDMYLocal(infos.accountingDate ? infos.accountingDate : '')} // truyền nguyên ISO string
                  onChange={(e: any) =>
                    setInfos({ ...infos, accountingDate: e })}
                  className={classNames("w-full", "p-inputtext", "input-form-sm")} />
              </div>
              <div className="field col-2">
                <InputForm className="w-full"
                  id="declaration"
                  value={infos.declaration}
                  onChange={(e: any) =>
                    setInfos({ ...infos, declaration: e.target.value })
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
                    {
                      getCode(e.value);
                     // setInfos({ ...infos, feature: e.target.value });
                    }
                  }
                  disabled={id ? true : false}
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
                  id="containerCode"
                  value={infos.containerCode}
                  onChange={(e: any) =>
                    setInfos({ ...infos, containerCode: e.target.value })
                  }
                  label="Số cont"
                />
              </div>
              <div className="field col-12">
                <Dropdown
                  filter
                  value={infos.partnerDetailId}
                  options={partnerOptions}
                  onChange={(e: any) =>
                    setInfos({ ...infos, partnerDetailId: e.target.value })
                  }
                  label="Khách hàng"
                  className="w-full"
                  required
                />
              </div>
              <div className="field col-2">
                <InputForm 
                  id="sales"
                  value={infos.sales}
                  onChange={(e: any) =>
                    setInfos({ ...infos, sales: e.target.value })
                  }
                  className="w-full"
                  label="Tên sales"
                />
              </div>
              <div className="field col-2">
                <InputForm className="w-full"
                  id="declarationQuantity"
                  type="number"
                  min={1}
                  value={infos.declarationQuantity}
                  onChange={(e: any) => {
                    let v = Number(e.target.value);
                    if (v < 0) v = 1;
                    setInfos({ ...infos, declarationQuantity: v });
                  }}
                  label="Số lượng tờ khai"
                  required
                />
              </div>
              <div className="field col-2">
                <Dropdown
                  value={infos.declarationType}
                  optionValue="DeclarationType"
                  optionLabel="name"
                  options={loaiToKhai}
                  label="Loại tờ khai"
                  className="p-inputtext-sm"
                  onChange={(e: any) =>
                    setInfos({ ...infos, declarationType: e.target.value })
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
                  value={infos.employeeIds}
                  onChange={(e: any) => setInfos({ ...infos, employeeIds: e.value })}
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