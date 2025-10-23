import { useEffect, useMemo, useRef, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, DataTableClient } from "components/common/DataTable";
import { Calendar, CalendarY, Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { deleteContractFile, listContractFile, updateContractFile } from "../api";
import { useListContractFile } from "../service";
import { useListPartnerDetail } from "modules/partner/service";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator }: any) => {
    const [filter, setFilter] = useState({ name: "" ,PartnerDetailId:""});
      const { data: partnerDetails } = useListPartnerDetail({
    params: { status: 1 },// lấy danh sách khách hàng
    debounce: 500,
  });
   // --- chuyển sang options bằng useMemo ---
  const partnerOptions = useMemo(() => {
    if (!Array.isArray(partnerDetails.data)) return [];
    return partnerDetails.data.map((x: any) => ({
      label: x?.partners?.abbreviation ?? "(không tên)",
      value: x.id,
    }));
  }, [partnerDetails]);
    useEffect(() => {
        // Mỗi khi filter thay đổi => cập nhật params
        _setParamsPaginator((prev: any) => ({
            ...prev,
            keyword: filter.name,
        }));
    }, [filter.name]);

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
                <MyCalendar dateFormat="dd/mm/yy" className={classNames("w-full","p-inputtext","input-sm")}/>
            </div>
            <div className="col-2">
                <MyCalendar dateFormat="dd/mm/yy" className={classNames("w-full","p-inputtext","input-sm")}/>
            </div>
            <div className="col-6">
                <Dropdown
                      filter
                      value={filter.PartnerDetailId}
                      options={partnerOptions}
                      onChange={(e: any) => setFilter({ ...filter, PartnerDetailId: e.target.value })}
                      label="Khách hàng"
                      className={classNames("dropdown-input-sm","p-dropdown-sm")}
                      required
                    />
            </div>
        </GridForm>
    );
};

export default function ListContractFile() {
    const { handleParamUrl } = useHandleParamUrl();
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
 
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
       // ✅ Client-side pagination
       useEffect(() => {
           if (!data) return;
           handleParamUrl(paramsPaginator);
           setDisplayData(data?.data || []);
       }, [first, rows, data, paramsPaginator]);

    return (
        <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />

            <DataTableClient
                rowHover
                value={displayData}
                paginator
                rows={rows}
                first={first}
                totalRecords={ data?.total}
                currentPageReportTemplate="Tổng số: {totalRecords} bản ghi"
                onPage={(e: any) => {
                    setFirst(e.first);
                    setRows(e.rows);
                }}
                loading={loading}
                selectionMode="multiple"
                selection={selectedRows}
                onSelectionChange={(e: any) => setSelectedRows(e.value)}
                dataKey="id"
                title="Tài khoản"
                filterDisplay="row"
                className={classNames("Custom-DataTableClient")}
                scrollable
                tableStyle={{ minWidth: "2600px" }} // ép bảng rộng hơn để có scroll ngang
            >
                <Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
                <Column field="accounting_date" header="Ngày lập" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="file_number" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="file_number" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="declaration" header="Số tờ khai" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="quantity" header="Số lượng" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="container_code" header="Số cont" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="sales" header="Tên sales" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="bill" header="Giao nhận" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="bill" header="Duyệt ứng" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="feature" header="Tính chất" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="type" header="Loại hàng" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="declaration_quantity" header="Số lượng tờ khai" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="declaration_type" header="Loại tờ khai" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="business" header="Nghiệp vụ" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="occurrence" header="Phát sinh" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="bill" header="Người thực hiện" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                <Column
                    header="Thao tác"
                    body={(e: any) =>
                        ActionBody(
                            e,
                            "/ContractFile/detail",
                            { route: "/ContractFile/delete", action: deleteContractFile },
                            paramsPaginator,
                            setParamsPaginator
                        )
                    }
                />
            </DataTableClient>
        </div>
    );
}