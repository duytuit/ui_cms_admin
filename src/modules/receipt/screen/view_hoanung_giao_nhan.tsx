
import { useEffect, useMemo, useState } from "react";
import { Column, DataTable, Panel, RadioButton } from "components/uiCore";
import { useDispatch } from "react-redux";
import { Helper } from "utils/helper";
export default function ViewHoanUngGiaoNhan({ detail, debits, onClose}: {detail:any, debits: any, onClose: () => void }) {
 
  useEffect(() => {
     
    }, [detail,debits])
  return (
    <>
        <div className="field col-12">
          <div><b>Thông tin chi tiết</b></div>
            <div>{detail?.description}</div>
            <DataTable 
              rowHover 
              value={debits}
              scrollable
              scrollHeight="flex"
              style={{ flex: 1 }}
            >
                <Column 
                  header="STT" 
                  body={(rowData:any, options:any) => options.rowIndex + 1}
                />
                <Column 
                  header="Diễn giải" 
                  body={(row: any) => row.dienGiai }
                />
                <Column body={(row: any) => Helper.formatCurrency(row.receipt_total.toString())} header="Tạm ứng" />
                <Column body={(row: any) => Helper.formatCurrency((row.sumHQ+row.sumCH).toString())} header="Chi phí" />
                <Column 
                  body={(row: any) => Helper.formatCurrency(row.phaiTra.toString())} 
                  header="Hoàn lại" 
                  footer={Helper.formatCurrency(
                  debits.reduce((sum:any, item:any) => sum + (item.phaiTra || 0), 0)
                  .toString()
                    )}
                  footerStyle={{ fontWeight: "bold" }}
                />
            </DataTable>
      </div>
    </>
  );
}

