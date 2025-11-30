import { useEffect, useMemo, useRef, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient, DateBody, } from "components/common/DataTable";
import { Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { loaiHang, loaiToKhai, nghiepVu, phatSinh, tinhChat } from "utils";
import { useListCustomerDetailWithState, useListPartnerDetailWithState } from "modules/partner/service";
import { useListUserWithState } from "modules/user/service";
import { Button, Checkbox, Dialog } from "components/uiCore";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useListContractFile, useListContractFileNotDispatch, useListContractFileWithState } from "modules/ContractFile/service";
import UpdateDebitDispatchFile from "./update_dispatch";
import { useListDebitDispatch, useListHasDebitNoFileDispatchKH, useListNoDebitNoFileDispatchKH } from "../service";
import { deleteDebit, updateDebitToStatusDichVu } from "../api";
import { listContractFileNotDispatch } from "modules/ContractFile/api";
import UpdateDebitDispatchFileCustom from "./update_dispatch_custom";
import UpdateDebitNoFileKH from "./update_debit_no_file_kh";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator,selected,refresh,refreshDebitDispatch ,_setSelectedRows}: any) => {
  const [filter, setFilter] = useState({
    name: "",
    customerDetailId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
  const [visible, setVisible] = useState(false);
  const { data: customerDetails } = useListCustomerDetailWithState({status: 1});
  // --- chuyển sang options bằng useMemo ---
  const customerOptions = useMemo(() => {
    if (!Array.isArray(customerDetails)) return [];
    return customerDetails.map((x: any) => ({
      label: x?.partners?.abbreviation ?? "(không tên)",
      value: x.id,
    }));
  }, [customerDetails]);
   const openDialogAddOne = (e:any) => {
       setVisible(true)
    };
     const openDialogAdd = (e:any) => {
       setVisible(true)
    };
    const handleModalClose = () => {
       setVisible(false);
       _setSelectedRows([])
       refresh?.();
       refreshDebitDispatch?.();
    };
  useEffect(() => {
    // Mỗi khi filter thay đổi => cập nhật params
    _setParamsPaginator((prev: any) => ({
      ...prev,
      keyword: filter.name,
      customerDetailId: filter.customerDetailId,
      fromDate: filter.fromDate,
      toDate: filter.toDate,
    }));
  }, [filter]);

  return (
    <>
    <GridForm
      paramsPaginator={_paramsPaginator}
      setParamsPaginator={_setParamsPaginator}
      filter={filter}
      setFilter={setFilter}
      className="lg:col-9"
      openDialogAdd={()=>openDialogAdd(1)}
      openDialogAddName="Tạo debit hàng loạt"
      openDialogAddOne={()=>openDialogAddOne(1)}
      openDialogAddNameOne="Xuất hóa đơn"
    >
      <div className="col-2">
        <MyCalendar
          dateFormat="dd/mm/yy"
          value={filter.fromDate}
          onChange={(e: any) => setFilter({ ...filter, fromDate: e })}
          className={classNames("w-full", "p-inputtext", "input-sm")}
        />
      </div>
      <div className="col-2">
        <MyCalendar
          dateFormat="dd/mm/yy"
          value={filter.toDate}
          onChange={(e: any) => setFilter({ ...filter, toDate: e })}
          className={classNames("w-full", "p-inputtext", "input-sm")}
        />
      </div>
      <div className="col-6">
        <Dropdown
          filter
          showClear
          value={filter.customerDetailId}
          options={customerOptions}
          onChange={(e: any) =>
            setFilter({ ...filter, customerDetailId: e.target.value })
          }
          label="Khách hàng"
          className={classNames("dropdown-input-sm", "p-dropdown-sm")}
        />
      </div>
    </GridForm>
     <Dialog
        position="top"
        dismissableMask
        header="Tạo công nợ khách hàng không lập file"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "70vw" }}
      >
        <p className="m-0">
          {
            <UpdateDebitNoFileKH
              debits={selected}
              onClose={handleModalClose}
            ></UpdateDebitNoFileKH>
          }
        </p>
      </Dialog>
    </>
  );
};

