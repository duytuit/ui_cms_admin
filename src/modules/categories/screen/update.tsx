
import { AddForm, InputForm, DropdownForm } from "components/common/AddForm";
import { MultiSelect } from "primereact/multiselect";
import { classNames } from "primereact/utils";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Editor from "components/common/Editor";
import { Accordion } from "components/uiCore/panel/Accordion";
import { AccordionTab } from "primereact/accordion";
import { Button, FormInput, Panel } from "components/uiCore";
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
          title="Quốc gia"
          loading={loading}
          onSubmit={handleSubmit}
          route={Number(id) ? "/campaign/update" : "/campaign/add"}
        >
           <div className="field">
           <Panel header="Thông tin">
            <div className="flex justify-content-center">
            <div style={{ backgroundColor: "#f8f9fa" }} className="card col-6">
            <div className="field grid">
              <label
                htmlFor="firstname4"
                className="col-12 mb-2 md:col-2 md:mb-0"
              >
                Tên
              </label>
              <div className="col-12 md:col-10">
                <InputForm className="w-full"
                  id="name"
                  value={infos.name}
                  onChange={(e: any) =>
                    setInfos({ ...infos, name: e.target.value })
                  }
                  label="Tên chiến dịch"
                  required
                />
              </div>
            </div>
            <div className="field grid">
              <label
                htmlFor="lastname4"
                className="col-12 mb-2 md:col-2 md:mb-0"
              >
                Ghi chú
              </label>
              <div className="col-12 md:col-10">
                <InputForm className="w-full"
                  id="name"
                  value={infos.name}
                  onChange={(e: any) =>
                    setInfos({ ...infos, name: e.target.value })
                  }
                  label="Tên chiến dịch"
                  required
                />
              </div>
            </div>
          </div>
            </div>
      
          </Panel>
           </div>
          
    
          <div className="field">
            <Button
              type="button"
              label="Thêm Section"
              severity="secondary"
              size="small"
              outlined
            />
          </div>
          <Accordion activeIndex={0}>
            <AccordionTab header="Section 1">
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