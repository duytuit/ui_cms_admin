
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, loaiToKhai, refreshObject, typeDebit, typeVehicle } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { addDebit, showDebit, updateDebit } from "../api";
import { showContractFile } from "modules/ContractFile/api";
import { InputSwitch, Panel } from "components/uiCore";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { classNames } from "primereact/utils";
import { Dropdown } from "components/common/ListForm";
import { useListEmployee } from "modules/employee/service";
import { useListPartnerDetail } from "modules/partner/service";
import { useListVehicle } from "modules/VehicleDispatch/service";
import { json } from "stream/consumers";
export default function UpdateDebitDispatchFile({ id }: { id: any }) {
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
     // ===== LIST PARTNER & EMPLOYEE =====
    const { data: partnerDetails } = useListPartnerDetail({ params: { status: 1 }, debounce: 500 });
    const { data: partnerVenderDetails } = useListPartnerDetail({ params: { status: 2 }, debounce: 500 });
    const { data: vehicles } = useListVehicle({ params: { status: 2 }, debounce: 500 });
    const { data: employees } = useListEmployee({ params: { keyword: "abc" }, debounce: 500 });
    // lấy ra nhân viên lái xe với departmentid = 1
    const driverOptions = useMemo(() => {
      if (!Array.isArray(employees?.data)) return [];

      return employees.data
        .filter((x: any) =>
          Array.isArray(x.employee_departments) &&
          x.employee_departments[0]?.department_id === 1
        )
        .map((x: any, index: number) => ({
          label: `${index + 1}. ${x.last_name ?? ""} ${x.first_name ?? ""}`.trim(),
          value: x.id,
        }));
    }, [employees]);
    const vehiclesOptions = useMemo(() => {
      if (!Array.isArray(vehicles?.data)) return [];
      return vehicles.data.map((x: any) => ({
        label: `${x?.number_code ?? "(không tên)"}-${getTypeVehicleLabel(x?.is_external_driver)}`,
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
    infos.driverFee = infos.driverFee ? parseInt(infos.driverFee.replace(/\D/g, ""), 10) : 0;
    infos.customsStatus = infos.customsStatus ? parseInt(infos.customsStatus.replace(/\D/g, ""), 10) : 0;
    infos.purchasePrice = infos.purchasePrice ? parseInt(infos.purchasePrice.replace(/\D/g, ""), 10) : 0;
    infos.sellingPrice = infos.sellingPrice ? parseInt(infos.sellingPrice.replace(/\D/g, ""), 10) : 0;
    infos.mealFee = infos.mealFee ? parseInt(infos.mealFee.replace(/\D/g, ""), 10) : 0;
    infos.ticketFee = infos.ticketFee ? parseInt(infos.ticketFee.replace(/\D/g, ""), 10) : 0;
    infos.overnightFee = infos.overnightFee ? parseInt(infos.overnightFee.replace(/\D/g, ""), 10) : 0;
    infos.penaltyFee = infos.penaltyFee ? parseInt(infos.penaltyFee.replace(/\D/g, ""), 10) : 0;
    infos.goodsFee = infos.goodsFee ? parseInt(infos.goodsFee.replace(/\D/g, ""), 10) : 0;
    infos.fileInfoId= infos.id;
    infos.data = JSON.stringify(infos);
    let info = {
      ...infos, status: infos.status ? 0 : 1,
    };
    console.log('info', info);
    setLoading(true);
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
    if (info.id) {
      const response = await addDebit(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          setInfos({ ...refreshObject(infos), status: true })
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));

          navigate('/ContractFile/list-create-dispatch');
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    }
  };
  useEffect(() => {
     if (!id) return;
    if (partnerOptions.length === 0) return;  // ✅ quan trọng
    if (id) {
      setLoading(true);
      showContractFile({ id: id, type: CategoryEnum.country }).then(res => {
        const detail = res.data.data
        if (detail) {
           const _loaiToKhai = loaiToKhai.find( (x: any) => x.DeclarationType === detail.declarationType);
             const partner = partnerOptions.find((x:any)=>x.value == detail.partnerDetailId)
           detail.partnerName = partner?.label
          let info = {
            ...detail, status: detail.status === 0 ? true : false,
            loaiToKhai:_loaiToKhai?.name
          };
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
              <div className="field col-3">
                <MyCalendar dateFormat="dd/mm/yy"
                  value={Helper.formatDMYLocal(infos.accountingDate ? infos.accountingDate : '')} // truyền nguyên ISO string
                  onChange={(e: any) =>
                    setInfos({ ...infos, accountingDate: e })}
                  className={classNames("w-full", "p-inputtext", "input-form-sm")} />
              </div>
               <div className="field col-9">
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
               <div className="field col-3">
                <InputForm className="w-full"
                  id="customerVehicleType"
                  value={infos.customerVehicleType}
                  onChange={(e: any) =>
                     setInfos({ ...infos, customerVehicleType: e.target.value })
                  }
                  label="Loại xe KH"
                />
              </div>
              <div className="field col-9">
                <InputForm className="w-full"
                  id="supplierVehicleType"
                  value={infos.supplierVehicleType}
                  onChange={(e: any) =>
                    setInfos({ ...infos, supplierVehicleType: e.target.value })
                  }
                  label="Loại xe NCC"
                />
              </div>
               <div className="field col-3">
                <InputForm className="w-full"
                  id="sellingPrice"
                  value={infos.sellingPrice}
                  onChange={(e: any) =>
                    setInfos({ ...infos, sellingPrice: Helper.formatCurrency(e.target.value) })
                  }
                  label="Cước bán"
                />
              </div>
               <div className="field col-5">
                <InputForm className="w-full"
                  id="driverFee"
                  value={infos.driverFee}
                  onChange={(e: any) =>
                    setInfos({ ...infos, driverFee: Helper.formatCurrency(e.target.value) })
                  }
                  label="Lái xe thu cước"
                /> 
              </div>
               <div className="field col-4">
                <InputForm className="w-full"
                  id="customsStatus"
                  value={infos.customsStatus}
                  onChange={(e: any) =>
                    setInfos({ ...infos, customsStatus: Helper.formatCurrency(e.target.value) })
                  }
                  label="TTHQ"
                />
              </div>
               <div className="field col-3">
                <InputForm className="w-full"
                  id="purchasePrice"
                  value={infos.purchasePrice}
                  onChange={(e: any) =>
                    setInfos({ ...infos, purchasePrice: Helper.formatCurrency(e.target.value) })
                  }
                  label="Cước mua"
                />
              </div>
               <div className="field col-9">
                <Dropdown
                  filter
                  value={infos.supplierPartnerDetailId}
                  options={partnerVenderOptions}
                  onChange={(e: any) =>
                    {
                        const selected = e.value; // Đây là value (ví dụ: 123)
                        const option = partnerVenderOptions.find((x: any) => x.value === selected);
                        setInfos({ ...infos, supplierPartnerDetailId: selected, partner_info: {
                          supplierPartnerDetailId: selected, partnerLabel: option?.label
                        } })
                    }
                  }
                  label="Nhà cung cấp"
                  className="w-full"
                />
              </div>
               <div className="field col-3">
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
                  required
                />
              </div>
              
              <div className="field col-9">
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
                  required
                />
              </div>
              <div className="field col-3">
                <InputForm className="w-full"
                  id="mealFee"
                  value={infos.mealFee}
                  onChange={(e: any) =>
                    setInfos({ ...infos, mealFee: Helper.formatCurrency(e.target.value) })
                  }
                  label="Tiền ăn"
                />
              </div>
              <div className="field col-4">
                <InputForm className="w-full"
                  id="ticketFee"
                  value={infos.ticketFee}
                  onChange={(e: any) =>
                    setInfos({ ...infos, ticketFee: Helper.formatCurrency(e.target.value) })
                  }
                  label="Tiền vé"
                />
              </div>
              <div className="field col-2">
                <InputForm className="w-full"
                  id="overnightFee"
                  value={infos.overnightFee}
                  onChange={(e: any) =>
                    setInfos({ ...infos, overnightFee: Helper.formatCurrency(e.target.value) })
                  }
                  label="Tiền qua đêm"
                />
              </div>
              <div className="field col-3">
                <InputForm className="w-full"
                  id="penaltyFee"
                  value={infos.penaltyFee}
                  onChange={(e: any) =>
                    setInfos({ ...infos, penaltyFee: Helper.formatCurrency(e.target.value) })
                  }
                  label="Tiền luật"
                />
              </div>
              <div className="field col-3">
                <InputForm className="w-full"
                  id="goodsFee"
                  value={infos.goodsFee}
                  onChange={(e: any) =>
                    setInfos({ ...infos, goodsFee: Helper.formatCurrency(e.target.value) })
                  }
                  label="Lượng hàng về"
                />
              </div>
              <div className="field col-9">
                <InputForm className="w-full"
                  id="note"
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
