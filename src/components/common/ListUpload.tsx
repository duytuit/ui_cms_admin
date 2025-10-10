import { Button,FormInput, Paginator} from "components/uiCore";
import { useState } from "react";

export const ListUpload = (props:any) => {
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    const onPageChange = (event:any) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    return (
      <>
        <div className="grid">
          <div className="col-12" style={{ marginTop: "10px" }}>
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  label="Tải ảnh"
                  severity="secondary"
                  size="small"
                  outlined
                />
                <FormInput id="email2" type="text" label="email2" />
              </div>
              <div>
                <Button
                  type="button"
                  label="Thêm ảnh"
                  severity="secondary"
                  size="small"
                  outlined
                />
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="card" style={{ marginBottom: "0" }}>
              <div className="flex flex-wrap column-gap-4 row-gap-4">
                <div className="border-round w-8rem h-8rem bg-primary font-bold flex align-items-center justify-content-center">
                  1
                </div>
                <div className="border-round w-8rem h-8rem bg-primary font-bold flex align-items-center justify-content-center">
                  2
                </div>
                <div className="border-round w-8rem h-8rem bg-primary font-bold flex align-items-center justify-content-center">
                  3
                </div>
                <div className="border-round w-8rem h-8rem bg-primary font-bold flex align-items-center justify-content-center">
                  4
                </div>
                <div className="border-round w-8rem h-8rem bg-primary font-bold flex align-items-center justify-content-center">
                  5
                </div>
                <div className="border-round w-8rem h-8rem bg-primary font-bold flex align-items-center justify-content-center">
                  6
                </div>
                <div className="border-round w-8rem h-8rem bg-primary font-bold flex align-items-center justify-content-center">
                  7
                </div>
                <div className="border-round w-8rem h-8rem bg-primary font-bold flex align-items-center justify-content-center">
                  8
                </div>
              </div>
            </div>
            <Paginator
              first={first}
              rows={rows}
              totalRecords={120}
              rowsPerPageOptions={[10, 20, 30]}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </>
    );
};