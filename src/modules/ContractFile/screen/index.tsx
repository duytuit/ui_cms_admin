import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActionBody,
  Column,
  TimeBody,
  DataTableClient,
  DateBody,
} from "components/common/DataTable";
import {
  Dropdown,
  GridForm,
  Input,
} from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import {
  deleteContractFile,
  ExportXuatHoaDon,
} from "../api";
import { useListContractFile } from "../service";
import { loaiHang, loaiToKhai, nghiepVu, phatSinh, tinhChat } from "utils";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { useListUserWithState } from "modules/user/service";
import { Checkbox, Dialog } from "components/uiCore";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { Splitter } from "primereact/splitter";
import { FilterMatchMode } from "primereact/api";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator }: any) => {
  const [filter, setFilter] = useState({
    name: "",
    customerDetailId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
  const { data: customerDetails } = useListCustomerDetailWithState({ status: 1});
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
      // Invoice:1
    }));
  }, [filter]);
  async function ExportHoaDonKH(){
      const respo = await ExportXuatHoaDon(Helper.convertObjectToQueryString(_paramsPaginator));
      const url = window.URL.createObjectURL(new Blob([respo.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'hoa_don_kh.xlsx'); // or any other extension
      document.body.appendChild(link);
      link.click();
      link?.parentNode?.removeChild(link);  
    }
  const items = [
        {
            label: 'Xuất chi tiết hóa đơn',
            icon: "pi pi-file-export",
            command: () => ExportHoaDonKH()
        }
    ];
  return (
    <GridForm
      paramsPaginator={_paramsPaginator}
      setParamsPaginator={_setParamsPaginator}
      filter={filter}
      setFilter={setFilter}
      className="lg:col-9"
      add="/ContractFile/add"
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
  );
};

export default function ListContractFile() {
  const { handleParamUrl } = useHandleParamUrl();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<any>();
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const { data: customers } = useListCustomerDetailWithState({status: 1});
    const [filters, setFilters] = useState({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          customerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
          customerAbb: { value: null, matchMode: FilterMatchMode.CONTAINS },
          feature: { value: null, matchMode: FilterMatchMode.CONTAINS },
          type: { value: null, matchMode: FilterMatchMode.CONTAINS },
          declaration_type: { value: null, matchMode: FilterMatchMode.CONTAINS },
          declaration: { value: null, matchMode: FilterMatchMode.CONTAINS },
          occurrence: { value: null, matchMode: FilterMatchMode.CONTAINS },
          quantity: { value: null, matchMode: FilterMatchMode.CONTAINS },
          business: { value: null, matchMode: FilterMatchMode.CONTAINS },
          listEmployee: { value: null, matchMode: FilterMatchMode.CONTAINS },
          file_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
          bill: { value: null, matchMode: FilterMatchMode.CONTAINS },
          sales: { value: null, matchMode: FilterMatchMode.CONTAINS },
          container_code: { value: null, matchMode: FilterMatchMode.CONTAINS },
          note: { value: null, matchMode: FilterMatchMode.CONTAINS },
          });
  const [paramsPaginator, setParamsPaginator] = useState({
    pageNum: 1,
    pageSize: 20,
    first: 0,
    render: false,
    keyword: "",
  });
  const { data, loading, error, refresh } = useListContractFile({
    params: paramsPaginator,
    debounce: 500,
  });
  const { data: userInfos } = useListUserWithState({});
  const userInfosOptions = useMemo(() => {
    return userInfos;
  }, [userInfos]);
  const { data: employeeInfos } = useListEmployeeWithState({});
  const employeeOptions = useMemo(() => {
    return employeeInfos;
  }, [employeeInfos]);
  // ✅ Client-side pagination
  useEffect(() => {
    if (!data) return;
    handleParamUrl(paramsPaginator);
    const mapped = (data?.data || []).map((row: any) => {
      const cus = customers.find((x: any) => x.id === row.customer_detail_id);
      const _tinhChat = tinhChat.find((x: any) => x.feature === row.feature);
      const _loaiHang = loaiHang.find((x: any) => x.type === row.type);
      const _loaiToKhai = loaiToKhai.find(
        (x: any) => x.DeclarationType === row.declaration_type
      );
      const _phatSinh = phatSinh.find(
        (x: any) => x.occurrence === row.occurrence
      );
      const _nghiepVu = nghiepVu.find((x: any) => x.business === row.business);
      const _user = employeeOptions.find((x: any) => x.user_id === row.updated_by);
      let _sumTongPrice = 0;
      let _listEmployee = "";
      if (row?.file_info_details.length > 0) {
        row.file_info_details.forEach((element: any, index: number) => {
          _sumTongPrice += element.price;
          const _employee = employeeOptions.find(
            (x: any) => x.id === element.employee_id
          );
          const fullName = `${_employee?.last_name ?? ""} ${_employee?.first_name ?? ""
            }`.trim();
          // thêm dấu ; giữa các tên, không thêm sau tên cuối cùng
          _listEmployee +=
            fullName + (index < row.file_info_details.length - 1 ? ";" : "");
        });
      }
       let _sumAmount = 0;
       if (row?.receipts.length > 0) {
        row.receipts.forEach((element: any, index: number) => {
          _sumAmount += element.receipt_details?.amount || 0;
        });
      }

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
        sumTongPrice: _sumTongPrice,
        listEmployee: _listEmployee,
        sumAmount: _sumAmount,
      };
    });
    setDisplayData(mapped);
  }, [employeeOptions, data, paramsPaginator, customers]);
    const getSumColumn = (field: string) => {
        const filtered = (displayData ?? []).filter((item: any) => {
            return Object.entries(filters).every(([key, f]: [string, any]) => {
                const value = f?.value?.toString().toLowerCase() ?? "";
                if (!value) return true;
                const cell = item[key]?.toString().toLowerCase() ?? "";
                return cell.includes(value);
            });
        });

        const sum = filtered.reduce((acc: number, item: any) => {
            const raw = item[field]?.toString() ?? "0";
            const val = parseFloat(raw.replace(/[^0-9.-]/g, "")) || 0; // giữ lại dấu âm
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
        />
        <div style={{ height: 'calc(100vh - 8rem)' }}>
          <Splitter style={{ height: '100%', width: '100%' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <DataTableClient
                rowHover
                value={displayData}
                currentPageReportTemplate="Tổng số: {totalRecords} bản ghi"
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
                tableStyle={{ minWidth: "2900px" }} // ép bảng rộng hơn để có scroll ngang
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
                        if (e.checked) setSelectedRows(displayData.map((d) => d.id));
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
                <Column header="Thao tác" body={(e: any) => {
                  if (e.debits == null) {
                    return ActionBody(
                          e,
                          "/ContractFile/detail",
                          { route: "/ContractFile/delete", action: deleteContractFile },
                          paramsPaginator,
                          setParamsPaginator
                      );
                  } else {
                    return ActionBody(
                          e,
                          "/ContractFile/detail",
                          null,
                          paramsPaginator,
                          setParamsPaginator
                      );
                  }
                }} style={{ width: "6em" }} />
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
                <Column body={(row: any) => Helper.formatCurrency(row.sumAmount.toString())} 
                  header="Duyệt ứng" filter showFilterMenu={false} filterMatchMode="contains" 
                  footer={getSumColumn("sumAmount")}
                  footerStyle={{ fontWeight: "bold" }}
                 />
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
          </Splitter>
        </div>
      </div>
    </>
  );
}
