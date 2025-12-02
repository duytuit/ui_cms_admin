
import { useEffect, useState } from "react";
import { Column, DataTable } from "components/uiCore";
import { Helper } from "utils/helper";
import { useSearchParams } from "react-router-dom";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { useListEmployeeWithState } from "modules/employee/service";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { showDebit } from "modules/Debit/api";
export default function PrintDebitNoFile() {
  const [debitDetail, setDebitDetail] = useState<any>({});
  const [details, setDetails] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { data: listCustomer } = useListCustomerDetailWithState({status: 1});
  useEffect(() => {
      if(id){
          showDebit({id: id}).then(res=>{
              const detail = res.data.data;
              if(detail){
                  const _customer = listCustomer?.find((x: any) => x.id === detail.customerDetailId);
                  let info = {
                    ...detail,
                    customerName: _customer?.partners?.name || "",
                    customerAbb: _customer?.partners?.abbreviation || "",
                  };
                  console.log(info);
                  setDebitDetail(info);
                  setDetails([info]);
              }
          }).catch(err => {
        });
      }
    }, [listCustomer,id])
    const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="TỔNG CHI PHÍ LÔ HÀNG" colSpan={2}  footerStyle={{ textAlign: 'center' }}/>
        <Column 
            footer={Helper.formatCurrency(details.reduce((sum: number, x: any) => {
                      return sum + x.price;
                    }, 0).toString())}
            footerStyle={{ fontWeight: "bold",textAlign: 'right' }}
        />
        <Column footer="" />
        <Column 
           footer={Helper.formatCurrency(
                    details.reduce((sum: number, x: any) => {
                      const thanh_tien = Math.round(x.price * (1 + x.vat / 100));
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
                    <div className="col-6"><b>Thời gian tạo:</b> {debitDetail ? Helper.formatDMYLocal(debitDetail?.accountingDate||"") : ""}</div>
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
                      <span>{debitDetail?.customerName}</span>
                    </div>
                  </td>
                  <td className="pr-4 align-top">
                   
                  </td>
                </tr>
                {/* --- HÀNG 2 --- */}
                <tr>
                  <td className="pr-4 align-top">
                   
                  </td>
                  <td className="pr-4 align-top">
                   
                  </td>
                </tr>
                {/* --- HÀNG 3 --- */}
                <tr>
                  <td className="pr-4">
                   
                  </td>
                  <td className="pr-4">
                    
                  </td>
                </tr>
                  <tr>
                  <td className="pr-4">
                    
                  </td>
                  <td className="pr-4">
                  </td>
                </tr>
              </tbody>
            </table>
            <DataTable 
              value={details || []}
              scrollable
              scrollHeight="flex"
              style={{ flex: 1 }}
              footerColumnGroup={footerGroup}
            >
                <Column header="STT" body={(rowData:any, options:any) => options.rowIndex + 1} style={{ paddingLeft: '15px' }} />
                <Column header="NỘI DUNG" body={(row: any) => row.name } className="table-title-center" />
                <Column header="SỐ TIỀN" body={(row: any) => Helper.formatCurrency(row.price.toString()) } className="table-title-center" style={{ textAlign: 'right' }}/>
                <Column header="VAT" body={(row: any) => row.vat } className="table-title-center" style={{ textAlign: 'center' }}/>
                <Column header="THÀNH TIỀN" 
                  body={(row: any) =>
                    {
                        const thanh_tien = Math.round(row.price * (1 + row.vat / 100));
                        return Helper.formatCurrency(thanh_tien.toString());
                    }
                  }
                  className="table-title-center"
                  style={{ textAlign: 'right' }}
                  />
                <Column field="note" header="GHI CHÚ" className="table-title-center"  style={{ textAlign: 'center' }}/>
                <Column header="HÓA ĐƠN" body={(row: any) => row.cus_bill } className="table-title-center"  style={{ textAlign: 'center' }}/>
            </DataTable>
      </div>
    </>
  );
}

