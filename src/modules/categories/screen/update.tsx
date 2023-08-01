
import { AddForm, InputForm, DropdownForm } from "components/common/AddForm";
import { MultiSelect } from "primereact/multiselect";
import { classNames } from "primereact/utils";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Editor from "components/common/Editor";
import { Accordion } from "components/uiCore/panel/Accordion";
import { AccordionTab } from "primereact/accordion";
import { FormInput } from "components/uiCore";
const UpdateCategories = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error1, setError1] = useState(false);
    const [error2, setError2] = useState(false);
    const [error3, setError3] = useState(false);
    const [infos, setInfos] = useState({ id:'',name: '', rule_time: '', penalty: '', round:'',
    category_id:'',
    source_id:'',
    company_id:'',
    user_id_manager:''});

    const handleSubmit = (e:any) => {
        e.preventDefault();
    };

    return (
      <>
        <AddForm
          className="w-full"
          style={{ margin: "0 auto" }}
          checkId={infos.id}
          title="chiến dịch"
          loading={loading}
          onSubmit={handleSubmit}
          route={Number(id) ? "/campaign/update" : "/campaign/add"}
        >
          <div style={{ backgroundColor: "#f8f9fa" }} className="card">
            <div className="grid formgrid">
              <div className="col-12 lg:col-12">
                <InputForm
                  id="name"
                  value={infos.name}
                  onChange={(e: any) =>
                    setInfos({ ...infos, name: e.target.value })
                  }
                  label="Tên chiến dịch"
                  required
                />
                <DropdownForm
                  label="Công ty"
                  filter
                  optionValue="id"
                  optionLabel="name"
                  value={infos.company_id}
                  onChange={(e: any) => {
                    setInfos({ ...infos, company_id: e.target.value });
                    setError1(false);
                  }}
                  options={[]}
                  className={classNames({ "p-invalid": error1 })}
                  disabled={infos.round}
                />
                <DropdownForm
                  label="Dự án"
                  filter
                  optionValue="id"
                  optionLabel="cb_title"
                  disabled={infos.round}
                  value={infos.category_id}
                  onChange={(e: any) => {
                    setInfos({ ...infos, category_id: e.target.value });
                    setError1(false);
                  }}
                  options={infos.company_id ? [] : []}
                  className={classNames({ "p-invalid": error1 })}
                />
                <DropdownForm
                  label="Nguồn"
                  filter
                  optionValue="id"
                  value={infos.source_id}
                  disabled={infos.round}
                  onChange={(e: any) => {
                    setInfos({ ...infos, source_id: e.target.value });
                    setError2(false);
                  }}
                  options={infos.company_id ? [] : []}
                  className={classNames({ "p-invalid": error2 })}
                />
                {/* <ListSaleByTree sort={true} selectedNodeKeys={selectedNodeKeys} setSelectedNodeKeys={setSelectedNodeKeys}
                            company_id={infos.company_id} title="Nhân sự chạy chiến dịch" /> */}
                <div className="flex align-items-center mb-3">
                  <label className="block text-900 font-medium w-3 mr-2">
                    Người quản lý chiến dịch
                  </label>
                  <MultiSelect
                    value={infos.user_id_manager}
                    filter
                    options={[]}
                    onChange={(e) => (
                      setInfos({ ...infos, user_id_manager: e.target.value }),
                      setError3(false)
                    )}
                    optionLabel="full_name"
                    optionValue="user_id"
                    placeholder="Chọn người quản lý chiến dịch"
                    display="chip"
                    className={classNames("w-9", { "p-invalid": error3 })}
                  />
                </div>
                <InputForm
                  id="rule_time"
                  value={infos.rule_time}
                  type="number"
                  label="Thời gian chăm sóc quy định (phút)"
                  onChange={(e: any) =>
                    setInfos({ ...infos, rule_time: e.target.value })
                  }
                  required
                />
                <InputForm
                  id="penalty"
                  value={infos.penalty}
                  type="number"
                  label="Quy định phạt (tour)"
                  onChange={(e: any) =>
                    setInfos({ ...infos, penalty: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
          <Accordion activeIndex={0}>
            <AccordionTab header="Thông tin bắt buộc"></AccordionTab>
            <AccordionTab header="Thông tin chi tiết">
              <div
                style={{ backgroundColor: "#f8f9fa" }}
                className="card p-fluid"
              >
                <h5>Vertical Grid</h5>
                <div className="formgrid grid">
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput
                      id="email2"
                      type="text"
                      label="email2"
                      required
                    />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput
                      id="email2"
                      type="text"
                      label="email2"
                      required
                    />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput
                      id="email2"
                      type="text"
                      label="email2"
                      required
                    />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput
                      id="email2"
                      type="text"
                      label="email2"
                      required
                    />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput
                      id="email2"
                      type="text"
                      label="email2"
                      required
                    />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput
                      id="email2"
                      type="text"
                      label="email2"
                      required
                    />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput
                      id="email2"
                      type="text"
                      label="email2"
                      required
                    />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput
                      id="email2"
                      type="text"
                      label="email2"
                      required
                    />
                  </div>
                </div>
              </div>
              <Editor data={""} setData={""} className="w-full" />
            </AccordionTab>
          </Accordion>
        </AddForm>
      </>
    );
}

export default UpdateCategories;