export default function ListDebitNoFileKH() {
  const { handleParamUrl } = useHandleParamUrl();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedDebitDispatchRows, setSelectedDebitDispatchRows] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [displayDebitDispatchData, setDisplayDebitDispatchData] = useState<any[]>([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const {data: partners } = useListPartnerDetailWithState({});
  const [paramsPaginator, setParamsPaginator] = useState({
    pageNum: 1,
    pageSize: 20,
    first: 0,
    render: false,
    keyword: "",
  });
  const { data, loading, error, refresh } = useListNoDebitNoFileDispatchKH({params: paramsPaginator,debounce: 500,});
  const { data: debitDispatch, refresh:refreshDebitDispatch  } = useListHasDebitNoFileDispatchKH({params: {...paramsPaginator}, debounce: 500,});
  const { data: contractFile } = useListContractFileWithState({});
  const { data: userInfosOptions } = useListUserWithState({});
  // ✅ Client-side pagination
  useEffect(() => {
    if (!data) return;
    handleParamUrl(paramsPaginator);
    const mapped = (data?.data || []).map((row: any) => {
      const cus = partners.find((x: any) => x.id === row.customer_detail_id);
      const _supplier = partners.find((x: any) => x.id === row.supplier_detail_id);
      const _tinhChat = tinhChat.find((x: any) => x.feature === row.feature);
      const _loaiHang = loaiHang.find((x: any) => x.type === row.type);
      const _loaiToKhai = loaiToKhai.find(
        (x: any) => x.DeclarationType === row.declaration_type
      );
      const _phatSinh = phatSinh.find(
        (x: any) => x.occurrence === row.occurrence
      );
      const _nghiepVu = nghiepVu.find((x: any) => x.business === row.business);
      const _user = userInfosOptions.find((x: any) => x.id === row.updated_by);

      return {
        ...row,
        feature: _tinhChat?.name || "",
        type: _loaiHang?.name || "",
        declaration_type: _loaiToKhai?.name || "",
        occurrence: _phatSinh?.name || "",
        business: _nghiepVu?.name || "",
        customerName: cus?.partners?.name || "",
        customerAbb: cus?.partners?.abbreviation || "",
        supplierName:_supplier?.partners?.name || "",
        supplierAbb:_supplier?.partners?.abbreviation || "",
        userName: `${_user?.last_name ?? ""} ${_user?.first_name ?? ""}`.trim(),
      };
    });
      const mappedDebitDispatch = (debitDispatch?.data || []).map((row: any) => {
      const _fileContract = contractFile.find((x: any) => x.id === row.file_info_id);
      const _customer = partners.find((x: any) => x.id === row.customer_detail_id);
      const _supplier = partners.find((x: any) => x.id === row.supplier_detail_id);
      console.log("partners",_customer?.partners?.abbreviation);
      
      return {
        ...row,
        file_number : _fileContract?.file_number,
        so_cont : _fileContract?.container_code,
        customerName:_customer?.partners?.name || "",
        customerAbb:_customer?.partners?.abbreviation || "",
        supplierName:_supplier?.partners?.name || "",
        supplierAbb:_supplier?.partners?.abbreviation || "",
      };
    });
    setDisplayData(mapped);
    setDisplayDebitDispatchData(mappedDebitDispatch);
  }, [contractFile, first, rows, data, debitDispatch, paramsPaginator, partners]);
  return (
    <>
      <div className="card">
        <Header
          _paramsPaginator={paramsPaginator}
          _setParamsPaginator={setParamsPaginator}
          selected={selectedRows}
          refresh={refresh}
          refreshDebitDispatch={refreshDebitDispatch}
          _setSelectedRows={setSelectedRows}
        />
        <div style={{ height: 'calc(100vh - 8rem)' }}>
          <Splitter style={{ height: '100%', width: '100%' }}>
            {/* Panel 1 */}
            <SplitterPanel
              size={35}
              minSize={10}
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <b>Công nợ chưa tạo</b>
                 <DataTableClient
                        rowHover
                        value={displayData}
                        onPage={(e: any) => {
                          setFirst(e.first);
                          setRows(e.rows);
                        }}
                        loading={loading}
                        dataKey="id"
                        title="Tài khoản"
                        filterDisplay="row"
                        className={classNames("Custom-DataTableClient")}
                        scrollable
                        scrollHeight="flex"
                        style={{ flex: 1 }}
                        tableStyle={{ minWidth: "2900px" }}
                      >
                         {/* Custom checkbox column */}
                          <Column
                              header={(rowData: any) => {
                                  return (
                                    <Checkbox
                                        checked={
                                          selectedRows.length === displayData.length &&
                                          displayData.length > 0
                                        }
                                        onChange={(e: any) => {
                                          if (e.checked) setSelectedRows(displayData);
                                          else setSelectedRows([]);
                                        }}
                                    />
                                  )
                              }}
                              body={(rowData: any) => {
                                  const isChecked = selectedRows.findIndex(x => x.id === rowData.id) !== -1;
                                  return (
                                      <Checkbox
                                          className="p-checkbox-sm"
                                          checked={isChecked}
                                          onChange={(e:any) => {
                                              if (e.checked) {
                                                  // thêm cả object
                                                  setSelectedRows(prev => [...prev, rowData]);
                                              } else {
                                                  // xoá theo id
                                                  setSelectedRows(prev =>
                                                      prev.filter(x => x.id !== rowData.id)
                                                  );
                                              }
                                          }}
                                          onClick={(e:any) => e.stopPropagation()}
                                      />
                                  );
                              }}
                              style={{ width: "3em" }}
                          />
                          <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="dispatch_code" header="Mã điều xe" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="so_cont" header="Số cont" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customer_vehicle_type" header="Loại xe KH" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="supplier_vehicle_type" header="Loại xe NCC" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="name" header="Tuyến vận chuyển" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="purchase_price" header="Cước mua" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="price" header="Cước bán" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="driver_fee" header="Lái xe thu cước" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="goods_fee" header="Lương hàng về" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="supplierName" header="Nhà cung cấp" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="supplierAbb" header="Tên viết tắt NCC" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_quantity" header="Biển số xe" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_quantity" header="Lái xe" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_quantity" header="TTHQ" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_quantity" header="Điểm trả hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="meal_fee" header="Tiền ăn" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="ticket_fee" header="Tiền Vé" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="overnight_fee" header="Tiền qua đêm" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="penalty_fee" header="Tiền luật" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="note" header="Ghi chú" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_quantity" header="Người cập nhật" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                    </DataTableClient>
              </div>
            </SplitterPanel>

            {/* Panel 2 */}
            <SplitterPanel
              minSize={20}
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                     <b>Công nợ đã tạo</b>
                      <DataTableClient
                        rowHover
                        value={displayDebitDispatchData}
                        onPage={(e: any) => {
                          setFirst(e.first);
                          setRows(e.rows);
                        }}
                        loading={loading}
                        dataKey="id"
                        title="Tài khoản"
                        filterDisplay="row"
                        className={classNames("Custom-DataTableClient")}
                        scrollable
                        scrollHeight="flex"
                        style={{ flex: 1 }}
                        tableStyle={{ minWidth: "2900px" }}
                      >
                         {/* Custom checkbox column */}
                          <Column
                              header={(rowData: any) => {
                                  return (
                                    <Checkbox
                                        checked={
                                          selectedDebitDispatchRows.length === displayDebitDispatchData.length &&
                                          displayDebitDispatchData.length > 0
                                        }
                                        onChange={(e: any) => {
                                          if (e.checked) setSelectedDebitDispatchRows(displayDebitDispatchData);
                                          else setSelectedDebitDispatchRows([]);
                                        }}
                                    />
                                  )
                              }}
                              body={(rowData: any) => {
                                  const isChecked = selectedDebitDispatchRows.findIndex(x => x.id === rowData.id) !== -1;
                                  return (
                                      <Checkbox
                                          className="p-checkbox-sm"
                                          checked={isChecked}
                                          onChange={(e:any) => {
                                              if (e.checked) {
                                                  // thêm cả object
                                                  setSelectedDebitDispatchRows(prev => [...prev, rowData]);
                                              } else {
                                                  // xoá theo id
                                                  setSelectedDebitDispatchRows(prev =>
                                                      prev.filter(x => x.id !== rowData.id)
                                                  );
                                              }
                                          }}
                                          onClick={(e:any) => e.stopPropagation()}
                                      />
                                  );
                              }}
                              style={{ width: "3em" }}
                          />
                          <Column
                              header="Thao tác"
                              body={(row: any) => {
                                if(row.cf_status_confirm == 1){
                                                                                
                                }else{
                                  return ActionBody(
                                      row,
                                      null,
                                      { route: "/Debit/updateDebitToStatusDichVu", action: updateDebitToStatusDichVu },
                                      paramsPaginator,
                                      setParamsPaginator
                                  );
                                }
                              }}
                          />
                          <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="dispatch_code" header="Mã điều xe" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="name" header="Tuyến vận chuyển" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="name" header="Số hóa đơn" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="name" header="Ngày xuất hóa đơn" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="price" header="Số tiền" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="vat" header="VAT" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="thanh_tien" header="Thành tiền" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="so_cont" header="Số cont" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customer_vehicle_type" header="Loại xe KH" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="supplier_vehicle_type" header="Loại xe NCC" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="driver_fee" header="Lái xe thu cước" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="goods_fee" header="Lương hàng về" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="supplierName" header="Nhà cung cấp" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="supplierAbb" header="Tên viết tắt NCC" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_quantity" header="Biển số xe" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_quantity" header="Lái xe" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_quantity" header="TTHQ" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_quantity" header="Điểm trả hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="meal_fee" header="Tiền ăn" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="ticket_fee" header="Tiền Vé" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="overnight_fee" header="Tiền qua đêm" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="penalty_fee" header="Tiền luật" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="note" header="Ghi chú" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_quantity" header="Người cập nhật" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                    </DataTableClient>
                  </div>
            </SplitterPanel>
          </Splitter>
        </div>
      </div>
    </>
  );
}
