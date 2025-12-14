import { useEffect, useMemo, useState } from "react";
import { Column, DataTableClient, DateBody, } from "components/common/DataTable";
import { Dropdown, GridForm } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListPartnerDetailWithState } from "modules/partner/service";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { FilterMatchMode } from "primereact/api";
import { useListBankWithState, useListExpenseWithState, useListFundCategoryWithState } from "modules/categories/service";
import { useListReceiptSoQuy, useListReceiptSoQuyDauKy } from "modules/receipt/service";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator ,dunoDK}: any) => {
  const [filter, setFilter] = useState({
    name: "",
    customerDetailId: "",
    fundId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
   const { data: DMQuy } = useListFundCategoryWithState({type:1});
   const DMQuyOptions = useMemo(() => {
       if (!Array.isArray(DMQuy)) return [];
       return DMQuy.map((x: any) => ({
         label: x?.fund_name ?? "(không tên)",
         value: x.id,
       }));
     }, [DMQuy]);
  useEffect(() => {
    // Mỗi khi filter thay đổi => cập nhật params
    _setParamsPaginator((prev: any) => ({
      ...prev,
      keyword: filter.name,
      customerDetailId: filter.customerDetailId,
      fundId: filter.fundId,
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
                value={filter.fundId}
                options={DMQuyOptions}
                onChange={(e: any) =>
                  setFilter({ ...filter, fundId: e.target.value })
                }
                label="Quỹ"
                className={classNames("dropdown-input-sm", "p-dropdown-sm")}
              />
            </div>
            <div className="col-4">
                 <div><b>Dư nợ đầu kỳ: {dunoDK ? Helper.formatCurrency(dunoDK.toString()):0}</b></div>
            </div>
    </GridForm>
  );
};

export default function ListBaoCaoTienMat() {
  const { handleParamUrl } = useHandleParamUrl();
  const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      code_receipt: { value: null, matchMode: FilterMatchMode.CONTAINS },
      });
  const [displayData, setDisplayData] = useState<any[]>([]);
   const [dunoDK, setdunoDK] = useState<number>(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const [paramsPaginator, setParamsPaginator] = useState({
    pageNum: 1,
    pageSize: 20,
    first: 0,
    render: false,
    keyword: "",
    FormOfPayment:1
  });
  const { data: employees } = useListEmployeeWithState({});
  const { data: DMExpense } = useListExpenseWithState({type:1,enable:1}); // danh mục chi phí
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
              ton,
              tendoituong,
              lydo: _lydochi?.name,
              tenquy: _tenquy?.fund_name,
              stk: _bank?.account_number,
          };
      });

      // 2️⃣ sort DESC để hiển thị
       withTon.sort((a: any, b: any) => {
          const dateDiff =
              new Date(b.accounting_date).getTime() -
              new Date(a.accounting_date).getTime();

          if (dateDiff !== 0) return dateDiff;

          return b.id - a.id; // 👈 tie-break bằng id
      });
      console.log(withTon);
      setDisplayData(withTon);
  }
   
  }, [ data,
   SoQuyDauKy,
   paramsPaginator,
   DMExpense,
   DMQuy,
   DMBank,
   employees,
   listPartner]);

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
            filters={filters}
            onFilter={(e:any) => setFilters(e.filters)}
            loading={loading}
            filterDisplay="row"
            className={classNames("Custom-DataTableClient")}
            tableStyle={{ minWidth: "1600px" }} 
        >
            <Column field="accounting_date" header="Ngày hạch toán" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
            <Column field="code_receipt" header="Số phiếu" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="note" header="Diễn giải" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="tendoituong" header="Đối tượng" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="tenquy" header="Tên quỹ" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="lydo" header="Lý do" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column header="Thu" 
             body={(row: any) =>
             {
              if(row.iecat_type === 0){
                  return Helper.formatCurrency(row.total.toString())
              }
             }}
            filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column header="Chi"
              body={(row: any) =>
             {
              if(row.iecat_type === 1){
                  return Helper.formatCurrency(row.total.toString())
              }
             }}
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
