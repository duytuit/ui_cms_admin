import { useEffect, useMemo, useRef, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, DataTableClient, DateBody } from "components/common/DataTable";
import { Calendar, CalendarY, Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { setCustomer, setVendor } from "redux/features/partner";
import { useDispatch, useSelector } from "react-redux";
import { loaiHang, loaiToKhai, nghiepVu, phatSinh, tinhChat } from "utils";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { useListUserWithState } from "modules/user/service";
import { Checkbox, Dialog } from "components/uiCore";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useListContractFile, useListContractFileNotService, useListContractFileWithState } from "modules/ContractFile/service";
import { deleteContractFile } from "modules/ContractFile/api";
import UpdateDebitChiPhi from "./update_service";
import { useListDebit, useListDebitService } from "../service";
import { deleteDebit } from "../api";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator }: any) => {
    const [filter, setFilter] = useState({ name: "", customerDetailId: 0 ,fromDate:Helper.lastWeekString(),toDate:Helper.toDayString()});
    const { data: customerDetails } = useListCustomerDetailWithState({status:1});
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
            customerDetailId : filter.customerDetailId,
            fromDate: filter.fromDate,
            toDate:filter.toDate,
        }));
    }, [filter]);

    return (
        <GridForm
            paramsPaginator={_paramsPaginator}
            setParamsPaginator={_setParamsPaginator}
            filter={filter}
            setFilter={setFilter}
            className="lg:col-9"
        >
            <div className="col-2">
                <Input
                    value={filter.name}
                    onChange={(e: any) => setFilter({ ...filter, name: e.target.value })}
                    label="Tìm kiếm"
                    size="small"
                    className={classNames("input-sm")}
                />
            </div>
            <div className="col-2">
                <MyCalendar dateFormat="dd/mm/yy" 
                    value={filter.fromDate} 
                    onChange={(e: any) =>
                    setFilter({ ...filter, fromDate: e })}
                    className={classNames("w-full", "p-inputtext", "input-sm")} />
            </div>
            <div className="col-2">
                <MyCalendar dateFormat="dd/mm/yy"
                  value={filter.toDate} 
                  onChange={(e: any) =>
                  setFilter({ ...filter, toDate: e })}
                  className={classNames("w-full", "p-inputtext", "input-sm")} />
            </div>
            <div className="col-6">
                <Dropdown
                    filter
                    showClear
                    value={filter.customerDetailId}
                    options={customerOptions}
                    onChange={(e: any) => setFilter({ ...filter, customerDetailId: e.target.value })}
                    label="Khách hàng"
                    className={classNames("dropdown-input-sm", "p-dropdown-sm")}
                />
            </div>
        </GridForm>
    );
};

