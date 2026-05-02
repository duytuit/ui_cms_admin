import { useEffect, useMemo, useState } from "react";
import { Column, DataTableClient, DateBody, } from "components/common/DataTable";
import { Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListPartnerDetailWithState } from "modules/partner/service";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { FilterMatchMode } from "primereact/api";
import { useListBankWithState, useListExpenseWithState, useListFundCategoryWithState, useListIncomeExpenseWithState } from "modules/categories/service";
import { useListReceiptSoQuy, useListReceiptSoQuyDauKy } from "modules/receipt/service";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator ,dunoDK}: any) => {
  const [filter, setFilter] = useState({
    name: "",
    customerDetailId: "",
    bankId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
  const { data: DMBank } = useListBankWithState({type:1});
    const DMBankOptions = useMemo(() => {
        if (!Array.isArray(DMBank)) return [];
        return DMBank.map((x: any) => ({
          label: `${x.account_number} - ${x.account_holder}`,
          value: x.id,
        }));
      }, [DMBank]);
  useEffect(() => {
    // Mỗi khi filter thay đổi => cập nhật params
    _setParamsPaginator((prev: any) => ({
      ...prev,
      keyword: filter.name,
      customerDetailId: filter.customerDetailId,
      bankId: filter.bankId,
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
         <div className="col-4">
              <Dropdown
                filter
                showClear
                value={filter.bankId}
                options={DMBankOptions}
                onChange={(e: any) =>
                  setFilter({ ...filter, bankId: e.target.value })
                }
                label="Tài khoản"
                className={classNames("dropdown-input-sm", "p-dropdown-sm")}
              />
            </div>
            <div className="col-4">
                 <div><b>Dư nợ đầu kỳ: {dunoDK ? Helper.formatCurrency(parseInt(dunoDK).toString()):0}</b></div>
            </div>
    </GridForm>
  );
};

export default function ListBaoCaoTaiKhoan() {
  const { handleParamUrl } = useHandleParamUrl();
  const [filters, setFilters] = useState({
      code_receipt:"",
      note:"",
      tendoituong:"",
      lydo:"",
      thu:"",
      chi:"",
      ton:""
      });
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [dunoDK, setdunoDK] = useState<number>(0);
  const [paramsPaginator, setParamsPaginator] = useState({
    pageNum: 1,
    pageSize: 20,
    first: 0,
    render: false,
    keyword: "",
    FormOfPayment:2
  });
  const { data: employees } = useListEmployeeWithState({});
  const { data: DMExpense } = useListIncomeExpenseWithState({}); // danh mục chi phí
  const { data: DMBank } = useListBankWithState({type:1});
  const { data: DMQuy } = useListFundCategoryWithState({type:1});
  const { data: listPartner } = useListPartnerDetailWithState({});
  const { data, loading, error, refresh } = useListReceiptSoQuy({
    params: paramsPaginator,
    debounce: 500,
  });
  const { data:SoQuyDauKy} = useListReceiptSoQuyDauKy({
    params: paramsPaginator,
    debounce: 500,
  });
  // --- Header template with filter ---
    const codeReceiptHeader = (
        <div className="py-1">
            <Input
              value={filters.code_receipt}
              onChange={(e:any) => setFilters({ ...filters, code_receipt: e.target.value })}
              size="small"
              className={classNames("input-sm")}
            />
        </div>
    );
    const noteHeader = (
        <div className="py-1">
            <Input
              value={filters.note}
              onChange={(e:any) => setFilters({ ...filters, note: e.target.value })}
              size="small"
              className={classNames("input-sm")}
            />
        </div>
    );
    const tendoituongHeader = (
        <div className="py-1">
            <Input
              value={filters.tendoituong}
              onChange={(e:any) => setFilters({ ...filters, tendoituong: e.target.value })}
              size="small"
              className={classNames("input-sm")}
            />
        </div>
    );
    const lydoHeader = (
        <div className="py-1">
            <Input
              value={filters.lydo}
              onChange={(e:any) => setFilters({ ...filters, lydo: e.target.value })}
              size="small"
              className={classNames("input-sm")}
            />
        </div>
    );
    const thuHeader = (
        <div className="py-1">
            <Input
              value={filters.thu}
              onChange={(e:any) => setFilters({ ...filters, thu: e.target.value })}
              label="><=giá trị"
              size="small"
              className={classNames("input-sm")}
            />
        </div>
    );
    const chiHeader = (
        <div className="py-1">
            <Input
              value={filters.chi}
              onChange={(e:any) => setFilters({ ...filters, chi: e.target.value })}
              label="><=giá trị"
              size="small"
              className={classNames("input-sm")}
            />
        </div>
    );
    const tonHeader = (
        <div className="py-1">
            <Input
              value={filters.ton}
              onChange={(e:any) => setFilters({ ...filters, ton: e.target.value })}
              label="><=giá trị"
              size="small"
              className={classNames("input-sm")}
            />
        </div>
    );
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
    // Mỗi khi filter thay đổi => cập nhật params
  const applyFilters = (rows: any[]) => {
    return rows.filter((row) => {
      const f = filters;
      return (
        (f.code_receipt
          ? row.code_receipt
              ?.toLowerCase()
              .includes(f.code_receipt.toLowerCase())
          : true) &&
        (f.thu.trim()
          ? (() => {
              const input = f.thu.trim();
              const match = input.match(/^([><=!]+)\s*(\d+(?:\.\d+)?)$/);
              let operator = ">";
              let num = 0;
              if (match) {
                operator = match[1];
                num = parseFloat(match[2]);
              } else {
                num = parseFloat(input);
                if (isNaN(num)) return true;
              }
              switch (operator) {
                case ">":
                  return row.thu > num;
                case ">=":
                  return row.thu >= num;
                case "=":
                case "==":
                  return row.thu === num;
                case "<=":
                  return row.thu <= num;
                case "<":
                  return row.thu < num;
                default:
                  return row.thu > num;
              }
            })()
          : true)&&
        (f.chi.trim()
          ? (() => {
              const input = f.chi.trim();
              const match = input.match(/^([><=!]+)\s*(\d+(?:\.\d+)?)$/);
              let operator = ">";
              let num = 0;
              if (match) {
                operator = match[1];
                num = parseFloat(match[2]);
              } else {
                num = parseFloat(input);
                if (isNaN(num)) return true;
              }
              switch (operator) {
                case ">":
                  return row.chi > num;
                case ">=":
                  return row.chi >= num;
                case "=":
                case "==":
                  return row.chi === num;
                case "<=":
                  return row.chi <= num;
                case "<":
                  return row.chi < num;
                default:
                  return row.chi > num;
              }
            })()
          : true)&&
        (f.ton.trim()
          ? (() => {
              const input = f.ton.trim();
              const match = input.match(/^([><=!]+)\s*(\d+(?:\.\d+)?)$/);
              let operator = ">";
              let num = 0;
              if (match) {
                operator = match[1];
                num = parseFloat(match[2]);
              } else {
                num = parseFloat(input);
                if (isNaN(num)) return true;
              }
              switch (operator) {
                case ">":
                  return row.ton > num;
                case ">=":
                  return row.ton >= num;
                case "=":
                case "==":
                  return row.ton === num;
                case "<=":
                  return row.ton <= num;
                case "<":
                  return row.ton < num;
                default:
                  return row.ton > num;
              }
            })()
          : true)&&
        (f.note
          ? row.note?.toLowerCase().includes(f.note.toLowerCase())
          : true) &&
        (f.tendoituong
          ? row.tendoituong
              ?.toLowerCase()
              .includes(f.tendoituong.toLowerCase())
          : true) &&
        (f.lydo
          ? row.lydo?.toLowerCase().includes(f.lydo.toLowerCase())
          : true)
      );
    });
  };
  // ✅ Client-side pagination
  useEffect(() => {
    if (!data) return;
    handleParamUrl(paramsPaginator);
    setdunoDK(0)
    if (SoQuyDauKy && SoQuyDauKy[0]) {
      const soDuDauKy = SoQuyDauKy[0]?.so_du_dau_ky || 0;
      setdunoDK(soDuDauKy);

      let ton = soDuDauKy;

      const dataRows = [...(data?.data || [])];
     

      // 1️⃣ sort ASC để tính tồn
      dataRows.sort((a: any, b: any) => {
          const d =
              new Date(a.accounting_date).getTime() -
              new Date(b.accounting_date).getTime();
          return d !== 0 ? d : a.id - b.id;
      });

      const withTon = dataRows.map((row: any) => {
          const total = Number(row.total || 0);

          if (row.iecat_type === 0) {
              ton = Math.round(ton + total);
          }

          if (row.iecat_type === 1) {
              ton = Math.round(ton - total);
          }

          const _lydochi = DMExpense.find((x: any) => x.id === row.income_expense_category_id);
          const _tenquy = DMQuy.find((x: any) => x.id === row.fund_id);
          const _bank = DMBank.find((x: any) => x.id === row.bank_id);

          let tendoituong = "";

          if (row.object === 0 || row.object === 1) {
              const partner = listPartner.find((x: any) => x.id === row.object_id);
              tendoituong = partner?.partners?.abbreviation || "";
          } else {
              const empId = row.object === 2 ? row.object_id : row.employee_id;
              const emp = employees.find((x: any) => x.id === empId);
              tendoituong = `${emp?.last_name ?? ""} ${emp?.first_name ?? ""}`.trim();
          }

          return {
              ...row,
              thu: row.iecat_type === 0 ? total : 0,
              chi: row.iecat_type === 1 ? total : 0,
              ton,
              tendoituong,
              lydo: _lydochi?.name,
              tenquy: _tenquy?.fund_name,
              stk: _bank?.account_number,
          };
      });
      const filteredData = applyFilters(withTon);
      setDisplayData(filteredData);
  }
   
  }, [ data,
   SoQuyDauKy,
   paramsPaginator,
   DMExpense,
   DMQuy,
   DMBank,
   employees,
   listPartner,filters]);
 const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column />
                <Column header="Ngày hạch toán" />
                <Column header="Số tài khoản" />
                <Column header="Số phiếu" />
                <Column header="Diễn giải" />
                <Column header="Đối tượng" />
                <Column header="Tên quỹ" />
                <Column header="Lý do" />
                <Column header="Thu" />
                <Column header="Chi" />
                <Column header="Tồn" />
            </Row>
             <Row>
                <Column />
                <Column />
                <Column />
                <Column header={codeReceiptHeader}/>
                <Column header={noteHeader}/>
                <Column header={tendoituongHeader}/>
                <Column />
                <Column header={lydoHeader}/>
                <Column header={thuHeader}/>
                <Column header={chiHeader}/>
                <Column header={tonHeader}/>
            </Row>
        </ColumnGroup>
    );
  return (
    <>
      <div className="card">
        <Header
          _paramsPaginator={paramsPaginator}
          _setParamsPaginator={setParamsPaginator}
          dunoDK={dunoDK}
        />

         <DataTableClient
            rowHover
            value={displayData}
            headerColumnGroup={headerGroup}
            loading={loading}
            filterDisplay="row"
            className={classNames("Custom-DataTableClient")}
            tableStyle={{ minWidth: "1600px" }} 
        >
            <Column field="accounting_date" header="Ngày hạch toán" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
            <Column field="stk" header="Số tài khoản" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="code_receipt" header="Số phiếu" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="note" header="Diễn giải" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="tendoituong" header="Đối tượng" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="tenquy" header="Tên quỹ" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="lydo" header="Lý do" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column header="Thu" 
            body={(row: any) =>
             {
                return Helper.formatCurrency(row.thu.toString())
             }}
             footer={getSumColumn("thu")}
             footerStyle={{ fontWeight: "bold" }}
             filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column header="Chi"  
            body={(row: any) =>
             {
                return Helper.formatCurrency(row.chi.toString())
             }}
              footer={getSumColumn("chi")}  
              footerStyle={{ fontWeight: "bold" }}
             filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="ton" header="Tồn" 
              body={(row: any) =>
             {
                return Helper.formatCurrency(row.ton.toString())
             }}
            filter showFilterMenu={false}  filterMatchMode="contains"/>
        </DataTableClient>
      </div>
    </>
  );
}
