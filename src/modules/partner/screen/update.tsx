
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, scrollToTop, refreshObject } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { Panel } from "primereact/panel";
import { addPartner, showPartner, updatePartner } from "../api";
export default function UpdatePartner() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({ type: CategoryEnum.country });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    let info = {
      ...infos, status: infos.status ? 0 : 1,
    };
    console.log('info', info);
    setLoading(true);
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
    if (info.id) {
      const response = await updatePartner(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          navigate('/partner/list');
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    } else {
      const response = await addPartner(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          setInfos({ ...refreshObject(infos), status: true })
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          navigate('/partner/list');
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    }
  };
  useEffect(() => {
    if (id) {
      showPartner({ id: id, type: CategoryEnum.country }).then(res => {
        const detail = res.data.data
        if (detail) {
          let info = {
            ...detail, status: detail.status === 0 ? true : false,
          };
          setInfos(info)
        }
      }).catch(err => {
        //setHasError(true)
      });
    }
  }, [])
  return (
    <>
      <AddForm
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        title="đối tác"
        loading={loading}
        onSubmit={handleSubmit}
        routeList="/partner/list"
        route={Number(id) ? "/partner/update" : "/partner/create"}
      >
        <div className="field">
          <Panel header="Thông tin">
            <div className="flex justify-content-center">
              <div style={{ backgroundColor: "#f8f9fa" }} className="card col-6">
                <div className="field grid">
                  <label
                    htmlFor="name"
                    className="col-12 mb-2 md:col-3 md:mb-0"
                  >
                    Tên công ty
                  </label>
                  <div className="col-12 md:col-9">
                    <InputForm className="w-full"
                      id="name"
                      value={infos.name}
                      onChange={(e: any) =>
                        setInfos({ ...infos, name: e.target.value })
                      }
                      label="Tên công ty"
                      required
                    />
                  </div>
                </div>
                 <div className="field grid">
                  <label
                    htmlFor="abbreviation"
                    className="col-12 mb-2 md:col-3 md:mb-0"
                  >
                    Tên viết tắt
                  </label>
                  <div className="col-12 md:col-9">
                    <InputForm className="w-full"
                      id="abbreviation"
                      value={infos.abbreviation}
                      onChange={(e: any) =>
                        setInfos({ ...infos, abbreviation: e.target.value })
                      }
                      label="Tên viêt tắt"
                      required
                    />
                  </div>
                </div>
                <div className="field grid">
                  <label
                    htmlFor="taxCode"
                    className="col-12 mb-2 md:col-3 md:mb-0"
                  >
                    Mã số thuế
                  </label>
                  <div className="col-12 md:col-9">
                    <InputForm className="w-full"
                      id="taxCode"
                      value={infos.taxCode}
                      onChange={(e: any) =>
                        setInfos({ ...infos, taxCode: e.target.value })
                      }
                      label="Mã số thuế"
                      required
                    />
                  </div>
                </div>
                <div className="field grid">
                  <label
                    htmlFor="email"
                    className="col-12 mb-2 md:col-3 md:mb-0"
                  >
                    Email
                  </label>
                  <div className="col-12 md:col-9">
                    <InputForm className="w-full"
                      id="email"
                      value={infos.email}
                      onChange={(e: any) =>
                        setInfos({ ...infos, email: e.target.value })
                      }
                      label="Email"
                      required
                    />
                  </div>
                </div>
                <div className="field grid">
                  <label
                    htmlFor="phone"
                    className="col-12 mb-2 md:col-3 md:mb-0"
                  >
                    Số điện thoại
                  </label>
                  <div className="col-12 md:col-9">
                    <InputForm className="w-full"
                      id="phone"
                      value={infos.phone}
                      onChange={(e: any) =>
                        setInfos({ ...infos, phone: e.target.value })
                      }
                      label="Số điện thoại"
                      required
                    />
                  </div>
                </div>
                <div className="field grid">
                  <label
                    htmlFor="password"
                    className="col-12 mb-2 md:col-3 md:mb-0"
                  >
                    Mật khẩu
                  </label>
                  <div className="col-12 md:col-9">
                    <InputForm className="w-full"
                      id="password"
                      value={infos.password}
                      onChange={(e: any) =>
                        setInfos({ ...infos, password: e.target.value })
                      }
                      label="Mật khẩu"
                    />
                  </div>
                </div>
                <div className="field grid">
                  <label
                    htmlFor="address"
                    className="col-12 mb-2 md:col-3 md:mb-0"
                  >
                    Địa chỉ
                  </label>
                  <div className="col-12 md:col-9">
                    <InputForm className="w-full"
                      id="address"
                      value={infos.address}
                      onChange={(e: any) =>
                        setInfos({ ...infos, address: e.target.value })
                      }
                      label="Địa chỉ"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </AddForm>
    </>
  );
}
