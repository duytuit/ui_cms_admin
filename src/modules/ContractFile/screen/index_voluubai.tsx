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
import { Helper } from "utils/helper";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useListContractFile, useListContractFileWithState } from "modules/ContractFile/service";
import { FilterMatchMode } from "primereact/api";
import UpdateVoLuuBai from "./update_voluubai";
import { updateNullVoLuuCont } from "../api";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator,selected,refresh,refreshDebitDispatch ,_setSelectedRows,selectedDebitDispatchRows,_setSelectedDebitDispatchRows}: any) => {
  const [filter, setFilter] = useState({
    name: "",
    customerDetailId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
  const [visible, setVisible] = useState(false);
  const [visibleXuatHoaDon, setVisibleXuatHoaDon] = useState(false);
  const { data: customerDetails } = useListCustomerDetailWithState({status: 1});
  // --- chuyển sang options bằng useMemo ---
  const customerOptions = useMemo(() => {
    if (!Array.isArray(customerDetails)) return [];
    return customerDetails.map((x: any) => ({
      label: x?.partners?.abbreviation ?? "(không tên)",
      value: x.id,
    }));
  }, [customerDetails]);
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
    </>
  );
};

export default function ListVoLuuBai() {
  const { handleParamUrl } = useHandleParamUrl();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedDebitDispatchRows, setSelectedDebitDispatchRows] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [displayDebitDispatchData, setDisplayDebitDispatchData] = useState<any[]>([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const [selectedIdEdit, setSelectedIdEdit] = useState<any>();
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visible, setVisible] = useState(false);
  const [noDebitfilters, setNoDebitfilters] = useState({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  dispatch_code: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  customerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  customerAbb: { value: null, matchMode: FilterMatchMode.CONTAINS },
  supplierName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  supplierAbb: { value: null, matchMode: FilterMatchMode.CONTAINS },
  file_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [filters, setFilters] = useState({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  dispatch_code: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
  const { data, loading, error, refresh } = useListContractFile({params: {...paramsPaginator,HasDateCont:2,HasExpiryDateCont:2},debounce: 500,});
  const { data: debitDispatch, refresh:refreshDebitDispatch  } = useListContractFile({params: {...paramsPaginator,HasDateCont:1,HasExpiryDateCont:1}, debounce: 500,});
  const { data: userInfosOptions } = useListUserWithState({});
  const getSumColumnNoDebit = (field: string) => {
        const filtered = (displayData??[]).filter((item: any) => {
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
      const getSumColumn = (field: string) => {
        const filtered = (displayDebitDispatchData??[]).filter((item: any) => {
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
  const openDialogAdd = (id: number) => {
    setSelectedRows([id]);
    setVisible(true);
  };
  const handleModalClose = () => {
    setVisible(false);
    refresh?.(); 
    refreshDebitDispatch?.(); // reload debitDispatch
  };
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
        const _customer = partners.find((x: any) => x.id === row.customer_detail_id);
        const _supplier = partners.find((x: any) => x.id === row.supplier_detail_id);
        const today = new Date();
        const expiredDate = new Date(row.ngay_het_han);

        today.setHours(0,0,0,0);
        expiredDate.setHours(0,0,0,0);

        const diffDays = Math.ceil(
          (expiredDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        return {
          ...row,
          customerName:_customer?.partners?.name || "",
          customerAbb:_customer?.partners?.abbreviation || "",
          supplierName:_supplier?.partners?.name || "",
          supplierAbb:_supplier?.partners?.abbreviation || "",
          so_ngay_con_lai: diffDays
        };
    });
    setDisplayData(mapped);
    setDisplayDebitDispatchData(mappedDebitDispatch);
  }, [first, rows, data, debitDispatch, paramsPaginator, partners]);
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
          selectedDebitDispatchRows={selectedDebitDispatchRows}
          _setSelectedDebitDispatchRows={setSelectedDebitDispatchRows}
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
                <b>Vỏ lưu bãi chưa tạo</b>
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
                        filters={noDebitfilters}
                        onFilter={(e:any) => setNoDebitfilters(e.filters)}
                        className={classNames("Custom-DataTableClient")}
                        scrollable
                        scrollHeight="flex"
                        style={{ flex: 1 }}
                        tableStyle={{ minWidth: "2900px" }}
                      >
                          <Column header="Thao tác" body={(e: any) => ActionBody(e, null, null, null, null, () => openDialogAdd(e.id))} style={{ width: "3em" }} />
                          <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="bill" header="Bill" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration" header="Số tờ khai" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="quantity" header="Số lượng" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="container_code" header="Số cont" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="sales" header="Tên sales" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="listEmployee" header="Giao nhận" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="feature" header="Tính chất" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="type" header="Loại hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_quantity" header="Số lượng tờ khai" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="declaration_type" header="Loại tờ khai" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="business" header="Nghiệp vụ" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="occurrence" header="Phát sinh" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="note" header="Ghi chú" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="userName" header="Người thực hiện" filter showFilterMenu={false} filterMatchMode="contains" />
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
                     <b>Vỏ lưu bãi đã tạo</b>
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
                        filters={filters}
                        onFilter={(e:any) => setFilters(e.filters)}
                        className={classNames("Custom-DataTableClient")}
                        scrollable
                        scrollHeight="flex"
                        style={{ flex: 1 }}
                        tableStyle={{ minWidth: "2000px" }}
                      >
                         <Column header="Thao tác" body={(e: any) => {
                              return ActionBody(
                                    e,
                                    null,
                                    { route: "ContractFile/updateNullVoLuuCont", action: updateNullVoLuuCont },
                                    paramsPaginator,
                                    setParamsPaginator
                                );
                          }} style={{ width: "3em" }} />
                          <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="ngay_keo_cont" header="Ngày kéo Cont" body={(e: any) => DateBody(e.ngay_keo_cont)} filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="ngay_het_han" header="Ngày hết hạn"  body={(e: any) => DateBody(e.ngay_het_han)} filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="so_ngay_con_lai" header="Số ngày lưu bãi còn lại" filter showFilterMenu={false} filterMatchMode="contains" />
                          <Column field="userName" header="Người thực hiện" filter showFilterMenu={false} filterMatchMode="contains" />
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
        header="Cập nhật thông tin"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "30vw", top:"30px" }}
      >
        <p className="m-0">
          {selectedRows && (
            <UpdateVoLuuBai
              ids={selectedRows}
              onClose={handleModalClose}
            ></UpdateVoLuuBai>
          )}
        </p>
      </Dialog>
    </>
  );
}
