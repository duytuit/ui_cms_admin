
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject, typeDebit } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { addDebit, showDebit, updateDebit } from "../api";
import { showContractFile } from "modules/ContractFile/api";
import { InputSwitch, Panel } from "components/uiCore";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { classNames } from "primereact/utils";
import { Dropdown } from "components/common/ListForm";
export default function UpdateDebitDispatchFile({ id }: { id: any }) {
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({});
  const [debitVehicle, setdebitVehicle] = useState<any[]>([]);
  const [newDebitVehicle, setNewDebitVehicle] = useState<any>({ name: "", price: "", note: "", bill: "", link_bill: "", code_bill: "" });
  // format tiền VN
  const formatCurrency = (value: string) => {
    const numeric = value.replace(/\D/g, "");
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    let info = {
      ...infos, status: infos.status ? 0 : 1,
      debitVehicle: debitVehicle,
    };
    console.log('info', info);
    // setLoading(true);
    // fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
    if (info.id) {
      const response = await updateDebit(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          navigate('/debit/list');
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    } else {
      const response = await addDebit(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          setInfos({ ...refreshObject(infos), status: true })
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          navigate('/debit/list');
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    }
  };
  useEffect(() => {
    if (id) {
      setLoading(true);
      showContractFile({ id: id, type: CategoryEnum.country }).then(res => {
        const detail = res.data.data
        if (detail) {
          let info = {
            ...detail, status: detail.status === 0 ? true : false,
          };
          setInfos(info)
        }
      }).catch(err => {
        //setHasError(true)
      }).finally(() => setLoading(false));
    }
  }, [id])
  if (loading) return (<></>);
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
                      <span>{infos.fileNumber}</span>
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
                    <span>abc</span>
                  </td>
                  <td className="pr-4">
                  </td>
                </tr>
              </tbody>
            </table>
          </Panel>
          <Panel header="Thông tin điều xe">
            <div className="formgrid grid">
              <div className="field col-2">
                <MyCalendar dateFormat="dd/mm/yy"
                  value={Helper.formatDMYLocal(infos.accountingDate ? infos.accountingDate : '')} // truyền nguyên ISO string
                  onChange={(e: any) =>
                    setInfos({ ...infos, accountingDate: e })}
                  className={classNames("w-full", "p-inputtext", "input-form-sm")} />
              </div>
               <div className="field col-10">
                <InputForm className="w-full"
                  id="route"
                  value={''}
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
                  options={[]}
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
                  id="customer_vehicle_type"
                  value={infos.customer_vehicle_type}
                  onChange={(e: any) =>
                    setInfos({ ...infos, customer_vehicle_type: e.target.value })
                  }
                  label="Loại xe KH"
                />
              </div>
              <div className="field col-10">
                <InputForm className="w-full"
                  id="supplier_vehicle_type"
                  value={infos.supplier_vehicle_type}
                  onChange={(e: any) =>
                    setInfos({ ...infos, supplier_vehicle_type: e.target.value })
                  }
                  label="Loại xe NCC"
                />
              </div>
               <div className="field col-2">
                <InputForm className="w-full"
                  id="selling_price"
                  value={infos.selling_price}
                  onChange={(e: any) =>
                    setInfos({ ...infos, selling_price: e.target.value })
                  }
                  label="Cước bán"
                />
              </div>
               <div className="field col-5">
                <InputForm className="w-full"
                  id="driver_fee"
                  value={infos.driver_fee}
                  onChange={(e: any) =>
                    setInfos({ ...infos, driver_fee: e.target.value })
                  }
                  label="Lái xe thu cước"
                />
              </div>
               <div className="field col-5">
                <InputForm className="w-full"
                  id="customs_status"
                  value={infos.customs_status}
                  onChange={(e: any) =>
                    setInfos({ ...infos, customs_status: e.target.value })
                  }
                  label="TTHQ"
                />
              </div>
               <div className="field col-2">
                <InputForm className="w-full"
                  id="purchase_price"
                  value={infos.purchase_price}
                  onChange={(e: any) =>
                    setInfos({ ...infos, purchase_price: e.target.value })
                  }
                  label="Cước mua"
                />
              </div>
               <div className="field col-10">
                <Dropdown
                  filter
                  value={infos.partnerDetailId}
                  options={[]}
                  onChange={(e: any) =>
                    setInfos({ ...infos, PartnerDetailId: e.target.value })
                  }
                  label="Nhà cung cấp"
                  className="w-full"
                  required
                />
              </div>
               <div className="field col-2">
                <Dropdown
                  filter
                  value={infos.vehicle_number}
                  options={[]}
                  onChange={(e: any) =>
                    setInfos({ ...infos, vehicle_number: e.target.value })
                  }
                  label="Biển số xe"
                  className="w-full"
                  required
                />
              </div>
              
              <div className="field col-10">
                <Dropdown
                  value={infos.driver_name}
                  optionValue="feature"
                  optionLabel="name"
                  options={[]}
                  label="lái xe"
                  className="p-inputtext-sm"
                  onChange={(e: any) =>
                    setInfos({ ...infos, driver_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="field col-2">
                <InputForm className="w-full"
                  id="meal_fee"
                  value={infos.meal_fee}
                  onChange={(e: any) =>
                    setInfos({ ...infos, meal_fee: e.target.value })
                  }
                  label="Tiền ăn"
                />
              </div>
              <div className="field col-5">
                <InputForm className="w-full"
                  id="ticket_fee"
                  value={infos.ticket_fee}
                  onChange={(e: any) =>
                    setInfos({ ...infos, ticket_fee: e.target.value })
                  }
                  label="Tiền vé"
                />
              </div>
              <div className="field col-2">
                <InputForm className="w-full"
                  id="overnight_fee"
                  value={infos.overnight_fee}
                  onChange={(e: any) =>
                    setInfos({ ...infos, overnight_fee: e.target.value })
                  }
                  label="Tiền qua đêm"
                />
              </div>
              <div className="field col-3">
                <InputForm className="w-full"
                  id="penalty_fee"
                  value={infos.penalty_fee}
                  onChange={(e: any) =>
                    setInfos({ ...infos, penalty_fee: e.target.value })
                  }
                  label="Tiền luật"
                />
              </div>
              <div className="field col-2">
                <InputForm className="w-full"
                  id="goods_fee"
                  value={infos.goods_fee}
                  onChange={(e: any) =>
                    setInfos({ ...infos, goods_fee: e.target.value })
                  }
                  label="Lượng hàng về"
                />
              </div>
              <div className="field col-10">
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
