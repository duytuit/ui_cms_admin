import { useEffect, useMemo, useState } from "react";
import { Column, DataTableClient,} from "components/common/DataTable";
import { Dropdown, GridForm,Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { Helper } from "utils/helper";
import { useListDebitCongNoTongHopKH } from "../service";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Splitter } from "primereact/splitter";

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
      <div className="col-2">Ngày phiếu thu</div>
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

export default function ListTongHopKH() {
  const { handleParamUrl } = useHandleParamUrl();
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [paramsPaginator, setParamsPaginator] = useState({
    pageNum: 1,
    pageSize: 20,
    first: 0,
    render: false,
    keyword: "",
  });
  const { data, loading, error, refresh } = useListDebitCongNoTongHopKH({
    params: paramsPaginator,
    debounce: 500,
  });
    const [filters, setFilters] = useState({
      abbreviation:"",
      dvtk:"",
      chtk:"",
      ttdvtk:"",
      ttchtk:"",
      dvck:"",
      chck:"",
      ck:""
  });
      // --- Header template with filter ---
    const customerAbbHeader = (
       <div className="py-1">
           <Input
              value={filters.abbreviation}
              onChange={(e:any) => setFilters({ ...filters, abbreviation: e.target.value })}
              size="small"
              className={classNames("input-sm")}
            />
       </div>
    );
  const dvtkHeader = (
     <div className="py-1">
         <Input
            type="text"
            value={filters.dvtk}
            onChange={(e:any) => setFilters({ ...filters, dvtk: e.target.value })}
            label="><=giá trị"
            size="small"
            className={classNames("input-sm")}
          />
     </div>
  );   
  const chtkHeader = (
     <div className="py-1">
         <Input
            type="text"
            value={filters.chtk}
            onChange={(e:any) => setFilters({ ...filters, chtk: e.target.value })}
            label="><=giá trị"
            size="small"
            className={classNames("input-sm")}
          />
     </div>
  );  
  const ttdvtkHeader = (
     <div className="py-1">
         <Input
            type="text"
            value={filters.ttdvtk}
            onChange={(e:any) => setFilters({ ...filters, ttdvtk: e.target.value })}
            label="><=giá trị"
            size="small"
            className={classNames("input-sm")}
          />
     </div>
  );  
  const ttchtkHeader = (
     <div className="py-1">
         <Input
            type="text"
            value={filters.ttchtk}
            onChange={(e:any) => setFilters({ ...filters, ttchtk: e.target.value })}
            label="><=giá trị"
            size="small"
            className={classNames("input-sm")}
          />
     </div>
  ); 
    const dvckHeader = (
     <div className="py-1">
         <Input
            type="text"
            value={filters.dvck}
            onChange={(e:any) => setFilters({ ...filters, dvck: e.target.value })}
            label="><=giá trị"
            size="small"
            className={classNames("input-sm")}
          />
     </div>
  ); 
    const chckHeader = (
     <div className="py-1">
         <Input
            type="text"
            value={filters.chck}
            onChange={(e:any) => setFilters({ ...filters, chck: e.target.value })}
            label="><=giá trị"
            size="small"
            className={classNames("input-sm")}
          />
     </div>
  ); 
    const ckHeader = (
     <div className="py-1">
         <Input
            type="text"
            value={filters.ck}
            onChange={(e:any) => setFilters({ ...filters, ck: e.target.value })}
            label="><=giá trị"
            size="small"
            className={classNames("input-sm")}
          />
     </div>
  ); 
    // --- Filter dữ liệu dựa vào input ---
const applyFilters = (rows: any[]) => {
    return rows.filter((row) => {
        const f = filters;
          return (
            (f.abbreviation ? row.abbreviation?.toLowerCase().includes(f.abbreviation.toLowerCase()) : true)&&
             (f.dvtk.trim() ? (() => {
              const input = f.dvtk.trim();
              const match = input.match(/^([><=!]+)\s*(\d+(?:\.\d+)?)$/);
              let operator = '>';
              let num = 0;
              if (match) {
                operator = match[1];
                num = parseFloat(match[2]);
              } else {
                num = parseFloat(input);
                if (isNaN(num)) return true;
              }
              switch (operator) {
                case '>': return row.dvtk > num;
                case '>=': return row.dvtk >= num;
                case '=': case '==': return row.dvtk === num;
                case '<=': return row.dvtk <= num;
                case '<': return row.dvtk < num;
                default: return row.dvtk > num;
              }
            })() : true)
            &&
            (f.chtk.trim() ? (() => {
              const input = f.chtk.trim();
              const match = input.match(/^([><=!]+)\s*(\d+(?:\.\d+)?)$/);
              let operator = '>';
              let num = 0;
              if (match) {
                operator = match[1];
                num = parseFloat(match[2]);
              }
              else {
                num = parseFloat(input);
                if (isNaN(num)) return true;
              }
              switch (operator) {
                case '>': return row.chtk > num;
                case '>=': return row.chtk >= num;
                case '=': case '==': return row.chtk === num;
                case '<=': return row.chtk <= num;
                case '<': return row.chtk < num;
                default: return row.chtk > num;
              }
            })() : true)&&
             (f.ttdvtk.trim() ? (() => {
              const input = f.ttdvtk.trim();
              const match = input.match(/^([><=!]+)\s*(\d+(?:\.\d+)?)$/);
              let operator = '>';
              let num = 0;
              if (match) {
                operator = match[1];
                num = parseFloat(match[2]);
              } else {
                num = parseFloat(input);
                if (isNaN(num)) return true;
              }
              switch (operator) {
                case '>': return row.ttdvtk > num;
                case '>=': return row.ttdvtk >= num;
                case '=': case '==': return row.ttdvtk === num;
                case '<=': return row.ttdvtk <= num;
                case '<': return row.ttdvtk < num;
                default: return row.ttdvtk > num;
              }
            })() : true)
            &&
            (f.ttchtk.trim() ? (() => {
              const input = f.ttchtk.trim();
              const match = input.match(/^([><=!]+)\s*(\d+(?:\.\d+)?)$/);
              let operator = '>';
              let num = 0;
              if (match) {
                operator = match[1];
                num = parseFloat(match[2]);
              }
              else {
                num = parseFloat(input);
                if (isNaN(num)) return true;
              }
              switch (operator) {
                case '>': return row.ttchtk > num;
                case '>=': return row.ttchtk >= num;
                case '=': case '==': return row.ttchtk === num;
                case '<=': return row.ttchtk <= num;
                case '<': return row.ttchtk < num;
                default: return row.ttchtk > num;
              }
            })() : true)&&
               (f.dvck.trim() ? (() => {
              const input = f.dvck.trim();
              const match = input.match(/^([><=!]+)\s*(\d+(?:\.\d+)?)$/);
              let operator = '>';
              let num = 0;
              if (match) {
                operator = match[1];
                num = parseFloat(match[2]);
              }
              else {
                num = parseFloat(input);
                if (isNaN(num)) return true;
              }
              switch (operator) {
                case '>': return row.dvck > num;
                case '>=': return row.dvck >= num;
                case '=': case '==': return row.dvck === num;
                case '<=': return row.dvck <= num;
                case '<': return row.dvck < num;
                default: return row.dvck > num;
              }
            })() : true)&&
              (f.chck.trim() ? (() => {
              const input = f.chck.trim();
              const match = input.match(/^([><=!]+)\s*(\d+(?:\.\d+)?)$/);
              let operator = '>';
              let num = 0;
              if (match) {
                operator = match[1];
                num = parseFloat(match[2]);
              }
              else {
                num = parseFloat(input);
                if (isNaN(num)) return true;
              }
              switch (operator) {
                case '>': return row.chck > num;
                case '>=': return row.chck >= num;
                case '=': case '==': return row.chck === num;
                case '<=': return row.chck <= num;
                case '<': return row.chck < num;
                default: return row.chck > num;
              }
            })() : true)&&
             (f.ck.trim() ? (() => {
              const input = f.ck.trim();
              const match = input.match(/^([><=!]+)\s*(\d+(?:\.\d+)?)$/);
              let operator = '>';
              let num = 0;
              if (match) {
                operator = match[1];
                num = parseFloat(match[2]);
              }
              else {
                num = parseFloat(input);
                if (isNaN(num)) return true;
              }
              switch (operator) {
                case '>': return row.ck > num;
                case '>=': return row.ck >= num;
                case '=': case '==': return row.ck === num;
                case '<=': return row.ck <= num;
                case '<': return row.ck < num;
                default: return row.ck > num;
              }
            })() : true)
        );
    });
};
 const getSumColumn = (field: string) => {
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
  // ✅ Client-side pagination
  useEffect(() => {
    if (!data) return;
    handleParamUrl(paramsPaginator);
         const mapped = (data || []).map((row: any) => {
                    return {
                        ...row,
                    };
                });
          const filtered = applyFilters(mapped);
    setDisplayData(filtered);
    
  }, [data, paramsPaginator,filters]);
  const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column rowSpan={2} />
                <Column header="Thông Tin" headerClassName="my-title-center" />
                <Column header="Đầu kỳ" headerClassName="my-title-center" colSpan={2} />
                <Column header="Trong kỳ" headerClassName="my-title-center" colSpan={2} />
                <Column header="Thanh toán" headerClassName="my-title-center" colSpan={2} />
                <Column header="Cuối kỳ" headerClassName="my-title-center" colSpan={3} />
            </Row>
            <Row>
                <Column header="Khách hàng" />
                <Column header="Phí DVDK" />
                <Column header="Phí CHDK" />
                <Column header="Phí DVTK" />
                <Column header="Phí CHTK" />
                <Column header="Thanh toán DVTK" />
                <Column header="Thanh toán CHTK" />
                <Column header="DVCK" />
                <Column header="CHCK" />
                <Column header="Còn lại" />
            </Row>
             <Row>
                <Column />
                <Column header={customerAbbHeader} headerClassName="my-title-center"/>
                <Column />
                <Column />
                <Column header={dvtkHeader}/>
                <Column header={chtkHeader}/>
                <Column header={ttdvtkHeader}/>
                <Column header={ttchtkHeader}/>
                <Column header={dvckHeader}/>
                <Column header={chckHeader}/>
                <Column header={ckHeader}/>
            </Row>
        </ColumnGroup>
    );
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
                    headerColumnGroup={headerGroup}
                    loading={loading}
                    dataKey="id"
                    title="Tài khoản"
                    filterDisplay="row"
                    className={classNames("Custom-DataTableClient")}
                    scrollable
                    scrollHeight="flex"
                    style={{ flex: 1 }}
                    tableStyle={{ minWidth: "1600px" }} // ép bảng rộng hơn để có scroll ngang
                  >
                    <Column field="abbreviation"  filter showFilterMenu={false} filterMatchMode="contains" />
                    <Column field="dvdk"  
                      body={(row: any) =>{
                          return Helper.formatCurrency(row.dvdk.toString());
                      }} 
                      footer={getSumColumn("dvdk")}
                      footerStyle={{ fontWeight: "bold" }}
                    />
                    <Column field="chdk"  
                      body={(row: any) =>{
                          return Helper.formatCurrency(row.chdk.toString());
                      }} 
                      footer={getSumColumn("chdk")}
                      footerStyle={{ fontWeight: "bold" }}
                    />
                    <Column field="dvtk"  
                      body={(row: any) =>{
                          return Helper.formatCurrency(row.dvtk.toString());
                      }} 
                      footer={getSumColumn("dvtk")}
                      footerStyle={{ fontWeight: "bold" }}
                    />
                    <Column field="chtk"  
                      body={(row: any) =>{
                          return Helper.formatCurrency(row.chtk.toString());
                      }} 
                      footer={getSumColumn("chtk")}
                      footerStyle={{ fontWeight: "bold" }}
                    />
                    <Column field="ttdvtk"  
                      body={(row: any) =>{
                          return Helper.formatCurrency(row.ttdvtk.toString());
                      }} 
                      footer={getSumColumn("ttdvtk")}
                      footerStyle={{ fontWeight: "bold" }}
                    />
                    <Column field="ttchtk"  
                      body={(row: any) =>{
                          return Helper.formatCurrency(row.ttchtk.toString());
                      }} 
                      footer={getSumColumn("ttchtk")}
                      footerStyle={{ fontWeight: "bold" }}
                    />
                    <Column field="dvck"  
                      body={(row: any) =>{
                          return Helper.formatCurrency(row.dvck.toString());
                      }} 
                      footer={getSumColumn("dvck")}
                      footerStyle={{ fontWeight: "bold" }}
                    />
                    <Column field="chck"  
                      body={(row: any) =>{
                          return Helper.formatCurrency(row.chck.toString());
                      }} 
                      footer={getSumColumn("chck")}
                      footerStyle={{ fontWeight: "bold" }}
                    />
                    <Column field="ck" 
                      body={(row: any) =>{
                          return Helper.formatCurrency(row.ck.toString());
                      }} 
                      footer={getSumColumn("ck")}
                      footerStyle={{ fontWeight: "bold" }}
                    />
                  </DataTableClient>
              </div>
            </Splitter>
        </div>
      </div>
    </>
  );
}
