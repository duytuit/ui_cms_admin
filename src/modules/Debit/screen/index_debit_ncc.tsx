import { useEffect, useMemo, useRef, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient, DateBody, } from "components/common/DataTable";
import { Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { loaiHang, loaiToKhai, nghiepVu, phatSinh, tinhChat } from "utils";
import { useListCustomerDetailWithState, useListPartnerDetailWithState, useListSupplierDetailWithState } from "modules/partner/service";
import { useListUserWithState } from "modules/user/service";
import { Button, Checkbox, Dialog } from "components/uiCore";
import { Helper } from "utils/helper";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useListContractFileWithState } from "modules/ContractFile/service";
import { useListHasDebitNCC, useListHasDebitNoFileDispatchKH, useListHasDebitNoFileNCC, useListNoDebitNCC, useListNoDebitNoFileDispatchKH, useListNoDebitNoFileNCC } from "../service";
import { deleteDebitNCC, delMultiDebit, updateDebitToStatusDichVu } from "../api";
import { FilterMatchMode } from "primereact/api";
import UpdateDebitNCC from "./update_debit_ncc";
import UpdateXuatHoaDonNCC from "./update_xuat_hoadon_no_file_ncc";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator,selected,refresh,refreshDebitDispatch ,_setSelectedRows,selectedDebitNCCRows,_setSelectedDebitNCCRows}: any) => {
  const [filter, setFilter] = useState({
    name: "",
    supplierDetailId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
  const [visible, setVisible] = useState(false);
  const [visibleXuatHoaDon, setVisibleXuatHoaDon] = useState(false);
   const { data: supplierDetails } = useListSupplierDetailWithState({ status: 2});
   // --- chuyển sang options bằng useMemo ---
   const supplierOptions = useMemo(() => {
     if (!Array.isArray(supplierDetails)) return [];
     return supplierDetails.map((x: any) => ({
       label: x?.partners?.abbreviation ?? "(không tên)",
       value: x.id,
     }));
   }, [supplierDetails]);
    const openDialogAddOne = (e:any) => {
       setVisibleXuatHoaDon(true)
    };
     const handleModalCloseOne = () => {
       setVisibleXuatHoaDon(false);
       _setSelectedDebitNCCRows([])
       refreshDebitDispatch?.();
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
      supplierDetailId: filter.supplierDetailId,
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
          value={filter.supplierDetailId}
          options={supplierOptions}
          onChange={(e: any) =>
            setFilter({ ...filter, supplierDetailId: e.target.value })
          }
          label="Nhà cung cấp"
          className={classNames("dropdown-input-sm", "p-dropdown-sm")}
        />
      </div>
    </GridForm>
     <Dialog
        position="top"
        dismissableMask
        header="Tạo công nợ nhà cung cấp"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "70vw" }}
      >
        <p className="m-0">
          {
            <UpdateDebitNCC
              debits={selected}
              onClose={handleModalClose}
            ></UpdateDebitNCC>
          }
        </p>
      </Dialog>
       <Dialog
              position="top"
              dismissableMask
              visible={visibleXuatHoaDon}
              onHide={() => setVisibleXuatHoaDon(false)}
              style={{ width: "30vw", top:"30px" }}
          >
            <p className="m-0">
              {selectedDebitNCCRows && <UpdateXuatHoaDonNCC ids={selectedDebitNCCRows} onClose={handleModalCloseOne} ></UpdateXuatHoaDonNCC>}
            </p>
        </Dialog>
    </>
  );
};

