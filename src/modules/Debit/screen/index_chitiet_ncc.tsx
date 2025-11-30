import { useEffect, useMemo, useState } from "react";
import { Column, DataTableClient, DateBody, } from "components/common/DataTable";
import { Dropdown, GridForm, Input, } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListSupplierDetailWithState } from "modules/partner/service";
import { Checkbox, Dialog } from "components/uiCore";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { useListDebitCongNoChiTietNCC } from "../service";
import { TypeDebitDKKH } from "utils";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import UpdatePhieuChiNCC from "modules/receipt/screen/update_phieuchi_ncc";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator ,selected ,refresh,_setSelectedRows}: any) => {
  const [filter, setFilter] = useState({
    name: "",
    supplierDetailId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
  const [visible, setVisible] = useState(false);
  const { data: supplierDetails } = useListSupplierDetailWithState({ status: 2});
  // --- chuyển sang options bằng useMemo ---
  const supplierOptions = useMemo(() => {
    if (!Array.isArray(supplierDetails)) return [];
    return supplierDetails.map((x: any) => ({
      label: x?.partners?.abbreviation ?? "(không tên)",
      value: x.id,
    }));
  }, [supplierDetails]);
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
      supplierDetailId: filter.supplierDetailId,
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
        openDialogAddName="Lập phiếu chi"
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
            value={filter.supplierDetailId}
            options={supplierOptions}
            onChange={(e: any) =>
              setFilter({ ...filter, supplierDetailId: e.target.value })
            }
            label="Nhà cung cấp"
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
            {selected && <UpdatePhieuChiNCC debits={selected} onClose={handleModalClose} ></UpdatePhieuChiNCC>}
          </p>
      </Dialog>
    </>
  );
};

export default function ListChiTietNCC() {
  const { handleParamUrl } = useHandleParamUrl();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(50);
  const { data: suppliers } = useListSupplierDetailWithState({status: 2});
  const { data: employees } = useListEmployeeWithState({});
  const [paramsPaginator, setParamsPaginator] = useState({
    pageNum: 1,
    pageSize: 20,
    first: 0,
    render: false,
    keyword: "",
  });
  const [filters, setFilters] = useState({
      fileNumber: "",
      supplierAbb:"",
      bill: "",
      declaration: "",
      dispatch_code: "",
      name: "",
      file_bill: ""
  });
  const { data, loading, error, refresh } = useListDebitCongNoChiTietNCC({
    params: paramsPaginator,
    debounce: 500,
  });
    // --- Header template with filter ---
  const supplierAbbHeader = (
     <div className="py-1">
         <Input
            value={filters.supplierAbb}
            onChange={(e:any) => setFilters({ ...filters, supplierAbb: e.target.value })}
            size="small"
            className={classNames("input-sm")}
          />
     </div>
  );
    const fileNumberHeader = (
     <div className="py-1">
         <Input
            value={filters.fileNumber}
            onChange={(e:any) => setFilters({ ...filters, fileNumber: e.target.value })}
            size="small"
            className={classNames("input-sm")}
          />
     </div>
  );
    const billHeader = (
     <div className="py-1">
         <Input
            value={filters.bill}
            onChange={(e:any) => setFilters({ ...filters, bill: e.target.value })}
            size="small"
            className={classNames("input-sm")}
          />
     </div>
  );
    const declarationHeader = (
     <div className="py-1">
         <Input
            value={filters.declaration}
            onChange={(e:any) => setFilters({ ...filters, declaration: e.target.value })}
            size="small"
            className={classNames("input-sm")}
          />
     </div>
  );
    const dispatchCodeHeader = (
     <div className="py-1">
         <Input
            value={filters.dispatch_code}
            onChange={(e:any) => setFilters({ ...filters, dispatch_code: e.target.value })}
            size="small"
            className={classNames("input-sm")}
          />
     </div>
  );
    const nameHeader = (
     <div className="py-1">
         <Input
            value={filters.name}
            onChange={(e:any) => setFilters({ ...filters, name: e.target.value })}
            size="small"
            className={classNames("input-sm")}
          />
     </div>
  );
  const fileBillHeader = (
     <div className="py-1">
         <Input
            value={filters.file_bill}
            onChange={(e:any) => setFilters({ ...filters, file_bill: e.target.value })}
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
            (f.supplierAbb ? row.supplierAbb?.toLowerCase().includes(f.supplierAbb.toLowerCase()) : true) &&
            (f.fileNumber ? row.fileNumber?.toLowerCase().includes(f.fileNumber.toLowerCase()) : true) &&
            (f.bill ? row.bill?.toLowerCase().includes(f.bill.toLowerCase()) : true) &&
            (f.declaration ? row.declaration?.toLowerCase().includes(f.declaration.toLowerCase()) : true) &&
            (f.dispatch_code ? row.dispatch_code?.toLowerCase().includes(f.dispatch_code.toLowerCase()) : true) &&
            (f.name ? row.name?.toLowerCase().includes(f.name.toLowerCase()) : true) &&
            (f.file_bill ? row.file_bill?.toLowerCase().includes(f.file_bill.toLowerCase()) : true)
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
useEffect(() => {
    if (!data) return;

    handleParamUrl(paramsPaginator);
    console.log(suppliers);
    
    const mapped = (data?.data || []).map((row: any) => {
        const sup = suppliers.find((x: any) => x.id === row.supplier_detail_id);
        const _user = employees.find((x: any) => x.user_id === row.updated_by);
        const _typeKH = TypeDebitDKKH.find((x: any) => x.value === row.type);
        const _data = JSON.parse(row.data);
        const thanh_tien = Math.round(row.purchase_price * (1 + row.purchase_vat / 100));

        return {
            ...row,
            fileNumber: _data?.fileNumber || "",
            declaration: _data?.declaration || "",
            dispatch_code: row.type === 1 ? row.dispatch_code : "",
            bill: _data?.bill || "",
            file_bill: _data?.bill || "",
            supplierName: sup?.partners?.name || "",
            supplierAbb: sup?.partners?.abbreviation || "",
            userName: `${_user?.last_name ?? ""} ${_user?.first_name ?? ""}`.trim(),
            typeKH: _typeKH?.name || "",
            thanhtien_dv: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5) ? thanh_tien : 0,
            thanhtien_ch: (row.type === 2 || row.type === 3 || row.type === 6) ? thanh_tien : 0,
            dathu_dv: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5) ? row.receipt_total : 0,
            dathu_ch: (row.type === 2 || row.type === 3 || row.type === 6) ? row.receipt_total : 0,
            conlai_dv_view: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5) ? thanh_tien - row.receipt_total : 0,
            conlai_ch_view: (row.type === 2 || row.type === 3 || row.type === 6) ? thanh_tien - row.receipt_total : 0,
            conlai_dv: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5) ? thanh_tien - row.receipt_total : 0,
            conlai_ch: (row.type === 2 || row.type === 3 || row.type === 6) ? thanh_tien - row.receipt_total : 0,
            conlai_tong: thanh_tien - row.receipt_total
        };
    });

    const filtered = applyFilters(mapped);
    setDisplayData(filtered);

}, [first, rows, data, paramsPaginator, filters, suppliers, employees]);
  const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column rowSpan={2} />
                <Column header="Ngày hạch toán" rowSpan={2} />
                <Column header="Nhà cung cấp" headerClassName="my-title-center" rowSpan={2} />
                <Column header="Chứng từ" headerClassName="my-title-center" colSpan={6} />
                <Column header="Nợ" headerClassName="my-title-center" colSpan={2} />
                <Column header="Đã thu" headerClassName="my-title-center" colSpan={2} />
                <Column frozen alignFrozen="right" className="font-bold"  header="Còn lại" headerClassName="my-title-center" colSpan={3} />
                <Column frozen alignFrozen="right" className="font-bold"  header="Số thu" headerClassName="my-title-center" colSpan={3} />
            </Row>
            <Row>
                <Column header="Số file"/>
                <Column header="Số bill"/>
                <Column header="Số tờ khai"/>
                <Column header="Mã điều xe"/>
                <Column style={{width: "250px"}} header="Nội dung"/>
                <Column header="Số hóa đơn"/>
                <Column style={{width: "150px"}} header="Dịch vụ"/>
                <Column style={{width: "150px"}} header="Chi hộ"/>
                <Column header="Dịch vụ"/>
                <Column header="Chi hộ"/>
                <Column style={{width: "150px"}} frozen alignFrozen="right" className="font-bold" header="Dịch vụ" />
                <Column style={{width: "150px"}} frozen alignFrozen="right" className="font-bold" header="Chi hộ" />
                <Column style={{width: "150px"}} frozen alignFrozen="right" className="font-bold" header="Còn lại" />
                <Column frozen alignFrozen="right" className="font-bold" header="" />
                <Column style={{width: "140px"}} frozen alignFrozen="right" className="font-bold" header="Số thu dịch vụ" />
                <Column style={{width: "140px"}} frozen alignFrozen="right" className="font-bold" header="Số thu chi hộ" />
            </Row>
             <Row>
                <Column />
                <Column />
                <Column header={supplierAbbHeader}/>
                <Column header={fileNumberHeader}/>
                <Column header={billHeader}/>
                <Column header={declarationHeader}/>
                <Column header={dispatchCodeHeader}/>
                <Column header={nameHeader}/>
                <Column header={fileBillHeader}/>
                <Column />
                <Column />
                <Column />
                <Column /> 
                <Column frozen alignFrozen="right" className="font-bold"/>
                <Column frozen alignFrozen="right" className="font-bold"/>
                <Column frozen alignFrozen="right" className="font-bold"/>
                <Column frozen alignFrozen="right" className="font-bold"/>
                <Column frozen alignFrozen="right" className="font-bold"/>
                <Column frozen alignFrozen="right" className="font-bold"/>
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
          tableStyle={{ minWidth: "2000px" }} // ép bảng rộng hơn để có scroll ngang
        >
          <Column field="accounting_date" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="supplierAbb" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="fileNumber" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="bill" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="declaration" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="dispatch_code" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="name" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="file_bill" filter showFilterMenu={false} filterMatchMode="contains" />
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
          <Column 
            body={(row: any) =>{
              return Helper.formatCurrency(row.dathu_dv.toString());
            }}
          />
          <Column 
            body={(row: any) =>{
              return Helper.formatCurrency(row.dathu_ch.toString());
            }} 
          />
          <Column  // còn dịch vụ
            body={(row: any) =>{
                  return Helper.formatCurrency(row.conlai_dv_view.toString());
            }} 
            footer={getSumColumn("conlai_dv_view")}
            footerStyle={{ fontWeight: "bold" }}
            frozen 
            alignFrozen="right" 
            className="font-bold" 
            />
          <Column  // còn chi hộ
            body={(row: any) =>{
                return Helper.formatCurrency(row.conlai_ch_view.toString());
            }} 
            footer={getSumColumn("conlai_ch_view")}
            footerStyle={{ fontWeight: "bold" }}
            frozen 
            alignFrozen="right" 
            className="font-bold" 
          />
          <Column // còn lại tổng
            body={(row: any) =>{
                return Helper.formatCurrency(row.conlai_tong.toString());
            }} 
            footer={getSumColumn("conlai_tong")}
            footerStyle={{ fontWeight: "bold" }}
            frozen 
            alignFrozen="right" 
            className="font-bold"
          />
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
              const purchase_price = typeof row.purchase_price === "string"
                ? parseFloat(row.purchase_price.replace(/[^0-9.]/g, "")) || 0
                : Number(row.purchase_price) || 0;
              const purchase_vat = Number(row.purchase_vat) || 0;
              const thanh_tien = Math.round(purchase_price * (1 + purchase_vat / 100));
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
              const purchase_price = typeof row.purchase_price === "string"
                ? parseFloat(row.purchase_price.replace(/[^0-9.]/g, "")) || 0
                : Number(row.purchase_price) || 0;
              const purchase_vat = Number(row.purchase_vat) || 0;
              const thanh_tien = Math.round(purchase_price * (1 + purchase_vat / 100));
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
