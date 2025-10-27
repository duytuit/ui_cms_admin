
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, scrollToTop, refreshObject } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { Panel } from "primereact/panel";
import { addEmployee, showEmployee, updateEmployee } from "../api";
import { Dropdown } from "components/common/ListForm";
import { useListDepartment } from "modules/department/service";
const UpdateEmployee = () => {
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
      const response = await updateEmployee(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          navigate('/employee/list');
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    } else {
      const response = await addEmployee(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          setInfos({ ...refreshObject(infos), status: true })
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          navigate('/employee/list');
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    }
  };
  const { data: departments } = useListDepartment({ params: { keyword: "abc" }, debounce: 500 });
    const departmentOptions = useMemo(() => {
      if (!Array.isArray(departments?.data)) return [];
      return departments.data.map((x: any,index:number) => ({
        label: x.name,
        value: x.id,
      }));
    }, [departments]);
  useEffect(() => {
    if (id) {
      showEmployee({ id: id, type: CategoryEnum.country }).then(res => {
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
    // ===== LOADING SCREEN =====
  if (loading) return (<></>);
  return (
    <>
      <AddForm
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        title="nhân viên"
        loading={loading}
        onSubmit={handleSubmit}
        routeList="/employee/list"
        route={Number(id) ? "/employee/update" : "/employee/create"}
      >
        <div className="field">
          <Panel header="Thông tin">
            <div className="flex justify-content-center">
              <div style={{ backgroundColor: "#f8f9fa" }} className="card col-6">
                <div className="field grid">
                  <label
                    htmlFor="firstName"
                    className="col-12 mb-2 md:col-3 md:mb-0"
                  >
                    Tên đầu
                  </label>
                  <div className="col-12 md:col-9">
                    <InputForm className="w-full"
                      id="firstName"
                      value={infos.firstName}
                      onChange={(e: any) =>
                        setInfos({ ...infos, firstName: e.target.value })
                      }
                      label="Tên đầu"
                      required
                    />
                  </div>
                </div>
                <div className="field grid">
                  <label
                    htmlFor="lastName"
                    className="col-12 mb-2 md:col-3 md:mb-0"
                  >
                    Tên cuối
                  </label>
                  <div className="col-12 md:col-9">
                    <InputForm className="w-full"
                      id="lastName"
                      value={infos.lastName}
                      onChange={(e: any) =>
                        setInfos({ ...infos, lastName: e.target.value })
                      }
                      label="Tên cuối"
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
                    htmlFor="email"
                    className="col-12 mb-2 md:col-3 md:mb-0"
                  >
                    Bộ phận
                  </label>
                  <div className="col-12 md:col-9">
                       <Dropdown
                        value={infos?.employeeDepartment?.departmentId}
                        options={departmentOptions}
                        label="Bộ phận"
                        className="p-inputtext-sm"
                        onChange={(e:any) =>
                          setInfos({
                            ...infos,
                            employeeDepartment: {
                              ...infos.employeeDepartment,
                              departmentId: e.value,     // đúng với PrimeReact
                            },
                          })
                        }
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

              </div>
            </div>
          </Panel>
        </div>
      </AddForm>
    </>
  );
}

export default UpdateEmployee;