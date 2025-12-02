
import { useEffect, useState } from "react";
import { Column, DataTable } from "components/uiCore";
import { Helper } from "utils/helper";
import { useSearchParams } from "react-router-dom";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { useListEmployeeWithState } from "modules/employee/service";
import { listContractFileHasFileGia } from "modules/ContractFile/api";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { text } from "stream/consumers";
export default function PrintDebit() {
  const [displayFileGia, setDisplayFileGia] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { data: listCustomer } = useListCustomerDetailWithState({status: 1});
  const { data: listEmployee } = useListEmployeeWithState({});
  useEffect(() => {
      if(id){
          listContractFileHasFileGia({id: id}).then(res=>{
              const detail = res.data.data.data
              if(detail){
                      // gom debits
                    const dataArray = Array.isArray(detail) ? detail : [];
                    const groupedHasFileGia = Object.values(
                        dataArray.reduce((acc:any, cur:any) => {
                          const {debit_data,debit_bill,debit_employee_staff_id,debit_service_id,debit_type,debit_id,debit_name,debit_updated_at,debit_updated_by,debit_status,debit_accounting_date,debit_purchase_price,debit_purchase_vat,debit_total_purchase_price,debit_price,debit_vat,debit_total_price,cf_note,cf_status,cf_status_confirm,cf_updated_at,cf_updated_by, ...rest } = cur;
                          if (!acc[cur.id]) {
                            acc[cur.id] = { ...rest, debits: [] ,debit_ids: [] };
                          }
                          // chỉ gom debit nếu debitService có dữ liệu
                          if (detail) {
                            acc[cur.id].debits.push({debit_data,debit_bill,debit_employee_staff_id,debit_service_id,debit_type,debit_id,debit_name,debit_updated_at,debit_updated_by,debit_status,debit_accounting_date,debit_purchase_price,debit_purchase_vat,debit_total_purchase_price,debit_price,debit_vat,debit_total_price,cf_note,cf_status,cf_status_confirm,cf_updated_at,cf_updated_by});
                            acc[cur.id].debit_ids.push(debit_id);
                          }
                          return acc;
                        }, {} as Record<number, any>)
                      );
                    const mappedDebitFileGia = groupedHasFileGia.map((row: any) => {
                      const _customer = listCustomer?.find((x: any) => x.id === row.customer_detail_id);
                      const _employee = listEmployee.find((x: any) => x.id === row.employee_id);
                      const _sumMua = row.debits.reduce((sum: number, x: any) => sum + (x.debit_total_purchase_price || 0), 0);
                      const _sumBan = row.debits.reduce((sum: number, x: any) => sum + (x.debit_total_price || 0), 0);
                      const cf_status_confirm = row.debits.find((x: any) => x.cf_status_confirm === 0);
                      return {
                        ...row,
                        customerName: _customer?.partners?.name || "",
                        customerAbb: _customer?.partners?.abbreviation || "",
                        employee: `${_employee?.last_name ?? ""} ${_employee?.first_name ?? ""}`.trim(),
                        sumMua:_sumMua,
                        sumBan:_sumBan,
                        loiNhuan:_sumBan-_sumMua,
                        cf_status_confirm:cf_status_confirm ? 0 : 1
                      };
                    });
                setDisplayFileGia(mappedDebitFileGia);
                console.log('mappedDebitFileGia',mappedDebitFileGia);
                
              }
          }).catch(err => {
        });
      }
    }, [listCustomer,listEmployee,id])
    const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="TỔNG CHI PHÍ LÔ HÀNG" colSpan={2}  footerStyle={{ textAlign: 'center' }}/>
        <Column 
            footer={Helper.formatCurrency(displayFileGia[0]?.debits.reduce((sum: number, x: any) => {
                      return sum + x.debit_price;
                    }, 0).toString())}
            footerStyle={{ fontWeight: "bold",textAlign: 'right' }}
        />
        <Column footer="" />
        <Column 
           footer={Helper.formatCurrency(
                    displayFileGia[0]?.debits.reduce((sum: number, x: any) => {
                      const thanh_tien = Math.round(x.debit_price * (1 + x.debit_vat / 100));
                      return sum + thanh_tien;
                    }, 0).toString()
                  )}
           footerStyle={{ fontWeight: "bold",textAlign: 'right' }} />
        <Column footer="" />
        <Column footer="" />
      </Row>
    </ColumnGroup>
  );
  return (
    <>
        <div className="field col-12" style={{fontSize: 12}}>
            <p><b>CONG TY TNHH VUDACO</b></p>
            <p><b>Địa chỉ: Số 6C/195 Kieu Hạ, Phuờng Dong Hải 2, Quận Hải An, Thành Phố Hải Phòng</b></p>
            <p><b>MST: 0201723721</b></p>
            <h3 style={{ textAlign: "center",textTransform: 'uppercase' }}>
                 debit note
            </h3>
            <div className="field">
                <div className="flex justify-between">
                    <div className="col-6"><b>Thời gian tạo:</b> {displayFileGia[0] ? Helper.formatDMYLocal(displayFileGia[0]?.accounting_date) : ""}</div>
                    <div className="col-6"><b>Thời gian xuất:</b> {Helper.toDayString()}</div>
                </div>
            </div>
            {/* <div>{detail?.description}</div> */}
             <table className="w-full">
              <tbody>
                {/* --- HÀNG 1 --- */}
                <tr>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Khách hàng:</label>
                      <span>{displayFileGia[0]?.customerName}</span>
                    </div>
                  </td>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Số lượng:</label>
                      <span>{displayFileGia[0]?.quantity}</span>
                    </div>
                  </td>
                </tr>
                {/* --- HÀNG 2 --- */}
                <tr>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Số file:</label>
                      <span>{displayFileGia[0]?.file_number}</span>
                    </div>
                  </td>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Số Cont:</label>
                      <span>{displayFileGia[0]?.container_code}</span>
                    </div>
                  </td>
                </tr>
                {/* --- HÀNG 3 --- */}
                <tr>
                  <td className="pr-4">
                    <div className="mb-2">
                        <label className="font-medium mr-2">Số tờ khai:</label>
                        <span>{displayFileGia[0]?.declaration}</span>
                    </div>
                  </td>
                  <td className="pr-4">
                     <div className="mb-2">
                         <label className="font-medium mr-2">Tên sales:</label>
                          <span>{displayFileGia[0]?.sales}</span>
                     </div>
                  </td>
                </tr>
                  <tr>
                  <td className="pr-4">
                     <div className="mb-2">
                           <label className="font-medium mr-2">Số bill/book:</label>
                            <span>{displayFileGia[0]?.bill}</span>
                     </div>
                  </td>
                  <td className="pr-4">
                  </td>
                </tr>
              </tbody>
            </table>
            <DataTable 
              value={displayFileGia[0]?.debits || []}
              scrollable
              scrollHeight="flex"
              style={{ flex: 1 }}
              footerColumnGroup={footerGroup}
            >
                <Column header="STT" body={(rowData:any, options:any) => options.rowIndex + 1} style={{ paddingLeft: '15px' }} />
                <Column header="NỘI DUNG" body={(row: any) => row.debit_name } className="table-title-center" />
                <Column header="SỐ TIỀN" body={(row: any) => Helper.formatCurrency(row.debit_price.toString()) } className="table-title-center" style={{ textAlign: 'right' }}/>
                <Column header="VAT" body={(row: any) => row.debit_vat } className="table-title-center" style={{ textAlign: 'center' }}/>
                <Column header="THÀNH TIỀN" 
                  body={(row: any) =>
                    {
                        const thanh_tien = Math.round(row.debit_price * (1 + row.debit_vat / 100));
                        return Helper.formatCurrency(thanh_tien.toString());
                    }
                  }
                  className="table-title-center"
                  style={{ textAlign: 'right' }}
                  />
                <Column header="GHI CHÚ" className="table-title-center"  style={{ textAlign: 'center' }}/>
                <Column header="HÓA ĐƠN" body={(row: any) => row.debit_bill } className="table-title-center"  style={{ textAlign: 'center' }}/>
            </DataTable>
      </div>
    </>
  );
}

