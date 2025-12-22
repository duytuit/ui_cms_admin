
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, loaiToKhai, refreshObject, typeDebit, typeVehicle } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { addDebit, ShowWithFileInfoAsync, updateDebit } from "../api";
import { showContractFile } from "modules/ContractFile/api";
import { Panel } from "components/uiCore";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { classNames } from "primereact/utils";
import { Dropdown } from "components/common/ListForm";
import { useListEmployeeWithState } from "modules/employee/service";
import { useListPartnerDetail } from "modules/partner/service";
import { useListVehicleWithState } from "modules/VehicleDispatch/service";
export default function UpdateDebitDispatchFile({ id, onClose , type }: { id: any; onClose: () => void ,type?:number}) {
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({isExternalDriver:1});
  const dispatch = useDispatch();
  const navigate = useNavigate();
     // ===== LIST PARTNER & EMPLOYEE =====
    const { data: partnerDetails } = useListPartnerDetail({ params: { status: 1 }, debounce: 500 });
    const { data: partnerVenderDetails } = useListPartnerDetail({ params: { status: 2 }, debounce: 500 });
    const { data: vehicles } = useListVehicleWithState({});
    const { data: employees } = useListEmployeeWithState({});
    // lấy ra nhân viên lái xe với departmentid = 1
    const driverOptions = useMemo(() => {
      if (!Array.isArray(employees)) return [];

      return employees.filter((x: any) =>
          Array.isArray(x.employee_departments) &&
          x.employee_departments[0]?.department_id === 1
        )
        .map((x: any, index: number) => ({
          label: `${index + 1}. ${x.last_name ?? ""} ${x.first_name ?? ""}`.trim(),
          value: x.id,
        }));
    }, [employees]);
    const vehiclesOptions = useMemo(() => {
      if (!Array.isArray(vehicles)) return [];
      return vehicles.map((x: any) => ({
        label: `${x?.number_code ?? "(không tên)"}`,
        value: x.id,
      }));
    }, [vehicles]);
    const partnerOptions = useMemo(() => {
      if (!Array.isArray(partnerDetails?.data)) return [];
      return partnerDetails.data.map((x: any) => ({
        label: x?.partners?.abbreviation ?? "(không tên)",
        value: x.id,
      }));
    }, [partnerDetails]);

    const partnerVenderOptions = useMemo(() => {
      if (!Array.isArray(partnerVenderDetails?.data)) return [];
      return partnerVenderDetails.data.map((x: any) => ({
        label: x?.partners?.abbreviation ?? "(không tên)",
        value: x.id,
      }));
    }, [partnerVenderDetails]);
  
    const employeeOptions = useMemo(() => {
      if (!Array.isArray(employees?.data)) return [];
      return employees.data.map((x: any,index:number) => ({
        label: `${index+1}.${x.last_name ?? ""} ${x.first_name ?? ""}`.trim(),
        value: x.id,
      }));
    }, [employees]);
 function getTypeVehicleLabel(type: number){
  const item = typeVehicle.find((x: any) => x.isExternalDriver === type);
  return item?.name ?? "";
};
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // lưu lại thông thông label của tất cả các dropdown
    infos.driverFee      = toInt(infos.driverFee);
    infos.customsStatus  = toInt(infos.customsStatus);
    infos.purchasePrice  = toInt(infos.purchasePrice);
    infos.price          = toInt(infos.price);
    infos.mealFee        = toInt(infos.mealFee);
    infos.ticketFee      = toInt(infos.ticketFee);
    infos.overnightFee   = toInt(infos.overnightFee);
    infos.penaltyFee     = toInt(infos.penaltyFee);
    infos.goodsFee       = toInt(infos.goodsFee);
    infos.fileInfoId= type == 0? infos.id :infos.fileInfo?.id;
    infos.data = JSON.stringify(infos);
    infos.vehicleNumber = infos.isExternalDriver === 0 ? infos?.vehicle_info?.vehicleLabel : infos.vehicleNumber
    infos.vehicleId = infos.isExternalDriver === 0 ? infos?.vehicle_info?.vehicleId : null
    let info = {
      ...infos, status: infos.status ? 0 : 1,
    };
   
    setLoading(true);
    fetchDataSubmit(info);
  };
  const toInt = (v: any) =>
  v == null
    ? 0
    : typeof v === "number"
    ? v
    : parseInt(String(v).replace(/\D/g, ""), 10) || 0;
  async function fetchDataSubmit(info: any) {
    if (info.id && type == 0) {
      const response = await addDebit(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          setInfos({ ...refreshObject(infos), status: true })
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          onClose();
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    }
     if (info.id && type == 1) {
      const response = await updateDebit(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          setInfos({ ...refreshObject(infos), status: true })
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          onClose();
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    }
  };
  useEffect(() => {
    if (!id) return;
    if (partnerOptions.length === 0) return;  // ✅ quan trọng
    if (id && type == 0) {
      setLoading(true);
      showContractFile({ id: id, type: CategoryEnum.country }).then(res => {
        const detail = res.data.data
        if (detail) {
           const _loaiToKhai = loaiToKhai.find( (x: any) => x.DeclarationType === detail.declarationType);
             const partner = partnerOptions.find((x:any)=>x.value == detail.customerDetailId)
             detail.partnerName = partner?.label
             console.log(detail);
             detail.serviceDate = detail.accountingDate;
          let info = {
            ...detail, status: detail.status === 0 ? true : false,
            loaiToKhai:_loaiToKhai?.name,
            isExternalDriver:1
          };
          setInfos(info)
        }
      }).catch(err => {
        //setHasError(true)
      }).finally(() => setLoading(false));
    }
     if (id && type == 1) {
      setLoading(true);
      ShowWithFileInfoAsync({ id: id, type: CategoryEnum.country }).then(res => {
        const detail = res.data.data
        if (detail) {
          const partner = partnerOptions.find((x:any)=>x.value == detail.customerDetailId)
          const _loaiToKhai = loaiToKhai.find( (x: any) => x.DeclarationType === detail.fileInfo?.declarationType);
          detail.partnerName = partner?.label;
          detail.route = detail.name;
          detail.fileNumber = detail.fileInfo?.fileNumber;
          detail.declaration = detail.fileInfo?.declaration;
          detail.bill = detail.fileInfo?.bill;
          detail.quantity = detail.fileInfo?.quantity;
          detail.containerCode = detail.fileInfo?.containerCode;
          detail.isExternalDriver = detail.vehicleId > 0 ? 0 : 1;
          let info = {
            ...detail, status: detail.status === 0 ? true : false, loaiToKhai:_loaiToKhai?.name
          };
          console.log(info);
          setInfos(info)
        }
      }).catch(err => {
        //setHasError(true)
      }).finally(() => setLoading(false));
    }
  }, [id, partnerOptions, driverOptions, vehiclesOptions, partnerVenderOptions]);
  return (
    <>
      <AddForm
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        title="xe"
        loading={loading}
        onSubmit={handleSubmit}
        route={Number(id) ? "/debit/update" : "/debit/create"}
      >
        <div className="field">
          <Panel header="Thông tin số file">
            <table className="w-full">
              <tbody>
                {/* --- HÀNG 1 --- */}
                <tr>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Khách hàng:</label>
                      <span>{infos.partnerName}</span>
                    </div>
                  </td>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Số tờ khai:</label>
                      <span>{infos.declaration}</span>
                    </div>
                  </td>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Số bill:</label>
                      <span>{infos.bill}</span>
                    </div>
                  </td>
                </tr>
                {/* --- HÀNG 2 --- */}
                <tr>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Số file:</label>
                      <span>{infos.fileNumber}</span>
                    </div>
                  </td>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Số Cont:</label>
                      <span>{infos.containerCode}</span>
                    </div>
                  </td>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                    </div>
                  </td>
                </tr>
                {/* --- HÀNG 3 --- */}
                <tr>
                  <td className="pr-4">
                    <label className="font-medium mr-2">Số Lượng:</label>
                    <span>{infos.quantity}</span>
                  </td>
                  <td className="pr-4">
                    <label className="font-medium mr-2">Loại tờ khai:</label>
                    <span>{infos.loaiToKhai}</span>
                  </td>
                  <td className="pr-4">
                  </td>
                </tr>
              </tbody>
            </table>
          </Panel>
          <Panel header="Thông tin điều xe">
            <div className="formgrid grid">
              <div className="field col-4">
                <MyCalendar dateFormat="dd/mm/yy"
                  value={Helper.formatDMYLocal(infos.serviceDate ? infos.serviceDate : '')} // truyền nguyên ISO string
                  onChange={(e: any) =>
                    setInfos({ ...infos, serviceDate: e })}
                  className={classNames("w-full", "p-inputtext", "input-form-sm")} />
              </div>
               <div className="field col-8">
                <InputForm className="w-full"
                  id="route"
                  value={infos.route}
                  onChange={(e: any) =>
                    setInfos({ ...infos, route: e.target.value })
                  }
                  label="Tuyến vận chuyển"
                  required
                />
              </div>
               <div className="field col-4">
                <InputForm className="w-full"
                  id="customerVehicleType"
                  value={infos.customerVehicleType}
                  onChange={(e: any) =>
                     setInfos({ ...infos, customerVehicleType: e.target.value })
                  }
                  label="Loại xe KH"
                />
              </div>
              <div className="field col-8">
                <InputForm className="w-full"
                  id="supplierVehicleType"
                  value={infos.supplierVehicleType}
                  onChange={(e: any) =>
                    setInfos({ ...infos, supplierVehicleType: e.target.value })
                  }
                  label="Loại xe NCC"
                />
              </div>
               <div className="field col-4">
                <InputForm className="w-full"
                  id="price"
                  value={Helper.formatCurrency(infos.price ? infos.price.toString():'')}
                  onChange={(e: any) =>
                    setInfos({ ...infos, price: e.target.value })
                  }
                  label="Cước bán"
                />
              </div>
               <div className="field col-4">
                <InputForm className="w-full"
                  id="driverFee"
                  value={Helper.formatCurrency(infos.driverFee?infos.driverFee.toString():'')}
                  onChange={(e: any) =>
                    setInfos({ ...infos, driverFee: e.target.value })
                  }
                  label="Lái xe thu cước"
                /> 
              </div>
               <div className="field col-4">
                <InputForm className="w-full"
                  id="customsStatus"
                  value={Helper.formatCurrency(infos.customsStatus?infos.customsStatus.toString():"")}
                  onChange={(e: any) =>
                    setInfos({ ...infos, customsStatus: e.target.value })
                  }
                  label="TTHQ"
                />
              </div>
               <div className="field col-4">
                <InputForm className="w-full"
                  id="purchasePrice"
                  value={Helper.formatCurrency(infos.purchasePrice?infos.purchasePrice.toString():'')}
                  onChange={(e: any) =>
                    setInfos({ ...infos, purchasePrice: e.target.value })
                  }
                  label="Cước mua"
                />
              </div>
               <div className="field col-8">
                <Dropdown
                  filter
                  value={infos.supplierDetailId}
                  options={partnerVenderOptions}
                  onChange={(e: any) =>
                    {
                        const selected = e.value; // Đây là value (ví dụ: 123)
                        const option = partnerVenderOptions.find((x: any) => x.value === selected);
                        setInfos({ ...infos, supplierDetailId: selected, partner_info: {
                          supplierDetailId: selected, partnerLabel: option?.label
                        } })
                    }
                  }
                  label="Nhà cung cấp"
                  className="w-full"
                />
              </div>
               <div className="field col-2">
                <Dropdown
                  value={infos.isExternalDriver}
                  optionValue="isExternalDriver"
                  optionLabel="name"
                  options={typeVehicle}
                  onChange={(e: any) =>
                    {
                        setInfos({ ...infos, isExternalDriver: e.target.value })
                    }
                  }
                  label="Loại xe"
                  className="w-full"
                />
               </div>
                {infos.isExternalDriver == 0 && <div className="field col-2">
                <Dropdown
                  filter
                  value={infos.vehicleId}
                  options={vehiclesOptions}
                  onChange={(e: any) =>
                    {
                        const selected = e.value;
                        const option = vehiclesOptions.find((x: any) => x.value === selected);
                        setInfos({ ...infos, vehicleId: selected, vehicle_info:{
                          vehicleId: selected, vehicleLabel: option?.label
                        } })
                    }
                  }
                  label="Biển số xe"
                  className="w-full"
                />
              </div>}
               {infos.isExternalDriver == 1 && <div className="field col-2">
                  <InputForm className="w-full"
                      id="vehicleNumber"
                      value={infos.vehicleNumber}
                      onChange={(e: any) =>
                        setInfos({ ...infos, vehicleNumber: e.target.value })
                      }
                      label="Biển số xe"
                    />
              </div>}
              
              <div className="field col-8">
                <Dropdown
                  value={infos.employeeDriverId}
                  options={driverOptions}
                  label="lái xe"
                  className="p-inputtext-sm"
                  onChange={(e: any) =>
                     {
                        const selected = e.value;
                        const option = driverOptions.find((x: any) => x.value === selected);
                        setInfos({ ...infos, employeeDriverId: selected, driver_info: {
                          employeeDriverId: selected, driverLabel: option?.label
                        } })
                     }
                  }
                />
              </div>
              <div className="field col-4">
                <InputForm className="w-full"
                  id="mealFee"
                  value={Helper.formatCurrency(infos.mealFee?infos.mealFee.toString():'')}
                  onChange={(e: any) =>
                    setInfos({ ...infos, mealFee: e.target.value })
                  }
                  label="Tiền ăn"
                />
              </div>
              <div className="field col-3">
                <InputForm className="w-full"
                  id="ticketFee"
                  value={Helper.formatCurrency(infos.ticketFee?infos.ticketFee.toString():'')}
                  onChange={(e: any) =>
                    setInfos({ ...infos, ticketFee: e.target.value })
                  }
                  label="Tiền vé"
                />
              </div>
              <div className="field col-2">
                <InputForm className="w-full"
                  id="overnightFee"
                  value={Helper.formatCurrency(infos.overnightFee?infos.overnightFee.toString():"")}
                  onChange={(e: any) =>
                    setInfos({ ...infos, overnightFee: e.target.value })
                  }
                  label="Tiền qua đêm"
                />
              </div>
              <div className="field col-3">
                <InputForm className="w-full"
                  id="penaltyFee"
                  value={Helper.formatCurrency(infos.penaltyFee?infos.penaltyFee.toString():'')}
                  onChange={(e: any) =>
                    setInfos({ ...infos, penaltyFee: e.target.value })
                  }
                  label="Tiền luật"
                />
              </div>
              <div className="field col-4">
                <InputForm className="w-full"
                  id="goodsFee"
                  value={Helper.formatCurrency(infos.goodsFee?infos.goodsFee.toString():'')}
                  onChange={(e: any) =>
                    setInfos({ ...infos, goodsFee: e.target.value })
                  }
                  label="Lượng hàng về"
                />
              </div>
              <div className="field col-8">
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
