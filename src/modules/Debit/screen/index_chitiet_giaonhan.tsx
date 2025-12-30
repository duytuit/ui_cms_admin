import { useEffect, useMemo, useState } from "react";
import { Column, DataTableClient, DateBody, } from "components/common/DataTable";
import { GridForm, Input, } from "components/common/ListForm";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { Checkbox, Dialog } from "components/uiCore";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { useListCongNoGiaoNhan } from "../service";
import { TypeDebitDKKH } from "utils";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import UpdatePhieuThuGiaoNhan from "modules/receipt/screen/update_phieuthu_giaonhan";
import UpdateHoanTraTamThuGiaoNhan from "modules/receipt/screen/update_hoantra_tamthu_giaonhan";
import { Splitter } from "primereact/splitter";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator ,selected ,refresh,_setSelectedRows}: any) => {
   const { handleParamUrl } = useHandleParamUrl();
  const [filter, setFilter] = useState({
    name: "",
    customerDetailId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
  const [debitHoanTra, setDebitHoanTra] = useState<any>([]);
  const [visibleHoanTra, setVisibleHoanTra] = useState(false);
  const [visibleThuGiaoNhan, setVisibleThuGiaoNhan] = useState(false);
  const openHoanTra = () => {
    console.log(selected);
    setDebitHoanTra(selected.filter((item: any) => item.service_id === 33));
    setVisibleHoanTra(true);
  };
  const openThuGiaoNhan = () => {
    console.log(selected);
    setVisibleThuGiaoNhan(true);
  };
  const ClosePhieuThuGiaoNhan = () => {
      setVisibleThuGiaoNhan(false);
      _setSelectedRows([])
      refresh?.(); 
  };
  const CloseHoanTra = () => {
      setVisibleHoanTra(false);
      _setSelectedRows([])
      refresh?.(); 
  }
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
        openDialogAdd={() => openHoanTra()}
        openDialogAddName="Hoàn trả phiếu tạm thu"
        openDialogAddOne={() => openThuGiaoNhan()}
        openDialogAddNameOne="Thu giao nhận"
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
      </GridForm>
      <Dialog
        position="top"
        dismissableMask
        visible={visibleThuGiaoNhan}
        onHide={() => setVisibleThuGiaoNhan(false)}
        style={{ width: "70vw", top:"30px" }}
      >
        <p className="m-0">
          {selected && <UpdatePhieuThuGiaoNhan debits={selected} onClose={ClosePhieuThuGiaoNhan} ></UpdatePhieuThuGiaoNhan>}
        </p>
      </Dialog>
      <Dialog
        position="top"
        dismissableMask
        visible={visibleHoanTra}
        onHide={() => setVisibleHoanTra(false)}
        style={{ width: "70vw", top:"30px" }}
      >
        <p className="m-0">
          {selected && <UpdateHoanTraTamThuGiaoNhan debits={debitHoanTra} onClose={CloseHoanTra} ></UpdateHoanTraTamThuGiaoNhan>}
        </p>
      </Dialog>
    </>
  );
};

export default function ListDebitChiTietGiaoNhan() {
  const { handleParamUrl } = useHandleParamUrl();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const { data: customers } = useListCustomerDetailWithState({status: 1});
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
      customerAbb:"",
      bill: "",
      declaration: "",
      dispatch_code: "",
      name: "",
      file_bill: ""
  });
  const { data, loading, error, refresh } = useListCongNoGiaoNhan({
    params: paramsPaginator,
    debounce: 500,
  });
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
    // --- Filter dữ liệu dựa vào input ---
