import { useEffect, useMemo, useState } from "react";
import { Column, DataTableClient, DateBody, } from "components/common/DataTable";
import { Dropdown, GridForm } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useGetPartnerWithDebitNoBill } from "modules/partner/service";
import { Button, Checkbox, Dialog, Tag } from "components/uiCore";
import { Helper } from "utils/helper";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useGetObjectDebitChiTietNoBillKHAsync } from "../service";
import { FilterMatchMode } from "primereact/api";
import { useGetObjectTaskAsync } from "modules/bill/service";
import UpdateKyCongNoKH from "./update_kycongno_kh";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator, selectedRows, refreshBill, setSelectedRows,refresh,cycleName }: any) => {
  const [filter, setFilter] = useState({
    name: "",
    customerDetailId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
  const [visible, setVisible] = useState(false);
  const [customerCreditLimitMonth, setCustomerCreditLimitMonth] = useState<number>(0);
  const [customer, setCustomer] = useState<any[]>([]);
  const { data: customerHasDebit, refresh: refreshPartner} = useGetPartnerWithDebitNoBill({params:{a:"abc"}});
  const customerOptions = useMemo(() => {
  const list = customerHasDebit?.data;
  if (!Array.isArray(list)) return [];
  setCustomer(list)
  return list.map((x: any) => ({
    label: x.oldest_accounting_date
      ? `${x.abbreviation} - Phát sinh từ ${Helper.formatDMYLocal(x.oldest_accounting_date)}`
      : `${x.abbreviation} - Không có phát sinh`,
    value: x.customer_detail_id,
  }));
}, [customerHasDebit]);
  const openDialogAdd = (e:any) => {
      setVisible(true)
  };
  const handleModalClose = () => {
      setVisible(false);
      refreshBill?.();
      refresh?.();
      refreshPartner?.();
      setSelectedRows([])
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
      openDialogAddName="Tạo kỳ công nợ"
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
          onChange={(e: any) => {
            const customerId = e.target.value;

            const selectedCustomer = customer.find(
              (x: any) => x.customer_detail_id === customerId
            );
            console.log(selectedCustomer);
            
            setCustomerCreditLimitMonth(selectedCustomer.customer_credit_limit_month)
            setFilter((prev: any) => ({
              ...prev,
              customerDetailId: customerId,
              fromDate: selectedCustomer?.oldest_accounting_date
                ? Helper.formatDMYLocal(selectedCustomer.oldest_accounting_date)
                : Helper.lastWeekString(),
            }));
          }}
          label="Khách hàng"
          className={classNames("dropdown-input-sm", "p-dropdown-sm")}
        />
      </div>
    </GridForm>
     <Dialog
            position="top"
            dismissableMask
            visible={visible}
            onHide={() => setVisible(false)}
            style={{ width: "30vw", top:"30px"}}
        >
          <p className="m-0">
            {selectedRows && <UpdateKyCongNoKH customerDetailId={filter.customerDetailId} customerCreditLimitMonth={customerCreditLimitMonth} ids={selectedRows} cycleName={cycleName} onClose={handleModalClose} ></UpdateKyCongNoKH>}
          </p>
      </Dialog>
    </>
  );
};

export default function ListKyCongNoKH() {
  const { handleParamUrl } = useHandleParamUrl();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedDebitDispatchRows, setSelectedDebitDispatchRows] = useState<any[]>([]);
  const [displayBill, setDisplayBill] = useState<any[]>([]);
  const [displayDataNoBill, setDisplayDataNoBill] = useState<any[]>([]);
  const [displayDataHasBill, setDisplayDataHasBill] = useState<any[]>([]);
  const [cycleName, setCycleName] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<any>();
  const [paramsPaginator, setParamsPaginator] = useState({
    pageNum: 1,
    pageSize: 20,
    first: 0,
    render: false,
  });
    const [filters, setFilters] = useState({  
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      file_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
     });
  const { data, loading, error, refresh } = useGetObjectDebitChiTietNoBillKHAsync({params: paramsPaginator,debounce: 500,});
  const { data: dataBill, refresh: refreshBill  } = useGetObjectTaskAsync({params: {...paramsPaginator}, debounce: 500,});
  //const { data: dataDebitHasBill, refresh: refreshDebitHasBill } = useGetObjectDebitChiTietHasBillKHAsync({params: {...paramsPaginator}, debounce: 500,});

  // ✅ Client-side pagination
  useEffect(() => {
    if (!data?.data || !dataBill?.data) return;
    handleParamUrl(paramsPaginator);
    const mapped = (data?.data || []).map((row: any) => {
      const _data = JSON.parse(row.data);
      const total_price = row.price + row.price_com;
      const thanh_tien_dv = Math.round(total_price * (1 + row.vat / 100));
      const thanh_tien_ch = Math.round(row.price * (1 + row.vat / 100));
      return {
        ...row,
          fileNumber: _data?.fileNumber || "không file",
          thanhtien_dv: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5 || row.type === 8) ? thanh_tien_dv : 0,
          thanhtien_ch: (row.type === 2 || row.type === 3 || row.type === 6) ? thanh_tien_ch : 0,
      };
    });
    const _dataBill = dataBill.data
    setCycleName(_dataBill?.map((x: any) => x.cycle_name) ?? []);
    setDisplayDataNoBill(mapped);
   const dataBill_mapped = (dataBill?.data || []).map((row: any) => {
      let tagStatus = {
        value: "",
        severity: "" as "success" | "warning" | "danger",
      };

      if (row.total_debit === row.total_receipt) {
        tagStatus = {
          value: "Đã thanh toán",
          severity: "success",
        };
      } else if (row.total_debit > row.total_receipt) {
        tagStatus = {
          value: "Đang thanh toán",
          severity: "warning",
        };
      } else {
        tagStatus = {
          value: "Chưa thanh toán",
          severity: "danger",
        };
      }

      return {
        ...row,
        tagStatus,
      };
    });
    setDisplayBill(dataBill_mapped);
  }, [data,dataBill, paramsPaginator]);
   const getSumColumn = (field: string) => {
        const filtered = (displayDataNoBill??[]).filter((item: any) => {
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
  return (
    <>
      <div className="card">
        <Header
          _paramsPaginator={paramsPaginator}
          _setParamsPaginator={setParamsPaginator}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          refreshBill={refreshBill}
          refresh={refresh}
          cycleName={cycleName}
        />
        <div style={{ height: 'calc(100vh - 8rem)' }}>
          <Splitter style={{ height: '100%', width: '100%' }}>
            {/* Panel 1 */}
            <SplitterPanel
              size={30}
              minSize={10}
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <b>Chi tiết công nợ chưa tạo kỳ</b>
                <DataTableClient
                  rowHover
                  value={displayDataNoBill}
                  loading={loading}
                  dataKey="id"
                  title="Tài khoản"
                  filterDisplay="row"
                  className={classNames("Custom-DataTableClient")}
                  scrollable
                  scrollHeight="flex"
                  style={{ flex: 1 }}
                  tableStyle={{ minWidth: "600px" }}
                >
                  {/* Custom checkbox column */}
                  <Column
                    header={
                      <Checkbox
                        checked={
                          selectedRows.length === displayDataNoBill.length &&
                          displayDataNoBill.length > 0
                        }
                        onChange={(e: any) => {
                          if (e.checked)
                            setSelectedRows(displayDataNoBill.map((d) => d.id));
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
                  <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} style={{ width: "6em" }} />
                  <Column field="fileNumber" header="Số file" filter showFilterMenu={false} filterMatchMode="contains"  style={{ width: "6em" }} />
                  <Column field="name" header="Nội dung" filter showFilterMenu={false} filterMatchMode="contains"  />
                  <Column // dịch vụ
                    body={(row: any) =>{
                      return Helper.formatCurrency(row.thanhtien_dv.toString());
                    }} 
                    footer={getSumColumn("thanhtien_dv")}
                    footerStyle={{ fontWeight: "bold" }}
                  />
                  <Column // chi hộ
                    body={(row: any) =>{
                      return Helper.formatCurrency(row.thanhtien_ch.toString());
                    }} 
                    footer={getSumColumn("thanhtien_ch")}
                    footerStyle={{ fontWeight: "bold" }}
                  />
                </DataTableClient>
              </div>
            </SplitterPanel>

            {/* Panel 2 */}
            <SplitterPanel
              size={40}
              minSize={20}
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                     <b>Kỳ công nợ đã tạo</b>
                      <DataTableClient
                        rowHover
                        value={displayBill}
                        loading={loading}
                        dataKey="id"
                        filterDisplay="row"
                        className={classNames("Custom-DataTableClient")}
                        scrollable
                        scrollHeight="flex"
                        style={{ flex: 1 }}
                        tableStyle={{ minWidth: "600px" }}
                      >
                        <Column header="Kỳ công nợ"
                         body={(row: any) =>{
                            return (
                              <>
                                 <table>
                                  <tbody>
                                     <tr>
                                        <td>Kỳ tháng: </td>
                                        <td><b>{row.cycle_name}</b></td>
                                     </tr>
                                     <tr>
                                        <td>Ngày hạch toán: </td>
                                        <td><b>{Helper.formatDMY(row.accounting_date)}</b></td>
                                     </tr>
                                     <tr>
                                        <td>Hạn thanh toán: </td>
                                        <td><b>{Helper.formatDMY(row.expiry_date)}</b></td>
                                     </tr>
                                     <tr>
                                        <td>Số tiền: </td>
                                        <td><b>{Helper.formatCurrency(row.total_debit.toString())}</b></td>
                                     </tr>
                                     <tr>
                                        <td>Thanh toán: </td>
                                        <td><b>{Helper.formatCurrency(row.total_receipt.toString())}</b></td>
                                     </tr>
                                     <tr>
                                        <td>Trạng thái:</td>
                                        <td>
                                          <Tag
                                              value={row.tagStatus?.value ?? "Chưa xác định"}
                                              severity={row.tagStatus?.severity ?? "info"}
                                            />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Thao tác: </td>
                                        <td>
                                            <Button icon='pi pi-trash' label="Xóa" severity="danger" size="small" raised />
                                            <Button icon='pi pi-plus' label="Bổ sung"  className="ml-1" severity="info" size="small" raised />
                                        </td>
                                     </tr>
                                  </tbody>
                                 </table>
                              </>
                            )
                          }} 
                         headerClassName="my-title-center" />
                    </DataTableClient>
                  </div>
            </SplitterPanel>
             {/* Panel 2 */}
            <SplitterPanel
              size={30}
              minSize={20}
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                     <b>Chi tiết theo kỳ công nợ</b>
                      <DataTableClient
                        rowHover
                        value={displayDataHasBill}
                        loading={loading}
                        dataKey="id"
                        filterDisplay="row"
                        className={classNames("Custom-DataTableClient")}
                        scrollable
                        scrollHeight="flex"
                        style={{ flex: 1 }}
                        tableStyle={{ minWidth: "600px" }}
                      >
                        <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} style={{ width: "6em" }} />
                        <Column field="fileNumber" header="Số file" filter showFilterMenu={false} filterMatchMode="contains"  style={{ width: "6em" }} />
                        <Column field="name" header="Nội dung" filter showFilterMenu={false} filterMatchMode="contains"  />
                        <Column // dịch vụ
                          body={(row: any) =>{
                            return Helper.formatCurrency(row.thanhtien_dv.toString());
                          }} 
                          footer={getSumColumn("thanhtien_dv")}
                          footerStyle={{ fontWeight: "bold" }}
                        />
                        <Column // chi hộ
                          body={(row: any) =>{
                            return Helper.formatCurrency(row.thanhtien_ch.toString());
                          }} 
                          footer={getSumColumn("thanhtien_ch")}
                          footerStyle={{ fontWeight: "bold" }}
                        />
                    </DataTableClient>
                  </div>
            </SplitterPanel>
          </Splitter>
        </div>
      </div>
    </>
  );
}
