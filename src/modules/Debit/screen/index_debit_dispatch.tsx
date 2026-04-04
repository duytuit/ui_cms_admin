import { useEffect, useMemo, useRef, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient, DateBody, } from "components/common/DataTable";
import { Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { loaiHang, loaiToKhai, nghiepVu, phatSinh, tinhChat, transportation_cost } from "utils";
import { useListCustomerDetailWithState, useListPartnerDetailWithState } from "modules/partner/service";
import { useListUserWithState } from "modules/user/service";
import { Button, Checkbox, Dialog } from "components/uiCore";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useListContractFile, useListContractFileNotDispatch, useListContractFileWithState } from "modules/ContractFile/service";
import UpdateDebitDispatchFile from "./update_dispatch";
import { useListDebitDispatch } from "../service";
import { deleteDebit, exportDieuXe } from "../api";
import UpdateDebitDispatchFileCustom from "./update_dispatch_custom";
import { FilterMatchMode, FilterService } from "primereact/api";
import UpdateGiayChiLaiXe from "modules/receipt/screen/update_giay_chilaixe";
FilterService.register('custom_numeric', (value, filter) => {
    if (!filter) return true;

    const input = filter.toString().trim();
    const match = input.match(/^([><=!]+)\s*(\d+(?:\.\d+)?)$/);

    let operator = '=';
    let num = 0;

    if (match) {
        operator = match[1];
        num = parseFloat(match[2]);
    } else {
        num = parseFloat(input);
        if (isNaN(num)) return true;
    }

    const val = parseFloat(value) || 0;

    switch (operator) {
        case '>': return val > num;
        case '>=': return val >= num;
        case '=':
        case '==': return val === num;
        case '<=': return val <= num;
        case '<': return val < num;
        case '!=': return val !== num;
        default: return true;
    }
});
// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator,refreshDebitDispatch }: any) => {
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
     const openDialogAdd = (e:any) => {
       setVisible(true)
    };
    const handleModalClose = () => {
       setVisible(false);
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
    async function ExportExcelDieuXe(){
      const respo = await exportDieuXe(Helper.convertObjectToQueryString(_paramsPaginator));
      const url = window.URL.createObjectURL(new Blob([respo.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dieu_xe_chi_tiet_kh.xlsx'); // or any other extension
      document.body.appendChild(link);
      link.click();
      link?.parentNode?.removeChild(link);  
    }
  const items = [
        {
            label: 'Điều xe chi tiết',
            icon: "pi pi-file-export",
            command: () => ExportExcelDieuXe()
        }
    ];
  return (
    <>
    <GridForm
      paramsPaginator={_paramsPaginator}
      setParamsPaginator={_setParamsPaginator}
      filter={filter}
      setFilter={setFilter}
      className="lg:col-9"
      openDialogAdd={()=>openDialogAdd(1)}
      openDialogAddName="Tạo điều xe"
      MenuItems={items}
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
        header="Tạo điều xe theo số file"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "78vw" }}
      >
        <p className="m-0">
          {
            <UpdateDebitDispatchFileCustom
              onClose={handleModalClose}
            ></UpdateDebitDispatchFileCustom>
          }
        </p>
      </Dialog>
    </>
  );
};

export default function ListCreateDispatch() {
  const { handleParamUrl } = useHandleParamUrl();
  const [selectedDetail, setSelectedDetail] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedDebitDispatchRows, setSelectedDebitDispatchRows] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [displayDebitDispatchData, setDisplayDebitDispatchData] = useState<any[]>([]);
  const [visibleLaiXe, setVisibleLaiXe] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<any>();
  const [type, setType] = useState<any>();
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
    const [filters, setFilters] = useState({  
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      file_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
      customerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      customerAbb: { value: null, matchMode: FilterMatchMode.CONTAINS },
      dispatch_code: { value: null, matchMode: FilterMatchMode.CONTAINS },
      sales: { value: null, matchMode: FilterMatchMode.CONTAINS },
      so_cont: { value: null, matchMode: FilterMatchMode.CONTAINS },
      declaration: { value: null, matchMode: FilterMatchMode.CONTAINS },
      bill: { value: null, matchMode: FilterMatchMode.CONTAINS },
      customer_vehicle_type: { value: null, matchMode: FilterMatchMode.CONTAINS },
      supplier_vehicle_type: { value: null, matchMode: FilterMatchMode.CONTAINS },
      cf_status_file_confirm: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      vehicle_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
      driver: { value: null, matchMode: FilterMatchMode.CONTAINS },
      price: { value: null, matchMode: 'custom_numeric' },
      purchase_price: { value: null, matchMode: 'custom_numeric' },
     });
  const { data, loading, error, refresh } = useListContractFileNotDispatch({params: paramsPaginator,debounce: 500,});
  const { data: debitDispatch, refresh:refreshDebitDispatch  } = useListDebitDispatch({params: {...paramsPaginator}, debounce: 500,});
  const { data: contractFile } = useListContractFileWithState({});
  const { data: userInfosOptions } = useListUserWithState({});
  const { data: employeeOptions } = useListEmployeeWithState({});
  const mapTransportationCost = (detail: any) => {
    try {
      const parsed =
        typeof detail?.transportation_cost === "string"
          ? JSON.parse(detail.transportation_cost)
          : detail?.transportation_cost ?? {};
      return transportation_cost.reduce((acc: any, item) => {
        acc[item.key] = parsed?.[item.key] ?? 0;
        return acc;
      }, {});
    } catch {
      return transportation_cost.reduce((acc: any, item) => {
        acc[item.key] = 0;
        return acc;
      }, {});
    }
  };
  // ✅ Client-side pagination
  useEffect(() => {
    if (!data) return;
    handleParamUrl(paramsPaginator);
    const mapped = (data?.data || []).map((row: any) => {
      const cus = partners.find((x: any) => x.id === row.customer_detail_id);
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
        userName: `${_user?.last_name ?? ""} ${_user?.first_name ?? ""}`.trim(),
      };
    });
      const mappedDebitDispatch = (debitDispatch?.data || []).map((row: any) => {
      const _fileContract = contractFile.find((x: any) => x.id === row.file_info_id);
      const _customer = partners.find((x: any) => x.id === row.customer_detail_id);
      const _supplier = partners.find((x: any) => x.id === row.supplier_detail_id);
      const _driver = employeeOptions.find((x: any) => x.id === row.employee_driver_id);

      let _cf_status_file_confirm = 0;
      if (row.cf_status_confirm == 1 && row.file_info_id != null) {
        _cf_status_file_confirm = 1;
      } else if (row.cf_status_confirm == 0 && row.file_info_id != null) {
        _cf_status_file_confirm = 0;
      } else {
        _cf_status_file_confirm = 2;
      }
      // 🔥 dùng lại function
      const mappedTransportationCost = mapTransportationCost(row);
      const Tongchiphivanchuyen = [
        row.meal_fee,
        row.ticket_fee,
        row.overnight_fee,
        row.penalty_fee,
        row.goods_fee,
        row.delivery_point,
        ...Object.values(mappedTransportationCost)
      ].reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
      const Con_lai =Tongchiphivanchuyen - row.receipt_total;
      return {
        ...row,
        file_number: _fileContract?.file_number || "không file",
        so_cont: _fileContract?.container_code,
        bill: _fileContract?.bill,
        sales: _fileContract?.sales,
        declaration: _fileContract?.declaration,
        customerName: _customer?.partners?.name || "",
        customerAbb: _customer?.partners?.abbreviation || "",
        supplierName: _supplier?.partners?.name || "",
        supplierAbb: _supplier?.partners?.abbreviation || "",
        driver: `${_driver?.last_name ?? ""} ${_driver?.first_name ?? ""}`.trim(),
        cf_status_file_confirm: _cf_status_file_confirm,
        ...mappedTransportationCost,
        Tongchiphivanchuyen,
        Con_lai
      };
    });
    
    setDisplayData(mapped);
    setDisplayDebitDispatchData(mappedDebitDispatch);
  }, [contractFile, first, rows, data, debitDispatch, paramsPaginator, partners]);
  const openDialogAddPhieuChiLaiXe = (row: any) => {
     setSelectedDetail(row)
     setVisibleLaiXe(true)
  };
  const handleModalClosePhieuChiLaiXe = () => {
    setVisibleLaiXe(false);
    refresh?.(); 
    refreshDebitDispatch?.(); // reload debitDispatch
  };
  // Hàm mở dialog thêm mới
  const openDialogAdd = (id: number) => {
    setSelectedId(id);
    setVisible(true);
    setType(0)
  };
  const handleModalClose = () => {
    setVisible(false);
    refresh?.(); 
    refreshDebitDispatch?.(); // reload debitDispatch
  };
  // Hàm mở dialog thêm mới
  const openDialogEdit = (id: number) => {
    setSelectedId(id);
    setVisible(true);
    setType(1)
  };
 const getSumColumn = (field: string) => {
    const filtered = (displayDebitDispatchData ?? []).filter((row: any) => {
        return Object.entries(filters).every(([key, meta]: any) => {
            const { value, matchMode } = meta;

            if (value === null || value === undefined || value === '') return true;

            const fieldValue = row[key];

            const fn = FilterService.filters[
                (matchMode || FilterMatchMode.CONTAINS) as keyof typeof FilterService.filters
            ];

            return fn ? fn(fieldValue, value) : true;
        });
    });

    const sum = filtered.reduce((acc: number, item: any) => {
        return acc + (parseFloat(item[field]) || 0);
    }, 0);

    return Helper.formatCurrency(sum.toString());
};
  const statusOptions = [
    { label: 'Không file', value: 2 },
    { label: 'Đã duyệt', value: 1 },
    { label: 'Chưa duyệt', value: 0 }
  ];
  return (
    <>
      <div className="card">
        <Header
          _paramsPaginator={paramsPaginator}
          _setParamsPaginator={setParamsPaginator}
          refreshDebitDispatch={refreshDebitDispatch}
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
                <b>File chưa tạo chi phí đi đường</b>
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
                  tableStyle={{ minWidth: "1600px" }}
                >
                  {/* Custom checkbox column */}
                  <Column
                    header={
                      <Checkbox
                        checked={
                          selectedRows.length === displayData.length &&
                          displayData.length > 0
                        }
                        onChange={(e: any) => {
                          if (e.checked)
                            setSelectedRows(displayData.map((d) => d.id));
                          else setSelectedRows([]);
                        }}
                      />
                    }
                    body={(rowData: any) => (
                      <Checkbox
                        className="p-checkbox-sm"
                        checked={selectedRows.includes(rowData.id)}
                        onChange={(e: any) => {
                          if (e.checked)
                            setSelectedRows((prev) => [...prev, rowData.id]);
                          else
                            setSelectedRows((prev) =>
                              prev.filter((id) => id !== rowData.id)
                            );
                        }}
                        onClick={(e: any) => e.stopPropagation()} // ⚡ chặn row click
                      />
                    )}
                    style={{ width: "3em" }}
                  />
                  <Column header="Thao tác" body={(e: any) => ActionBody(e, null, null, null, null, () => openDialogAdd(e.id))} style={{ width: "6em" }} />
                  <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                  <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains" />
                  <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                  <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                  <Column field="type" header="Loại hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                  <Column field="quantity" header="Số lượng" filter showFilterMenu={false} filterMatchMode="contains" />
                  <Column field="declaration" header="Số tờ khai" filter showFilterMenu={false} filterMatchMode="contains" />
                  <Column field="bill" header="Số Bill/book" filter showFilterMenu={false} filterMatchMode="contains" />
                  <Column field="userName" header="Người cập nhật" filter showFilterMenu={false} filterMatchMode="contains" />
                  <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                </DataTableClient>
              </div>
            </SplitterPanel>

            {/* Panel 2 */}
            <SplitterPanel
              size={65}
              minSize={20}
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                     <b>Bảng nhật ký hàng ngày</b>
                      <DataTableClient
                        rowHover
                        value={displayDebitDispatchData}
                        onPage={(e: any) => {
                          setFirst(e.first);
                          setRows(e.rows);
                        }}
                        loading={loading}
                        dataKey="id"
                        filters={filters}
                        onFilter={(e:any) => setFilters(e.filters)}
                        title="Tài khoản"
                        filterDisplay="row"
                        className={classNames("Custom-DataTableClient")}
                        scrollable
                        scrollHeight="flex"
                        style={{ flex: 1 }}
                        tableStyle={{ minWidth: "3600px" }}
                      >
                        {/* Custom checkbox column */}
                        <Column
                          header={
                            <Checkbox
                              checked={
                                selectedDebitDispatchRows.length === displayDebitDispatchData.length &&
                                displayDebitDispatchData.length > 0
                              }
                              onChange={(e: any) => {
                                if (e.checked)
                                  setSelectedDebitDispatchRows(displayDebitDispatchData.map((d) => d.id));
                                else setSelectedDebitDispatchRows([]);
                              }}
                            />
                          }
                          body={(rowData: any) => (
                            <Checkbox
                              className="p-checkbox-sm"
                              checked={selectedDebitDispatchRows.includes(rowData.id)}
                              onChange={(e: any) => {
                                if (e.checked)
                                  setSelectedDebitDispatchRows((prev) => [...prev, rowData.id]);
                                else
                                  setSelectedDebitDispatchRows((prev) =>
                                    prev.filter((id) => id !== rowData.id)
                                  );
                              }}
                              onClick={(e: any) => e.stopPropagation()} // ⚡ chặn row click
                            />
                          )}
                          style={{ width: "3em" }}
                        />
                          <Column
                              header="Thao tác"
                              body={(row: any) => {
                                if(row.cf_status_confirm == 1 || (row.cf_status == 2 && row.file_info_id ==null) ){
                                  return <Button icon="pi pi-plus" rounded outlined severity="success" onClick={() => openDialogAddPhieuChiLaiXe(row)} />                                     
                                }else{
                                  return ActionBody(
                                      row,
                                      null,
                                      { route: "/Debit/delete", action: deleteDebit },
                                      paramsPaginator,
                                      setParamsPaginator,
                                      () => openDialogAddPhieuChiLaiXe(row)
                                      ,null,null,
                                      () => openDialogEdit(row.id)
                                  );
                                }
                              }}
                              style={{width:"8em"}}
                          />
                          <Column
                            field="cf_status_file_confirm"
                            header="Trạng thái"
                             body={(row: any) => {
                              if(row.cf_status_file_confirm === 1){
                                return <Button label="đã duyệt" rounded severity="success" size="small" text  />
                              }else if(row.cf_status_file_confirm ===0){
                                return <Button label="chưa duyệt" rounded severity="warning" size="small" text  />
                              }else{
                                return <Button label="không file" rounded severity="success" size="small" text  />
                              }
                            }}
                            filter
                            filterElement={(options:any) => (
                                <Dropdown
                                    value={options.value}
                                    options={statusOptions}
                                    onChange={(e:any) => {
                                      options.filterApplyCallback(e.value)
                                    }}
                                    label="trạng thái"
                                    className="p-column-filter"
                                    showClear
                                />
                            )}
                            showFilterMenu={false}  style={{ width:"180px" }}/>
                          <Column field="service_date" header="Ngày điều xe" body={(e: any) => DateBody(e.service_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="dispatch_code" header="Mã điều xe" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="so_cont" header="Số cont" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customer_vehicle_type" header="Loại xe KH" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="supplier_vehicle_type" header="Loại xe NCC" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="name" header="Tuyến vận chuyển" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column
                              field="price"
                              header="Cước bán"
                              body={(row: any) => Helper.formatCurrency(row.price?.toString())}
                              footer={getSumColumn("price")}
                              filter
                              showFilterMenu={false}
                              filterMatchMode="custom_numeric"
                          />

                          <Column
                              field="purchase_price"
                              header="Cước mua"
                              body={(row: any) => Helper.formatCurrency(row.purchase_price?.toString())}
                              footer={getSumColumn("purchase_price")}
                              filter
                              showFilterMenu={false}
                              filterMatchMode="custom_numeric"
                          />
                          <Column field="driver_fee" body={(row: any) => Helper.formatCurrency((row.driver_fee ?? 0).toString())} 
                            footer={getSumColumn("driver_fee")}
                            footerStyle={{ fontWeight: "bold" }}
                            header="Lái xe thu cước" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="goods_fee" body={(row: any) => Helper.formatCurrency((row.goods_fee ?? 0).toString())}
                             footer={getSumColumn("goods_fee")}
                             footerStyle={{ fontWeight: "bold" }}
                             header="Lương hàng về" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="supplierName" header="Nhà cung cấp" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="supplierAbb" header="Tên viết tắt NCC" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="vehicle_number" header="Biển số xe" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="driver" header="Lái xe" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_quantity" header="TTHQ" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_quantity" header="Điểm trả hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="meal_fee" body={(row: any) => Helper.formatCurrency((row.meal_fee ?? 0).toString())} 
                             footer={getSumColumn("meal_fee")}
                             footerStyle={{ fontWeight: "bold" }}
                             header="Tiền ăn" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="ticket_fee" body={(row: any) => Helper.formatCurrency((row.ticket_fee ?? 0).toString())}
                              footer={getSumColumn("ticket_fee")}
                              footerStyle={{ fontWeight: "bold" }}
                              header="Tiền Vé" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="overnight_fee" body={(row: any) => Helper.formatCurrency((row.overnight_fee ?? 0).toString())}
                              footer={getSumColumn("overnight_fee")}
                              footerStyle={{ fontWeight: "bold" }}
                              header="Tiền qua đêm" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="penalty_fee" body={(row: any) => Helper.formatCurrency((row.penalty_fee ?? 0).toString())}
                               footer={getSumColumn("penalty_fee")}
                               footerStyle={{ fontWeight: "bold" }}
                               header="Tiền luật / phí phác" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="delivery_point"   body={(row: any) => Helper.formatCurrency((row.delivery_point ?? 0).toString())}
                               footer={getSumColumn("delivery_point")}
                               footerStyle={{ fontWeight: "bold" }}
                               header="Điểm trả hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                          {transportation_cost.map((item) => (
                            <Column
                              header={item.label}
                              body={(row: any) =>
                               {
                                 return Helper.formatCurrency((row[item.key] ?? 0).toString())
                               }
                              }
                              footer={getSumColumn(item.key)}
                              footerStyle={{ fontWeight: "bold" }}
                            />
                          ))}
                          <Column field="Tongchiphivanchuyen"   body={(row: any) => Helper.formatCurrency((row.Tongchiphivanchuyen ?? 0).toString())}
                               footer={getSumColumn("Tongchiphivanchuyen")}
                               footerStyle={{ fontWeight: "bold" }}
                               header="Tổng cộng" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="receipt_total"   body={(row: any) => Helper.formatCurrency((row.receipt_total ?? 0).toString())}
                               footer={getSumColumn("receipt_total")}
                               footerStyle={{ fontWeight: "bold" }}
                               header="Đã chi" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="Con_lai" body={(row: any) => Helper.formatCurrency((row.Con_lai ?? 0).toString())}
                               footer={getSumColumn("Con_lai")}
                               footerStyle={{ fontWeight: "bold" }}
                               header="Còn lại" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="note" header="Ghi chú" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_quantity" header="Người cập nhật" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                    </DataTableClient>
                  </div>
            </SplitterPanel>
          </Splitter>
        </div>
      </div>
      <Dialog
        position="top"
        dismissableMask
        header="Tạo điều xe theo số file"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "78vw" }}
      >
        <p className="m-0">
          {selectedId && (
            <UpdateDebitDispatchFile
              id={selectedId}
              onClose={handleModalClose}
              type={type}
            ></UpdateDebitDispatchFile>
          )}
        </p>
      </Dialog>
      <Dialog
        position="top"
        dismissableMask
        header="Tạo yêu cầu chi lái xe"
        visible={visibleLaiXe}
        onHide={() => setVisibleLaiXe(false)}
        style={{ width: "60vw" }}
      >
        <p className="m-0">
          {selectedDetail && (
            <UpdateGiayChiLaiXe
              detail={selectedDetail}
              onClose={handleModalClosePhieuChiLaiXe}
            ></UpdateGiayChiLaiXe>
          )}
        </p>
      </Dialog>
    </>
  );
}