const applyFilters = (rows: any[]) => {
    return rows.filter((row) => {
        const f = filters;
        return (
            (f.customerAbb ? row.customerAbb?.toLowerCase().includes(f.customerAbb.toLowerCase()) : true) &&
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

    const mapped = (data?.data || []).map((row: any) => {
        const cus = customers.find((x: any) => x.id === row.customer_detail_id);
        const _user = employees.find((x: any) => x.user_id === row.updated_by);
        const _giaonhan = employees.find((x: any) => x.id === row.employee_staff_id);
        const _typeKH = TypeDebitDKKH.find((x: any) => x.value === row.type);
        const _data = JSON.parse(row.data);
        const thanh_tien = Math.round(row.price);
        return {
            ...row,
            fileNumber: _data?.fileNumber || "không file",
            declaration: _data?.declaration || "",
            dispatch_code: row.type === 1 ? row.dispatch_code : "",
            bill: _data?.bill || "",
            file_bill: _data?.bill || "",
            customerName: cus?.partners?.name || "",
            customerAbb: cus?.partners?.abbreviation || "",
            userName: `${_user?.last_name ?? ""} ${_user?.first_name ?? ""}`.trim(),
            userGiaoNhan: `${_giaonhan?.last_name ?? ""} ${_giaonhan?.first_name ?? ""}`.trim(),
            typeKH: _typeKH?.name || "",
            thanhtien_dv: (row.service_id === 19 ) ? thanh_tien : 0,
            thanhtien_ch: (row.service_id === 33 ) ? thanh_tien : 0,
            dathu_dv: (row.service_id === 19 ) ? row.receipt_total : 0,
            dathu_ch: (row.service_id === 33 ) ? row.receipt_total : 0,
            conlai_dv_view: (row.service_id === 19 ) ? thanh_tien - row.receipt_total : 0,
            conlai_ch_view: (row.service_id === 33 ) ? thanh_tien - row.receipt_total : 0,
            conlai_dv: (row.service_id === 19 ) ? thanh_tien - row.receipt_total : 0,
            conlai_ch: (row.service_id === 33 ) ? thanh_tien - row.receipt_total : 0,
            conlai_tong: thanh_tien - row.receipt_total
        };
    });

    const filtered = applyFilters(mapped);
    setDisplayData(filtered);

}, [data, paramsPaginator, filters, customers, employees]);
  const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column rowSpan={2} />
                <Column header="Ngày hạch toán" rowSpan={2} />
                <Column header="Giao nhận" headerClassName="my-title-center" rowSpan={2} />
                <Column header="Chứng từ" headerClassName="my-title-center" colSpan={2} />
                <Column header="Nợ" headerClassName="my-title-center" colSpan={2} />
                <Column header="Đã thu" headerClassName="my-title-center" colSpan={2} />
                <Column frozen alignFrozen="right" className="font-bold" header="Còn lại" headerClassName="my-title-center" colSpan={3} />
                <Column frozen alignFrozen="right" className="font-bold" header="Số thu" headerClassName="my-title-center" colSpan={3} />
            </Row>
            <Row>
                <Column header="Số file"/>
                <Column style={{width: "250px"}} header="Nội dung"/>
                <Column style={{width: "150px"}} header="Phí Cược"/>
                <Column style={{width: "150px"}} header="Tạm Thu"/>
                <Column header="Phí Cược"/>
                <Column header="Tạm Thu"/>
                <Column style={{width: "150px"}} frozen alignFrozen="right" className="font-bold" header="Phí Cược" />
                <Column style={{width: "150px"}} frozen alignFrozen="right" className="font-bold" header="Tạm Thu" />
                <Column style={{width: "150px"}} frozen alignFrozen="right" className="font-bold" header="Còn lại" />
                <Column style={{width: "10px"}} frozen alignFrozen="right" className="font-bold" header="" />
                <Column style={{width: "140px"}} frozen alignFrozen="right" className="font-bold" header="Số Thu Phí Cược" />
                <Column style={{width: "140px"}} frozen alignFrozen="right" className="font-bold" header="Số Thu Tạm Thu" />
            </Row>
             <Row>
                <Column />
                <Column />
                <Column />
                <Column header={fileNumberHeader} headerClassName="my-title-center"/>
                <Column header={nameHeader} headerClassName="my-title-center"/>
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
          <div style={{ height: 'calc(100vh - 8rem)' }}>
                  <Splitter style={{ height: '100%', width: '100%' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <DataTableClient
                            rowHover
                            value={displayData}
                            headerColumnGroup={headerGroup}
                            loading={loading}
                            dataKey="id"
                            title="Tài khoản"
                            filterDisplay="row"
                            className={classNames("Custom-DataTableClient")}
                            scrollable
                            scrollHeight="flex"
                            style={{ flex: 1 }}
                            tableStyle={{ minWidth: "2000px" }} // ép bảng rộng hơn để có scroll ngang
                        >
                              <Column field="accounting_date" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                              <Column field="userGiaoNhan" filter showFilterMenu={false} filterMatchMode="contains" />
                              <Column field="fileNumber" filter showFilterMenu={false} filterMatchMode="contains" />
                              <Column field="name" filter showFilterMenu={false} filterMatchMode="contains" />
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
                                  const thanh_tien = Math.round(rowData.price);
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
                                if(row.service_id === 19){
                                  const price = typeof row.price === "string"
                                    ? parseFloat(row.price.replace(/[^0-9.]/g, "")) || 0
                                    : Number(row.price) || 0;
                                  const thanh_tien = Math.round(price);
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
                                if(row.service_id === 33){
                                  const price = typeof row.price === "string"
                                    ? parseFloat(row.price.replace(/[^0-9.]/g, "")) || 0
                                    : Number(row.price) || 0;
                                  const thanh_tien = Math.round(price);
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
                  </Splitter>
          </div>
       
      </div>
    </>
  );
}