export default function ListContractFileBangKe() {
    const { handleParamUrl } = useHandleParamUrl();
    const [selectedDebitServiceRows, setSelectedDebitServiceRows] = useState<any[]>([]);
    const [displayDebitServiceData, setDisplayDebitServiceData] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<any>();
    const [visible, setVisible] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [paramsPaginator, setParamsPaginator] = useState({
      pageNum: 1,
      pageSize: 20,
      first: 0,
      render: false,
      keyword: "",
    });
    const { data, loading, error, refresh } = useListContractFileNotService({ params: paramsPaginator, debounce: 500,});
    const { data: debitService } = useListDebitService({ params: {...paramsPaginator,},debounce: 500,});
    const { data: contractFile } = useListContractFileWithState({});
    const { data: listCustomer } = useListCustomerDetailWithState({status: 1});
    const { data: listUser } = useListUserWithState({});
    const { data: listEmployee } = useListEmployeeWithState({});
    const openDialogAdd = (id:number) => {
        setSelectedId(id);
        setVisible(true);
    };
    // ✅ Client-side pagination
    useEffect(() => {
        if (!data) return;
        handleParamUrl(paramsPaginator);
        const mapped = (data?.data || []).map((row: any) => {
            const cus = listCustomer.find((x: any) => x.id === row.customer_detail_id);
            const _user = listUser.find((x: any) => x.id === row.updated_by);
            return {
                ...row,
                customerName: cus?.partners?.name || "",
                customerAbb: cus?.partners?.abbreviation || "",
                userName: `${_user.last_name ?? ""} ${_user.first_name ?? ""}`.trim(),
            };
        });

          const mappedDebitService = (debitService?.data || []).map((row: any) => {
          const _customer = listCustomer.find((x: any) => x.id === row.customer_detail_id);
          const _user = listUser.find((x: any) => x.id === row.updated_by);
          const _fileContract = contractFile.find((x: any) => x.id === row.file_info_id);
          return {
              ...row,
              customerName:_customer?.partners?.name || "",
              customerAbb:_customer?.partners?.abbreviation || "",
              file_number : _fileContract?.file_number,
              so_cont : _fileContract?.container_code,
          };
        });

        setDisplayData(mapped);
        setDisplayDebitServiceData(mappedDebitService);
    }, [first, rows, data,debitService, paramsPaginator,listCustomer]);
 
    return (
      <>
        <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />
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
                            <b>File chưa tạo bảng kê</b>
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
                                tableStyle={{ minWidth: "1600px" }}// ép bảng rộng hơn để có scroll ngang
                                >
                                {/* Custom checkbox column */}
                                <Column
                                    header={
                                    <Checkbox
                                        checked={selectedRows.length === displayData.length && displayData.length > 0}
                                        onChange={(e:any) => {
                                            if (e.checked) setSelectedRows(displayData.map(d => d.id));
                                            else setSelectedRows([]);
                                        }}
                                    />
                                    }
                                    body={(rowData:any) => (
                                    <Checkbox
                                        className="p-checkbox-sm"
                                        checked={selectedRows.includes(rowData.id)}
                                        onChange={(e:any) => {
                                            if (e.checked) setSelectedRows(prev => [...prev, rowData.id]);
                                            else setSelectedRows(prev => prev.filter(id => id !== rowData.id));
                                        }}
                                        onClick={(e:any) => e.stopPropagation()} // ⚡ chặn row click
                                    />
                                    )}
                                    style={{ width: "3em" }}
                                />
                               <Column
                                  header="Thao tác"
                                  body={(e: any) =>
                                    ActionBody(e, null, null, null, null, () =>
                                      openDialogAdd(e.id)
                                    )
                                  }
                                  style={{ width: "6em" }}
                                />
                                <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="listEmployee" header="Giao nhận" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="sumTongPrice" header="Duyệt ứng" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="declaration" header="Số bill" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="quantity" header="Số lượng" filter showFilterMenu={false} filterMatchMode="contains" />
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
                          <Splitter layout="vertical" style={{ height: '100%' }}>
                            {/* Panel 2.1 */}
                            <SplitterPanel
                              size={75}
                              minSize={10}
                              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                            >
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                 <b>Bảng kê chi phí đã tạo</b>
                                  <DataTableClient
                                      rowHover
                                      value={displayDebitServiceData}
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
                                        header={
                                          <Checkbox
                                            checked={
                                              selectedDebitServiceRows.length === displayDebitServiceData.length &&
                                              displayDebitServiceData.length > 0
                                            }
                                            onChange={(e: any) => {
                                              if (e.checked)
                                                setSelectedDebitServiceRows(displayDebitServiceData.map((d) => d.id));
                                              else setSelectedDebitServiceRows([]);
                                            }}
                                          />
                                        }
                                        body={(rowData: any) => (
                                          <Checkbox
                                            className="p-checkbox-sm"
                                            checked={selectedDebitServiceRows.includes(rowData.id)}
                                            onChange={(e: any) => {
                                              if (e.checked)
                                                setSelectedDebitServiceRows((prev) => [...prev, rowData.id]);
                                              else
                                                setSelectedDebitServiceRows((prev) =>
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
                                                return ActionBody(
                                                    row,
                                                    null,
                                                    { route: "/Debit/delete", action: deleteDebit },
                                                    paramsPaginator,
                                                    setParamsPaginator
                                                );
                                            }}
                                        />
                                        <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="declaration_quantity" header="Duyệt ứng" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="declaration_quantity" header="Tổng phí HQ" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="declaration_quantity" header="Tổng phí CH" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="declaration_quantity" header="Tiền cược" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="declaration_quantity" header="Phải thanh toán" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="declaration_quantity" header="Tên giao nhận" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="declaration_quantity" header="Xác nhận" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="declaration_quantity" header="Thời gian xác nhận" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="declaration_quantity" header="Đã duyệt" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="declaration_quantity" header="Thời gian duyệt" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="declaration_quantity" header="Lý do duyệt" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="declaration_quantity" header="Người cập nhật" filter showFilterMenu={false} filterMatchMode="contains" />
                                         <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                                  </DataTableClient>
                              </div>
                            </SplitterPanel>
            
                            {/* Panel 2.2 */}
                            <SplitterPanel
                              size={25}
                              minSize={10}
                              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                            >
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <b>Chi tiết bảng kê chi phí</b>

                              </div>
                            </SplitterPanel>
                          </Splitter>
                        </SplitterPanel>
                      </Splitter>
                    </div>
        </div>
         <Dialog
            position="top"
            dismissableMask
            header="Tạo bảng kê chi phí"
            visible={visible}
            onHide={() => setVisible(false)}
            style={{ width: "78vw" }}
          >
            <p className="m-0">
              {selectedId && <UpdateDebitChiPhi id={selectedId}  onClose={() => setVisible(false)} ></UpdateDebitChiPhi>}
            </p>
          </Dialog>
      </>
    );
}
