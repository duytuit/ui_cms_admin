import { useEffect, useState } from "react";
import { Column, DataTableClient } from "components/common/DataTable";
import { GridForm } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { Helper } from "utils/helper";
import { Splitter } from "primereact/splitter";
import { FilterMatchMode } from "primereact/api";
import { useListBaoCaoLoiNhuanTheoXe } from "modules/Debit/service";
import { useListIncomeExpenseWithState } from "modules/categories/service";
import { DataTable } from "components/uiCore";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator }: any) => {
  const [filter, setFilter] = useState({
    name: "",
    customerDetailId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
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
    </GridForm>
  );
};

export default function ListLoiNhuanTheoXe() {
  const { handleParamUrl } = useHandleParamUrl();
  const [displayData, setDisplayData] = useState<any[]>([]);
  const { data: customers } = useListCustomerDetailWithState({status: 1});
  const [filters, setFilters] = useState({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          });
  const [paramsPaginator, setParamsPaginator] = useState({
    pageNum: 1,
    pageSize: 20,
    first: 0,
    render: false,
    keyword: "",
  });
  const { data, loading, error, refresh } = useListBaoCaoLoiNhuanTheoXe({
    params: paramsPaginator,
    debounce: 500,
  });
  const { data: DMExpense } = useListIncomeExpenseWithState({}); 
  // ✅ Client-side pagination
  useEffect(() => {
    if (!data) return;
    handleParamUrl(paramsPaginator);
      // 16: phí sửa chữa
      // 17: phí dầu DO
      // 18: Cước đường bộ
      // 19: phí khác
      // 20: phí lãi vay
      // 22 : trích lương lái xe
      // 34: trích BHXH
      // 35: phí gửi xe
      // 38: phí đi đường lái xe
    let baocaoloinhuan = (data[0]?.data?.debit_theoxe || []).map((row: any) => {
      const totalCost = row.total_price + row.total_driver_fee;
      const listPhi =(data[0]?.data?.chi_theoxe || []).filter((item: any) => item.vehicle_id === row.id);
      return {
        ...row,
        totalCost,
        phiDau :listPhi?.find((p: any) => p.income_expense_category_id === 17)?.amount || 0,
        cuocDuongBo : listPhi?.find((p: any) => p.income_expense_category_id === 18)?.amount || 0,
        phiSuaChua : listPhi?.find((p: any) => p.income_expense_category_id === 16)?.amount || 0,
        phiKhac : listPhi?.find((p: any) => p.income_expense_category_id === 19)?.amount || 0,
        laiVay : listPhi?.find((p: any) => p.income_expense_category_id === 20)?.amount || 0,
        trichLuongLaiXe : listPhi?.find((p: any) => p.income_expense_category_id === 22)?.amount || 0,
        trichBHXH : listPhi?.find((p: any) => p.income_expense_category_id === 34)?.amount || 0,
        phiGuiXe : listPhi?.find((p: any) => p.income_expense_category_id === 35)?.amount || 0,
        phiDiDuongLaiXe : listPhi?.find((p: any) => p.income_expense_category_id === 38)?.amount || 0,
        tongChiPhi: listPhi?.reduce((sum: number, p: any) => sum + (p.amount ? parseFloat(p.amount.toString()) : 0), 0) || 0, 
        loiNhuan: totalCost - (listPhi?.reduce((sum: number, p: any) => sum + (p.amount ? parseFloat(p.amount.toString()) : 0), 0) || 0),
      };
    });
    const loinhuanxengoai = (data[1]?.data || []).map((row: any) => {
      return {
        ...row,
        number_code: "lợi nhuận xe ngoài",
        totalCost: row.total_price,
        phiDau : row.total_purchase_price || 0,
      };
    });
  
    const loinhuandoanhthukhac = [
      {
        number_code: "lợi nhuận doanh thu khác",
        totalCost: data[3]?.data.loinhuan_banhang.reduce((acc: number, curr: any) => acc + curr.total_price, 0) + data[3]?.data.loinhuan_com.reduce((acc: number, curr: any) => acc + curr.total_price_com, 0) + data[3]?.data.loinhuan_phikhac.reduce((acc: number, curr: any) => acc + curr.total_price, 0), // doanh số
        phiDau: data[3]?.data.loinhuan_muahang.reduce((acc: number, curr: any) => acc + curr.total_purchase_price, 0)+ data[3]?.data.loinhuan_com.reduce((acc: number, curr: any) => acc + curr.total_purchase_price, 0) + data[3]?.data.loinhuan_phikhac.reduce((acc: number, curr: any) => acc + curr.total_purchase_price, 0) || 0 // phí mua hàng
      }
    ]
    const loinhuanhaiquan = [
      {
        number_code: "lợi nhuận hải quan",
        totalCost: data[2]?.data.reduce((acc: number, curr: any) => acc + curr.total_price, 0), // doanh số
        phiDau: data[2]?.data.reduce((acc: number, curr: any) => acc + curr.total_purchase_price, 0) || 0 // phí mua hàng
      }
    ]
    baocaoloinhuan.push(...loinhuanxengoai);
    baocaoloinhuan.push(...loinhuandoanhthukhac);
    baocaoloinhuan.push(...loinhuanhaiquan);
    setDisplayData(baocaoloinhuan);
  }, [data, paramsPaginator, customers]);
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
        <div style={{ height: "calc(100vh - 8rem)" }}>
          <Splitter style={{ height: "100%", width: "100%" }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <DataTable
                rowHover
                value={displayData}
                currentPageReportTemplate="Tổng số: {totalRecords} bản ghi"
                loading={loading}
                dataKey="id"
                title="Tài khoản"
                filterDisplay="row"
                filters={filters}
                onFilter={(e: any) => setFilters(e.filters)}
                className={classNames("Custom-DataTableClient")}
                scrollable
                showGridlines
                scrollHeight="flex"
                style={{ flex: 1 }}
                tableStyle={{ minWidth: "2000px" }} // ép bảng rộng hơn để có scroll ngang
              >
                <Column
                  field="number_code"
                  header="Tên Xe"
                  filter
                  frozen alignFrozen="left" 
                  showFilterMenu={false}
                  filterMatchMode="contains"
                />
                <Column
                  field="totalCost"
                  header="Doanh số"
                  body={(rowData: any) =>
                    Helper.formatCurrency(rowData?.totalCost?.toString())
                  }
                  footer={getSumColumn("totalCost")}
                  footerStyle={{ fontWeight: "bold" }}
                  style={{ textAlign: "right" }}
                  filter
                  showFilterMenu={false}
                  filterMatchMode="contains"
                />
                <Column
                  field="file_number"
                  header="Phí dầu/cước mua"
                  body={(rowData: any) => {
                    const phiDau = rowData.phiDau || 0;
                    return Helper.formatCurrency(phiDau.toString());
                  }}
                  footer={getSumColumn("phiDau")}
                  style={{ textAlign: "right" }}
                  filter
                  showFilterMenu={false}
                  filterMatchMode="contains"
                />
                <Column
                  field="bill"
                  header="Cước đường bộ"
                  body={(rowData: any) => {
                    const cuocDuongBo = rowData.cuocDuongBo || 0;
                    return Helper.formatCurrency(cuocDuongBo.toString());
                  }}
                  footer={getSumColumn("cuocDuongBo")}
                  footerStyle={{ fontWeight: "bold" }}
                  style={{ textAlign: "right" }}
                  filter
                  showFilterMenu={false}
                  filterMatchMode="contains"
                />
                <Column
                  field="declaration"
                  header="Phí sửa chữa"
                  body={(rowData: any) => {
                    const phiSuaChua = rowData.phiSuaChua || 0;
                    return Helper.formatCurrency(phiSuaChua.toString());
                  }}
                  footer={getSumColumn("phiSuaChua")}
                  footerStyle={{ fontWeight: "bold" }}
                  style={{ textAlign: "right" }}
                  filter
                  showFilterMenu={false}
                  filterMatchMode="contains"
                />
                <Column
                  header="Phí khác"
                  body={(rowData: any) => {
                    const phiKhac = rowData.phiKhac || 0;
                    return Helper.formatCurrency(phiKhac.toString());
                  }}
                  footer={getSumColumn("phiKhac")}
                  footerStyle={{ fontWeight: "bold" }}
                  style={{ textAlign: "right" }}
                  filter
                  showFilterMenu={false}
                  filterMatchMode="contains"
                />
                <Column
                  header="Lãi vay"
                  body={(rowData: any) => {
                    const laiVay = rowData.laiVay || 0;
                    return Helper.formatCurrency(laiVay.toString());
                  }}
                  footer={getSumColumn("laiVay")}
                  footerStyle={{ fontWeight: "bold" }}
                  style={{ textAlign: "right" }}
                  filter
                  showFilterMenu={false}
                  filterMatchMode="contains"
                />
                <Column
                  header="Lương lái xe"
                  body={(rowData: any) => {
                    const trichLuongLaiXe = rowData.trichLuongLaiXe || 0;
                    return Helper.formatCurrency(trichLuongLaiXe.toString());
                  }}
                  footer={getSumColumn("trichLuongLaiXe")}
                  footerStyle={{ fontWeight: "bold" }}
                  style={{ textAlign: "right" }}
                  filter
                  showFilterMenu={false}
                  filterMatchMode="contains"
                />
                <Column
                  body={(rowData: any) => {
                    const trichBHXH = rowData.trichBHXH || 0;
                    return Helper.formatCurrency(trichBHXH.toString());
                  }}
                  footer={getSumColumn("trichBHXH")}
                  footerStyle={{ fontWeight: "bold" }}
                  header="Phí BHXH"
                  filter
                  showFilterMenu={false}
                  filterMatchMode="contains"
                  style={{ textAlign: "right" }}
                />
                <Column
                  field="listEmployee"
                  header="Phí gửi xe"
                  body={(rowData: any) => {
                    const phiGuiXe = rowData.phiGuiXe || 0;
                    return Helper.formatCurrency(phiGuiXe.toString());
                  }}
                  footer={getSumColumn("phiGuiXe")}
                  footerStyle={{ fontWeight: "bold" }}
                  style={{ textAlign: "right" }}
                  filter
                  showFilterMenu={false}
                  filterMatchMode="contains"
                />
                <Column
                  field="listEmployee"
                  header="Phí đi đường của lái xe"
                  body={(rowData: any) => {
                    const phiDiDuongLaiXe = rowData.phiDiDuongLaiXe || 0;
                    return Helper.formatCurrency(phiDiDuongLaiXe.toString());
                  }}
                  footer={getSumColumn("phiDiDuongLaiXe")}
                  footerStyle={{ fontWeight: "bold" }}
                  style={{ textAlign: "right" }}
                  filter
                  showFilterMenu={false}
                  filterMatchMode="contains"
                />
                <Column
                  field="listEmployee"
                  header="Tổng chi phí"
                  body={(rowData: any) => {
                    const tongChiPhi = rowData.tongChiPhi || 0;
                    return Helper.formatCurrency(tongChiPhi.toString());
                  }}
                  footer={getSumColumn("tongChiPhi")}
                  footerStyle={{ fontWeight: "bold" }}
                  style={{ textAlign: "right" }}
                  filter
                  showFilterMenu={false}
                  filterMatchMode="contains"
                />
                <Column
                  field="listEmployee"
                  header="Khấu hao/chi phí phân bổ"
                  filter
                  showFilterMenu={false}
                  filterMatchMode="contains"
                />
                <Column
                  field="loiNhuan"
                  header="Lợi nhuận"
                  body={(rowData: any) => {
                    const loiNhuan = rowData.loiNhuan || 0;
                    return Helper.formatCurrency(loiNhuan.toString());
                  }}
                  footer={getSumColumn("loiNhuan")}
                  footerStyle={{ fontWeight: "bold" }}
                  style={{ textAlign: "right" }}
                  filter
                  showFilterMenu={false}
                  filterMatchMode="contains"
                />
                <Column
                  field="listEmployee"
                  header="Tỷ suất lợi nhuận"
                  filter
                  showFilterMenu={false}
                  filterMatchMode="contains"
                />
                <Column
                  field="listEmployee"
                  header="Lợi nhuận chưa tính khấu hao"
                  filter
                  showFilterMenu={false}
                  filterMatchMode="contains"
                />
              </DataTable>
            </div>
          </Splitter>
        </div>
      </div>
    </>
  );
}
