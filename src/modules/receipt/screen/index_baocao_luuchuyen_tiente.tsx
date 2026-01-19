import { useEffect, useMemo, useState } from "react";
import { GridForm } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { useGetBaoCaoLuuChuyenTienTeAsync, useGetObjectBaoCaoDoanhThuAsync } from "../service";
import { Helper } from "utils/helper";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { MyCalendar } from "components/common/MyCalendar";
import { Panel } from "components/uiCore";

const Header = ({ _setParamsPaginator, _paramsPaginator }: any) => {
  const [filter, setFilter] = useState({
    name: "",
    customerDetailId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
  const { data: customerDetails } = useListCustomerDetailWithState({ status: 1});
  // --- chuyển sang options bằng useMemo ---
  const customerOptions = useMemo(() => {
    if (!Array.isArray(customerDetails)) return [];
    return customerDetails.map((x: any) => ({
      label: x?.partners?.abbreviation ?? "(không tên)",
      value: x.id,
    }));
  }, [customerDetails]);
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

export default function ListBaoCaoLuuChuyenTienTe() {
    const { handleParamUrl } = useHandleParamUrl();
    const [displayData, setDisplayData] = useState<any>();
    const [displayDataDoanhThu, setDisplayDataDoanhThu] = useState<any>();
    const [paramsPaginator, setParamsPaginator] = useState({
        pageNum: 1,
        pageSize: 20,
        first: 0,
        render: false,
        keyword: "",
    });
    const roundMoney = (v: any) => Math.round(Number(v) || 0);

    const getById = (arr: any[], id: number) =>
      roundMoney(arr?.find(x => x.id === id)?.total_amount);
    const IDS = {
      thu_hoan_ung_giao_nhan: 1,
      thu_khac: 3,
      chi_tam_ung_lai_xe: 10,
      chi_ho_khach_hang: 11,
      chi_khac: 13,
      chi_tam_ung_tien_cho_nha_cung_cap: 14,
      chi_tam_ung_giao_nhan: 15,
      chi_sua_chua: 16,
      chi_dau_do: 17,
      chi_ve_vetc: 18,
      chi_phi_kinh_doanh_khac: 19,
      chi_tra_lai_vay: 20,
      tra_luong_nhan_vien: 21,
      thu_cong_no_khach_hang: 24,
      chi_tra_cong_no_nha_cung_cap: 25,
      chi_tien_gui_xe: 35,
      doanh_thu_khac: 36,
      tra_bao_hiem_xa_hoi: 37,
    };
    const buildData = (source: any[], prefix: 'tk' | 'dk') =>
    Object.fromEntries(
      Object.entries(IDS).map(([key, id]) => [
        `${prefix}_${key}`,
        getById(source, id),
      ])
    );
    const { data:baocaodoanhthu } = useGetObjectBaoCaoDoanhThuAsync({
            params: {...paramsPaginator},
            debounce: 500,
        });
    const { data, loading, error, refresh } = useGetBaoCaoLuuChuyenTienTeAsync({
        params: {...paramsPaginator},
        debounce: 500,
    });
  useEffect(() => {
    if (!data?.extra || !baocaodoanhthu?.extra) return;

    handleParamUrl(paramsPaginator);

    const extra = data.extra;

    const tk = buildData(extra.bao_cao_tk_results, 'tk');
    const dk = buildData(extra.bao_cao_dk_results, 'dk');
    
    // ===== Tổng phải thu =====
    const tk_tong_thukhac =  roundMoney(tk.tk_thu_khac) + roundMoney(tk.tk_doanh_thu_khac);
    const dk_tong_thukhac =  roundMoney(dk.tk_thu_khac) + roundMoney(dk.dk_doanh_thu_khac);
    const tk_tong_cac_khoan_phai_thu =
      tk.tk_thu_cong_no_khach_hang +
      tk_tong_thukhac +
      tk.tk_thu_hoan_ung_giao_nhan;

    const dk_tong_cac_khoan_phai_thu =
      dk.dk_thu_cong_no_khach_hang +
      dk_tong_thukhac +
      dk.dk_thu_hoan_ung_giao_nhan;

    // ===== Chi phí KD =====
    const sumChiPhiKD = (x: any) =>
      roundMoney(x.chi_sua_chua) +
      roundMoney(x.chi_dau_do) +
      roundMoney(x.chi_ve_vetc) +
      roundMoney(x.chi_tra_lai_vay) +
      roundMoney(x.chi_phi_kinh_doanh_khac) +
      roundMoney(x.chi_tien_gui_xe);

    const tk_chi_phi_kinh_doanh = sumChiPhiKD({
      chi_sua_chua: tk.tk_chi_sua_chua,
      chi_dau_do: tk.tk_chi_dau_do,
      chi_ve_vetc: tk.tk_chi_ve_vetc,
      chi_tra_lai_vay: tk.tk_chi_tra_lai_vay,
      chi_phi_kinh_doanh_khac: tk.tk_chi_phi_kinh_doanh_khac,
      chi_tien_gui_xe: tk.tk_chi_tien_gui_xe,
    });

    const dk_chi_phi_kinh_doanh = sumChiPhiKD({
      chi_sua_chua: dk.dk_chi_sua_chua,
      chi_dau_do: dk.dk_chi_dau_do,
      chi_ve_vetc: dk.dk_chi_ve_vetc,
      chi_tra_lai_vay: dk.dk_chi_tra_lai_vay,
      chi_phi_kinh_doanh_khac: dk.dk_chi_phi_kinh_doanh_khac,
      chi_tien_gui_xe: dk.dk_chi_tien_gui_xe,
    });
    
    
    const tk_tong_cac_khoan_chi = roundMoney(tk_chi_phi_kinh_doanh)+
    roundMoney(tk.tk_chi_phi_kinh_doanh) +
    roundMoney(tk.tk_chi_tra_cong_no_nha_cung_cap) +
    roundMoney(tk.tk_chi_tam_ung_tien_cho_nha_cung_cap) +
    roundMoney(tk.tk_chi_tam_ung_giao_nhan) +
    roundMoney(tk.tk_chi_tam_ung_lai_xe) +
    roundMoney(tk.tk_chi_khac) +
    roundMoney(tk.tk_chi_ho_khach_hang) +
    roundMoney(tk.tk_tra_luong_nhan_vien) +
    roundMoney(tk.tk_tra_bao_hiem_xa_hoi);
    
    const dk_tong_cac_khoan_chi = roundMoney(dk_chi_phi_kinh_doanh)+
    roundMoney(dk.dk_chi_phi_kinh_doanh) +
    roundMoney(dk.dk_chi_tra_cong_no_nha_cung_cap) +
    roundMoney(dk.dk_chi_tam_ung_tien_cho_nha_cung_cap) +
    roundMoney(dk.dk_chi_hoan_ung_giao_nhan) +
    roundMoney(dk.dk_chi_tam_ung_lai_xe) +
    roundMoney(dk.dk_chi_khac) +
    roundMoney(dk.dk_chi_ho_khach_hang) +
    roundMoney(dk.dk_tra_luong_nhan_vien) +
    roundMoney(dk.dk_tra_bao_hiem_xa_hoi);
    

    // ===== Lưu chuyển tiền =====
    const tk_luu_chuyen_tien_thuan_trong_ky = tk_tong_cac_khoan_phai_thu - tk_tong_cac_khoan_chi;

    const dk_luu_chuyen_tien_thuan_trong_ky = dk_tong_cac_khoan_phai_thu - dk_tong_cac_khoan_chi;

    const tien_va_tuong_duong_tien_dau_ky = dk_luu_chuyen_tien_thuan_trong_ky;

    const tien_va_tuong_duong_tien_cuoi_ky = tk_luu_chuyen_tien_thuan_trong_ky + tien_va_tuong_duong_tien_dau_ky;

    setDisplayData({
      ...tk,
      ...dk,
      tk_tong_thukhac,
      dk_tong_thukhac,
      tk_tong_cac_khoan_phai_thu,
      dk_tong_cac_khoan_phai_thu,
      tk_chi_phi_kinh_doanh,
      dk_chi_phi_kinh_doanh,
      tk_tong_cac_khoan_chi,
      dk_tong_cac_khoan_chi,
      tk_luu_chuyen_tien_thuan_trong_ky,
      dk_luu_chuyen_tien_thuan_trong_ky,
      tien_va_tuong_duong_tien_dau_ky,
      tien_va_tuong_duong_tien_cuoi_ky,
    });
    // ===== Báo cáo doanh thu =====
    const ex = baocaodoanhthu.extra;

    const loinhuantruocthue = roundMoney(
      roundMoney(ex.dt_hasfile_results?.[0]?.total_price) +
      roundMoney(ex.dt_nofile_results?.[0]?.total_price) +
      roundMoney(ex.doanhthu_khac?.[0]?.amount) -
      roundMoney(ex.cp_hasfile_results?.[0]?.total_purchase_price) -
      roundMoney(ex.cp_nofile_results?.[0]?.total_purchase_price) -
      roundMoney(ex.cp_kinhdoanh?.[0]?.amount)
    );
    const tong_dong_tien_du_tinh_den_thoi_diem_cuoi_ky = loinhuantruocthue + tien_va_tuong_duong_tien_dau_ky;
    const chenh_lech_so_voi_du_tinh = tong_dong_tien_du_tinh_den_thoi_diem_cuoi_ky - tien_va_tuong_duong_tien_cuoi_ky;
    setDisplayDataDoanhThu({ loinhuantruocthue,tong_dong_tien_du_tinh_den_thoi_diem_cuoi_ky, chenh_lech_so_voi_du_tinh});

  }, [data, baocaodoanhthu, paramsPaginator]);
    return (
      <div className="card">
        <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />
         <Panel header="Thông tin">
                <h3 style={{ textAlign: "center",textTransform: 'uppercase' }}>
                    Báo cáo lưu chuyển tiền tệ
                </h3>
                <div className="field" style={{ textAlign: "center" }}><i>Thời gian: Từ ngày ... Đến ngày ...</i></div> 
                <div className="flex justify-content-center">
                  <div className="col-6">
                    <div className="formgrid grid">
                      <table className="w-full border-1 surface-border border-collapse">
                        <thead>
                           <th className="text-center font-bold">Chi tiêu</th>
                           <th className="font-bold" style={{width:"80px"}}>Mã số</th>
                           <th className="text-center font-bold">Kỳ này</th>
                           <th className="text-center font-bold">Kỳ trước</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border-1 surface-border"><b>I. Lưu chuyển tiền từ hoạt động kinh doanh</b></td>
                                <td className="border-1 surface-border"></td>
                                <td className="border-1 surface-border"></td>
                                <td className="border-1 surface-border"></td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">1. Thu công nợ khách hàng</td>
                                <td className="border-1 surface-border text-center">01</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_thu_cong_no_khach_hang.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_thu_cong_no_khach_hang.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">2. Thu hoàn ứng giao nhận</td>
                                <td className="border-1 surface-border text-center">02</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_thu_hoan_ung_giao_nhan.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_thu_hoan_ung_giao_nhan.toString())}</td>
                            </tr>
                             <tr>
                                <td className="border-1 surface-border">3. Thu khác</td>
                                <td className="border-1 surface-border text-center">03</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_tong_thukhac.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_tong_thukhac.toString())}</td>
                            </tr>
                             <tr>
                                <td className="border-1 surface-border"><b>4. Tổng các khoản phải thu</b></td>
                                <td className="border-1 surface-border text-center">04</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_tong_cac_khoan_phai_thu.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_tong_cac_khoan_phai_thu.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">5. Chi trả công nợ nhà cung cấp</td>
                                <td className="border-1 surface-border text-center">05</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_chi_tra_cong_no_nha_cung_cap.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_chi_tra_cong_no_nha_cung_cap.toString())}</td>
                            </tr>
                           <tr>
                                <td className="border-1 surface-border">6. Chi tạm ứng cho nhà cung cấp</td>
                                <td className="border-1 surface-border text-center">06</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_chi_tam_ung_tien_cho_nha_cung_cap.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_chi_tam_ung_tien_cho_nha_cung_cap.toString())}</td>
                            </tr>
                             <tr>
                                <td className="border-1 surface-border">7. Chi tạm ứng giao nhận</td>
                                <td className="border-1 surface-border text-center">07</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_chi_tam_ung_giao_nhan.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_chi_tam_ung_giao_nhan.toString())}</td>
                            </tr>
                             <tr>
                                <td className="border-1 surface-border">8. Chi tạm ứng lái xe</td>
                                <td className="border-1 surface-border text-center">08</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_chi_tam_ung_lai_xe.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_chi_tam_ung_lai_xe.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">9. Chi hộ khách hàng</td>
                                <td className="border-1 surface-border text-center">09</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_chi_ho_khach_hang.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_chi_ho_khach_hang.toString())}</td>
                            </tr>
                             <tr>
                                <td className="border-1 surface-border">10. Chi khác</td>
                                <td className="border-1 surface-border text-center">10</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_chi_khac.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_chi_khac.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">11. Trả lương nhân viên</td>
                                <td className="border-1 surface-border text-center">11</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_tra_luong_nhan_vien.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_tra_luong_nhan_vien.toString())}</td>
                            </tr>
                             <tr>
                                <td className="border-1 surface-border">12. Trả bảo hiểm xã hội</td>
                                <td className="border-1 surface-border text-center">12</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_tra_bao_hiem_xa_hoi.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_tra_bao_hiem_xa_hoi.toString())}</td>
                            </tr>
                             <tr>
                                <td className="border-1 surface-border"><b>13. Chi phí kinh doanh</b></td>
                                <td className="border-1 surface-border text-center">13</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_chi_phi_kinh_doanh.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_chi_phi_kinh_doanh.toString())}</td>
                            </tr>
                             <tr>
                                <td className="border-1 surface-border">14. Chi sửa chữa</td>
                                <td className="border-1 surface-border text-center">14</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_chi_sua_chua.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_chi_sua_chua.toString())}</td>
                            </tr>
                             <tr>
                                <td className="border-1 surface-border">15. Chi dầu DO</td>
                                <td className="border-1 surface-border text-center">15</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_chi_dau_do.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_chi_dau_do.toString())}</td>
                            </tr>
                             <tr>
                                <td className="border-1 surface-border">16. Chi vé VETC</td>
                                <td className="border-1 surface-border text-center">16</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_chi_ve_vetc.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_chi_ve_vetc.toString())}</td>
                            </tr>
                             <tr>
                                <td className="border-1 surface-border">17. Chi trả lãi vay</td>
                                <td className="border-1 surface-border text-center">17</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_chi_tra_lai_vay.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_chi_tra_lai_vay.toString())}</td>
                            </tr>
                             <tr>
                                <td className="border-1 surface-border">18. Chi phí kinh doanh khác</td>
                                <td className="border-1 surface-border text-center">18</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_chi_phi_kinh_doanh_khac.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_chi_phi_kinh_doanh_khac.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">19. Chi tiền gửi xe</td>
                                <td className="border-1 surface-border text-center">19</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_chi_tien_gui_xe.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_chi_tien_gui_xe.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border"><b>20. Tổng các khoản chi</b></td>
                                <td className="border-1 surface-border text-center">20</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_tong_cac_khoan_chi.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_tong_cac_khoan_chi.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border"><b>21. Lưu chuyển tiền thuần trong kỳ</b></td>
                                <td className="border-1 surface-border text-center">21</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tk_luu_chuyen_tien_thuan_trong_ky.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dk_luu_chuyen_tien_thuan_trong_ky.toString())}</td>
                             </tr>
                             <tr>
                                <td className="border-1 surface-border"><b>22. Tiền và tương đương tiền đầu kỳ</b></td>
                                <td className="border-1 surface-border text-center">22</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tien_va_tuong_duong_tien_dau_ky.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}></td>
                            </tr>
                             <tr>
                                <td className="border-1 surface-border"><b>23. Tiền và tương đương tiền cuối kỳ (70 = 50 + 60 + 61)</b></td>
                                <td className="border-1 surface-border text-center">23</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tien_va_tuong_duong_tien_cuoi_ky.toString())}</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}></td>
                            </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                  <h3 style={{ textAlign: "center",textTransform: 'uppercase' }}>
                    BÁO CÁO HOẠCH ĐỊNH DÒNG TIỀN
                </h3>
                <div className="flex justify-content-center">
                  <div className="col-6">
                    <div className="formgrid grid">
                      <table className="w-full border-1 surface-border border-collapse">
                      
                        <tbody>
                            <tr>
                                <td className="border-1 surface-border"><b>1. Tiền và tương đương tiền đầu kỳ</b></td>
                                <th className="border-1 surface-border text-center" style={{width:"80px"}}>24</th>
                                <th className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tien_va_tuong_duong_tien_dau_ky.toString())}</th>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">2. Lợi nhuận trước thuế</td>
                                <td className="border-1 surface-border text-center">25</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayDataDoanhThu?.loinhuantruocthue.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">3. Tổng dòng tiền dự tính đến thời điểm cuối kỳ</td>
                                <td className="border-1 surface-border text-center">26</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayDataDoanhThu?.tong_dong_tien_du_tinh_den_thoi_diem_cuoi_ky.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">4. Tổng dòng tiền thực tế đến thời điểm cuối kỳ</td>
                                <td className="border-1 surface-border text-center">27</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.tien_va_tuong_duong_tien_cuoi_ky.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">5. Chênh lệch so với dự tính</td>
                                <td className="border-1 surface-border text-center">28</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayDataDoanhThu?.chenh_lech_so_voi_du_tinh.toString())}</td>
                            </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
          </Panel>
      </div>
    );
}