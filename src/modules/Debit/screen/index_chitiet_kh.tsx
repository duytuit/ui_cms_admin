import { useEffect, useMemo, useRef, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, DataTableClient, DateBody, } from "components/common/DataTable";
import { Calendar, CalendarY, Dropdown, GridForm, Input, } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { useListUserWithState } from "modules/user/service";
import { Checkbox, Dialog } from "components/uiCore";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { useListDebitCongNoChiTietKH, useListDebitCuocTamThu, useListDebitDauKyKH } from "../service";
import { useListContractFileWithState } from "modules/ContractFile/service";
import { deleteDebit } from "../api";
import { TypeDebitDKKH } from "utils";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import UpdatePhieuThuKH from "modules/receipt/screen/update_phieuthu_kh";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator ,selected ,refresh,_setSelectedRows}: any) => {
  const [filter, setFilter] = useState({
    name: "",
    customerDetailId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
  const [visible, setVisible] = useState(false);
  const { data: customerDetails } = useListCustomerDetailWithState({ status: 1});
  // --- chuyển sang options bằng useMemo ---
  const customerOptions = useMemo(() => {
    if (!Array.isArray(customerDetails)) return [];
    return customerDetails.map((x: any) => ({
      label: x?.partners?.abbreviation ?? "(không tên)",
      value: x.id,
    }));
  }, [customerDetails]);
  const openDialogAdd = () => {
    console.log(selected);
    setVisible(true);
  };
  const handleModalClose = () => {
      setVisible(false);
      _setSelectedRows([])
      refresh?.(); 
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
        openDialogAdd={()=>openDialogAdd()}
        openDialogAddName="Lập phiếu thu"
      >
        <div className="col-2">Ngày công nợ</div>
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
      <Dialog
            position="top"
            dismissableMask
            visible={visible}
            onHide={() => setVisible(false)}
            style={{ width: "70vw", top:"30px" }}
        >
          <p className="m-0">
            {selected && <UpdatePhieuThuKH debits={selected} onClose={handleModalClose} ></UpdatePhieuThuKH>}
          </p>
      </Dialog>
    </>
  );
};

export default function ListChiTietKH() {
  const { handleParamUrl } = useHandleParamUrl();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(50);
  const { data: customers } = useListCustomerDetailWithState({status: 1});
  const { data: employees } = useListEmployeeWithState({});
  const [paramsPaginator, setParamsPaginator] = useState({
    pageNum: 1,
    pageSize: 20,
    first: 0,
    render: false,
    keyword: "",
  });
  const { data, loading, error, refresh } = useListDebitCongNoChiTietKH({
    params: paramsPaginator,
    debounce: 500,
  });
  const updateRow = (index: number, patch: any) => {
    setDisplayData(prev => {
      const clone = [...prev];
      clone[index] = { ...clone[index], ...patch };
      return clone;
    });
  };
  // ✅ Client-side pagination
  useEffect(() => {
    if (!data) return;
    handleParamUrl(paramsPaginator);
    const mapped = (data?.data || []).map((row: any) => {
      const cus = customers.find((x: any) => x.id === row.customer_detail_id);
      const _user = employees.find((x: any) => x.user_id === row.updated_by);
      const _typeKH = TypeDebitDKKH.find((x: any) => x.value === row.type);
      const data = JSON.parse(row.data);
      const thanh_tien = Math.round(row.price * (1 + row.vat / 100));
      return {
        ...row,
        fileNumber:data?.fileNumber || "",
        declaration:data?.declaration || "",
        dispatch_code: row.type ===1 ? row.dispatch_code :'',
        file_bill:data?.bill || "",
        customerName: cus?.partners?.name || "",
        customerAbb: cus?.partners?.abbreviation || "",
        userName: `${_user?.last_name ?? ""} ${_user?.first_name ?? ""}`.trim(),
        typeKH: _typeKH?.name || "",
        conlai_dv:(row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5)?thanh_tien-row.receipt_total:0,
        conlai_ch:(row.type === 2 || row.type === 3 || row.type === 6) ? thanh_tien-row.receipt_total: 0
      };
    });
    console.log(mapped);
    setDisplayData(mapped);
  }, [first, rows, data, paramsPaginator, customers]);
  const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column rowSpan={2} />
                <Column header="Ngày hạch toán" rowSpan={2} />
                <Column header="Khách hàng" headerClassName="my-title-center" rowSpan={2} />
                <Column header="Chứng từ" headerClassName="my-title-center" colSpan={6} />
                <Column header="Nợ" headerClassName="my-title-center" colSpan={2} />
                <Column header="Đã thu" headerClassName="my-title-center" colSpan={2} />
                <Column frozen alignFrozen="right" className="font-bold"  header="Còn lại" headerClassName="my-title-center" colSpan={3} />
                <Column frozen alignFrozen="right" className="font-bold"  header="Số thu" headerClassName="my-title-center" colSpan={3} />
            </Row>
            <Row>
                <Column header="Số file" />
                <Column header="Số bill" />
                <Column header="Số tờ khai" />
                <Column header="Mã điều xe" />
                <Column header="Nội dung" />
                <Column header="Số hóa đơn" />
                <Column header="Dịch vụ" />
                <Column header="Chi hộ" />
                <Column header="Dịch vụ" />
                <Column header="Chi hộ" />
                <Column frozen alignFrozen="right" className="font-bold" header="Dịch vụ" />
                <Column frozen alignFrozen="right" className="font-bold"  header="Chi hộ" />
                <Column frozen alignFrozen="right" className="font-bold"  header="Còn lại" />
                <Column frozen alignFrozen="right" className="font-bold"  header="" />
                <Column frozen alignFrozen="right" className="font-bold"  header="Số thu dịch vụ" />
                <Column frozen alignFrozen="right" className="font-bold"  header="Số thu chi hộ" />
            </Row>
        </ColumnGroup>
    );
  return (
    <>
      <div className="card">
        <Header
          _paramsPaginator={paramsPaginator}
          _setParamsPaginator={setParamsPaginator}
          selected={selectedRows} 
          refresh={refresh}
          _setSelectedRows={setSelectedRows}
        />

        <DataTableClient
          rowHover
          value={displayData}
          paginator
          rows={rows}
          first={first}
          totalRecords={data?.total}
          currentPageReportTemplate="Tổng số: {totalRecords} bản ghi"
          onPage={(e: any) => {
            setFirst(e.first);
            setRows(e.rows);
          }}
          headerColumnGroup={headerGroup}
          loading={loading}
          dataKey="id"
          title="Tài khoản"
          filterDisplay="row"
          className={classNames("Custom-DataTableClient")}
          scrollable
          tableStyle={{ minWidth: "1600px" }} // ép bảng rộng hơn để có scroll ngang
        >
          <Column field="accounting_date" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="fileNumber" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="bill" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="declaration" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="dispatch_code" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="name" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="file_bill" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column // dịch vụ
          body={(row: any) =>{
             if(row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5){ // dịch vụ
                // Chuyển price về số thực, giữ decimal
                const price = typeof row.price === "string"
                  ? parseFloat(row.price.replace(/[^0-9.]/g, "")) || 0
                  : Number(row.price) || 0;
                const vat = Number(row.vat) || 0;
                // Tính thành tiền
                const thanh_tien = Math.round(price * (1 + vat / 100));
                return Helper.formatCurrency(thanh_tien.toString());
             }
          }} />
          <Column // chi hộ
          body={(row: any) =>{
             if(row.type === 2 || row.type === 3 || row.type === 6){
                // Chuyển price về số thực, giữ decimal
                const price = typeof row.price === "string"
                  ? parseFloat(row.price.replace(/[^0-9.]/g, "")) || 0
                  : Number(row.price) || 0;
                const vat = Number(row.vat) || 0;
                // Tính thành tiền
                const thanh_tien = Math.round(price * (1 + vat / 100));
                return Helper.formatCurrency(thanh_tien.toString());
             }
          }} />
          <Column 
          body={(row: any) =>{
             if(row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5){
                return Helper.formatCurrency(row.receipt_total.toString());
             }
          }} />
          <Column 
          body={(row: any) =>{
             if(row.type === 2 || row.type === 3 || row.type === 6){
                 return Helper.formatCurrency(row.receipt_total.toString());
             }
          }} />
          <Column  // còn dịch vụ
           body={(row: any) =>{
             if(row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5){
                // Chuyển price về số thực, giữ decimal
                const price = typeof row.price === "string"
                  ? parseFloat(row.price.replace(/[^0-9.]/g, "")) || 0
                  : Number(row.price) || 0;
                const vat = Number(row.vat) || 0;
                // Tính thành tiền
                const thanh_tien = Math.round(price * (1 + vat / 100));
                const conlai =thanh_tien - row.receipt_total
                return Helper.formatCurrency(conlai.toString());
             }
          }} frozen alignFrozen="right" className="font-bold" />
          <Column  // còn chi hộ
          body={(row: any) =>{
             if(row.type === 2 || row.type === 3 || row.type === 6){
                // Chuyển price về số thực, giữ decimal
                const price = typeof row.price === "string"
                  ? parseFloat(row.price.replace(/[^0-9.]/g, "")) || 0
                  : Number(row.price) || 0;
                const vat = Number(row.vat) || 0;
                // Tính thành tiền
                const thanh_tien = Math.round(price * (1 + vat / 100));
                const conlai =thanh_tien - row.receipt_total
                return Helper.formatCurrency(conlai.toString());
             }
          }} frozen alignFrozen="right" className="font-bold" />
          <Column 
          body={(row: any) =>{
                // Chuyển price về số thực, giữ decimal
                const price = typeof row.price === "string"
                  ? parseFloat(row.price.replace(/[^0-9.]/g, "")) || 0
                  : Number(row.price) || 0;
                const vat = Number(row.vat) || 0;
                // Tính thành tiền
                const thanh_tien = Math.round(price * (1 + vat / 100));
                const conlai =thanh_tien - row.receipt_total
                return Helper.formatCurrency(conlai.toString());
          }} frozen alignFrozen="right" className="font-bold"/>
          <Column
            header={
              <Checkbox
                checked={
                  selectedRows.length === displayData.length &&
                  displayData.length > 0
                }
                onChange={(e: any) => {
                  if (e.checked) setSelectedRows([...displayData]); // lưu nguyên object
                  else setSelectedRows([]);
                }}
              />
            }
            body={(rowData: any) => {
              const thanh_tien = Math.round(rowData.price * (1 + rowData.vat / 100));
              let conlai = thanh_tien - rowData.receipt_total;
              conlai = Math.max(conlai, 0);
              if(conlai > 0){
                const isChecked = selectedRows.some(r => r.id === rowData.id); // check theo id
                return (
                  <Checkbox
                    className="p-checkbox-sm"
                    checked={isChecked}
                    onChange={(e: any) => {
                      setSelectedRows(prev => {
                        if (e.checked) {
                          // add row: lấy object mới nhất từ displayData
                          const rowFromDisplay = displayData.find(d => d.id === rowData.id);
                          if (!prev.some(r => r.id === rowData.id) && rowFromDisplay) {
                            return [...prev, rowFromDisplay];
                          }
                          return prev;
                        } else {
                          // remove row
                          return prev.filter(r => r.id !== rowData.id);
                        }
                      });
                    }}
                    onClick={(e: any) => e.stopPropagation()}
                  />
                );
              }
            }}
            style={{ width: "3em" }}
            frozen
            alignFrozen="right"
          />
          <Column 
           body={(row:any, options:any) => {
            if(row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5){
              const price = typeof row.price === "string"
                ? parseFloat(row.price.replace(/[^0-9.]/g, "")) || 0
                : Number(row.price) || 0;
              const vat = Number(row.vat) || 0;
              const thanh_tien = Math.round(price * (1 + vat / 100));
              const conlai = thanh_tien - (row.receipt_total || 0);
              return (
                 <Input
                    className="w-full input-sm"
                    value={Helper.formatCurrency(String(row.conlai_dv > 0 ? row.conlai_dv : conlai))}
                    onChange={(e: any) => {
                      const newValue = parseInt(e.target.value.replace(/\D/g, ""), 10);

                      setDisplayData(prev => {
                        // Tạo mảng displayData mới
                        const updated = [...prev];
                        updated[options.rowIndex] = {
                          ...updated[options.rowIndex],
                          conlai_dv: newValue
                        };

                        // Đồng bộ selectedRows: nếu row đang chọn, cập nhật object mới
                        setSelectedRows(prevSelected =>
                          prevSelected.map(sel =>
                            sel.id === row.id ? { ...updated[options.rowIndex] } : sel
                          )
                        );

                        return updated;
                      });
                    }}
                  />
              );
            }
          }} frozen alignFrozen="right" className="font-bold"/>
          <Column 
           
           body={(row:any, options:any) => {
             if(row.type === 2 || row.type === 3 || row.type === 6){
              const price = typeof row.price === "string"
                ? parseFloat(row.price.replace(/[^0-9.]/g, "")) || 0
                : Number(row.price) || 0;
              const vat = Number(row.vat) || 0;
              const thanh_tien = Math.round(price * (1 + vat / 100));
              const conlai = thanh_tien - (row.receipt_total || 0);
              return (
                 <Input
                    className="w-full input-sm"
                    value={Helper.formatCurrency(String(row.conlai_ch > 0 ? row.conlai_ch : conlai))}
                    onChange={(e: any) => {
                      const newValue = parseInt(e.target.value.replace(/\D/g, ""), 10);

                      setDisplayData(prev => {
                        // Tạo mảng displayData mới
                        const updated = [...prev];
                        updated[options.rowIndex] = {
                          ...updated[options.rowIndex],
                          conlai_ch: newValue
                        };

                        // Đồng bộ selectedRows: nếu row đang chọn, cập nhật object mới
                        setSelectedRows(prevSelected =>
                          prevSelected.map(sel =>
                            sel.id === row.id ? { ...updated[options.rowIndex] } : sel
                          )
                        );

                        return updated;
                      });
                    }}
                  />
              );
            }
          }} frozen alignFrozen="right" className="font-bold"/>
        </DataTableClient>
      </div>
    </>
  );
}