export default function ListDebitNCC() {
  const { handleParamUrl } = useHandleParamUrl();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedDebitNCCRows, setSelectedDebitNCCRows] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [displayDebitNCC, setDisplayDebitNCC] = useState<any[]>([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const [selectedIdEdit, setSelectedIdEdit] = useState<any>();
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [noDebitfilters, setNoDebitfilters] = useState({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  customerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  customerAbb: { value: null, matchMode: FilterMatchMode.CONTAINS },
  supplierName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  supplierAbb: { value: null, matchMode: FilterMatchMode.CONTAINS },
  file_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [filters, setFilters] = useState({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  customerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  customerAbb: { value: null, matchMode: FilterMatchMode.CONTAINS },
  supplierName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  supplierAbb: { value: null, matchMode: FilterMatchMode.CONTAINS },
  file_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const {data: partners } = useListPartnerDetailWithState({});
  const [paramsPaginator, setParamsPaginator] = useState({
    pageNum: 1,
    pageSize: 20,
    first: 0,
    render: false,
    keyword: "",
  });
  const { data, loading, error, refresh } = useListNoDebitNCC({params: paramsPaginator,debounce: 500,});
  const { data: dataHasDebitNCC, refresh:refreshDataHasDebitNCC  } = useListHasDebitNCC({params: {...paramsPaginator}, debounce: 500,});
  const { data: contractFile } = useListContractFileWithState({});
  const { data: userInfosOptions } = useListUserWithState({});
   const openDialogEdit = (id:number) => {
        setSelectedIdEdit(id);
        setVisibleEdit(true);
    };
    const handleModalEditClose = () => {
      setVisibleEdit(false);
      refresh?.(); 
      refreshDataHasDebitNCC?.(); // reload debitDispatch
    };
  const getSumColumn = (field: string) => {
        const filtered = (displayDebitNCC??[]).filter((item: any) => {
            return Object.entries(filters).every(([key, f]: [string, any]) => {
                const value = f?.value?.toString().toLowerCase() ?? "";
                if (!value) return true;
                const cell = item[key]?.toString().toLowerCase() ?? "";
                return cell.includes(value);
            });
        });

        const sum = filtered.reduce((acc: any, item: any) => {
            const val = parseInt(item[field]?.toString().replace(/\D/g, ""), 10) || 0;
            return acc + val;
        }, 0);

        return Helper.formatCurrency(sum.toString());
    };
     const getSumColumnNoDebit = (field: string) => {
        const filtered = (displayData??[]).filter((item: any) => {
            return Object.entries(noDebitfilters).every(([key, f]: [string, any]) => {
                const value = f?.value?.toString().toLowerCase() ?? "";
                if (!value) return true;
                const cell = item[key]?.toString().toLowerCase() ?? "";
                return cell.includes(value);
            });
        });

        const sum = filtered.reduce((acc: any, item: any) => {
            const val = parseInt(item[field]?.toString().replace(/\D/g, ""), 10) || 0;
            return acc + val;
        }, 0);

        return Helper.formatCurrency(sum.toString());
    };
  // ✅ Client-side pagination
  useEffect(() => {
    if (!data) return;
    handleParamUrl(paramsPaginator);
    const mapped = (data?.data || []).map((row: any) => {
      const cus = partners.find((x: any) => x.id === row.customer_detail_id);
      const _supplier = partners.find((x: any) => x.id === row.supplier_detail_id);
      const _user = userInfosOptions.find((x: any) => x.id === row.updated_by);
      const _fileContract = contractFile.find((x: any) => x.id === row.file_info_id);
      return {
        ...row,
        file_number : _fileContract?.file_number || "không file",
        so_cont : _fileContract?.container_code,
        customerName: cus?.partners?.name || "",
        customerAbb: cus?.partners?.abbreviation || "",
        supplierName:_supplier?.partners?.name || "",
        supplierAbb:_supplier?.partners?.abbreviation || "",
        userName: `${_user?.last_name ?? ""} ${_user?.first_name ?? ""}`.trim(),
      };
    });
      const mappedDataHasDebitNCC = (dataHasDebitNCC?.data || []).map((row: any) => {
        const _fileContract = contractFile.find((x: any) => x.id === row.file_info_id);
        const _customer = partners.find((x: any) => x.id === row.customer_detail_id);
        const _supplier = partners.find((x: any) => x.id === row.supplier_detail_id);
        const thanh_tien = Math.round(row.purchase_price * (1 + row.purchase_vat / 100));
        return {
          ...row,
          purchase_price: Helper.formatCurrency(row.purchase_price?.toString() || "0"),
          file_number : _fileContract?.file_number || "không file",
          so_cont : _fileContract?.container_code,
          customerName:_customer?.partners?.name || "",
          customerAbb:_customer?.partners?.abbreviation || "",
          supplierName:_supplier?.partners?.name || "",
          supplierAbb:_supplier?.partners?.abbreviation || "",
          thanh_tien: Helper.formatCurrency(thanh_tien.toString() || "0"),
        };
    });
    setDisplayData(mapped);
    setDisplayDebitNCC(mappedDataHasDebitNCC);
  }, [contractFile, first, rows, data, dataHasDebitNCC, paramsPaginator, partners]);
  return (
    <>
      <div className="card">
        <Header
          _paramsPaginator={paramsPaginator}
          _setParamsPaginator={setParamsPaginator}
          selected={selectedRows}
          refresh={refresh}
          refreshDebitDispatch={refreshDataHasDebitNCC}
          _setSelectedRows={setSelectedRows}
          selectedDebitNCCRows={selectedDebitNCCRows}
          _setSelectedDebitNCCRows={setSelectedDebitNCCRows}
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
                        filters={noDebitfilters}
                        onFilter={(e:any) => setNoDebitfilters(e.filters)}
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
                          <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="so_cont" header="Số cont" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="supplierName" header="Nhà cung cấp" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="supplierAbb" header="Tên viết tắt NCC" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customer_vehicle_type" header="Loại xe KH" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="supplier_vehicle_type" header="Loại xe NCC" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="name" header="Tuyến vận chuyển" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="purchase_price" header="Cước mua"
                           body={(row: any) => Helper.formatCurrency(row.purchase_price.toString())}
                            footer={getSumColumnNoDebit("purchase_price")}
                            footerStyle={{ fontWeight: "bold" }}
                           filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="vehicle_number" header="Biển số xe" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_quantity" header="Lái xe" filter showFilterMenu={false} filterMatchMode="contains" />
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
                        value={displayDebitNCC}
                        onPage={(e: any) => {
                          setFirst(e.first);
                          setRows(e.rows);
                        }}
                        loading={loading}
                        dataKey="id"
                        title="Tài khoản"
                        filterDisplay="row"
                        filters={filters}
                        onFilter={(e:any) => setFilters(e.filters)}
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
                                          selectedDebitNCCRows.length === displayDebitNCC.length &&
                                          displayDebitNCC.length > 0
                                        }
                                        onChange={(e: any) => {
                                          if (e.checked) setSelectedDebitNCCRows(displayDebitNCC.map((d) => d.id));
                                          else setSelectedDebitNCCRows([]);
                                        }}
                                    />
                                  )
                              }}
                              body={(rowData: any) => {
                                  return (
                                      <Checkbox
                                          className="p-checkbox-sm"
                                          checked={selectedDebitNCCRows.includes(rowData.id)}
                                          onChange={(e:any) => {
                                              if (e.checked) {
                                                  // thêm cả object
                                                  setSelectedDebitNCCRows(prev => [...prev, rowData.id]);
                                              } else {
                                                  // xoá theo id
                                                  setSelectedDebitNCCRows(prev =>
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
                                        { route: "Debit/deleteDebitNCC", action: deleteDebitNCC },
                                        paramsPaginator,
                                        setParamsPaginator
                                    );
                                }
                              }}
                            style={{ width: "6em" }}
                          />
                           <Column
                              header="In"
                              body={(row: any) => {
                                 return (
                                          <>
                                               <a href={`/debit/printNoFile?id=${row.id}`} target="_blank" rel="noopener noreferrer">
                                                  <Button label="In" rounded icon="pi pi-print" severity="info" size="small" text />
                                              </a>
                                          </>
                                        )
                              }}
                          />
                          <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="so_cont" header="Số cont" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="dispatch_code" header="Mã điều xe" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="name" header="Tuyến vận chuyển" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="supplierName" header="Nhà cung cấp" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="supplierAbb" header="Tên viết tắt NCC" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="sup_bill" header="Số hóa đơn" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="sup_bill_date" body={(e: any) => DateBody(e.sup_bill_date)} header="Ngày xuất hóa đơn" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="purchase_price" header="Số tiền" 
                              footer={getSumColumn("purchase_price")}
                              footerStyle={{ fontWeight: "bold" }}
                          filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="purchase_vat" header="VAT" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="thanh_tien" header="Thành tiền" 
                              footer={getSumColumn("thanh_tien")}
                              footerStyle={{ fontWeight: "bold" }}
                          filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customer_vehicle_type" header="Loại xe KH" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="supplier_vehicle_type" header="Loại xe NCC" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="vehicle_number" header="Biển số xe" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_quantity" header="Lái xe" filter showFilterMenu={false} filterMatchMode="contains" />
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
