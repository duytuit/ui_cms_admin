
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Editor from "components/common/Editor";
import { Accordion } from "components/uiCore/panel/Accordion";
import { AccordionTab } from "primereact/accordion";
import { Button, FormInput, InputSwitch, InputText, InputTextarea, Panel } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { listToast, scrollToTop, refreshObject } from "utils";
import { useDispatch } from "react-redux";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { updateCategories, addCategories, listCategories } from "modules/categories/api";
import { uploadFile } from "lib/request";
const UpdateCatePost = () => {
  const { handleParamUrl} = useHandleParamUrl(); 
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [infos, setInfos] = useState<any>({type:CategoryEnum.post});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = (e:any) => {
        e.preventDefault();
        let info = {
          ...infos, status: infos.status ? 0 : 1,
      };
      console.log('info',info);
      
      setLoading(true);
      fetchDataSubmit(info);
    };
     async function fetchDataSubmit(info:any) {
      if (info.id) {
          const response = await updateCategories(info);
          if (response) setLoading(false);
          if (response.data.code === 200) {
              // navigate('/categories');
              dispatch(showToast({ ...listToast[0], detail: 'Cập nhật thành công!' }));
          } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
      } else {
          const response = await addCategories(info);
          if (response) setLoading(false);
          if (response.data.code === 200) {
              scrollToTop();
              setInfos({ ...refreshObject(infos), status: true })
              dispatch(showToast({ ...listToast[0], detail: 'Thêm thành công!' }));
          } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
      }
  };
    useEffect(()=>{
       if(id){
          listCategories({id:id,type:CategoryEnum.post}).then(res=>{
              const detail = res.data.data?.rows[0]
              if(detail){
                let info = {
                  ...detail, status: detail.status === 0 ? true : false,
                };
                setInfos(info)
              }
          }).catch(err => {
            //setHasError(true)
        });
       }
    },[])
    const uploadImage = async (event: any) => {
      const files = event.target.files;
      const rs_upload = await uploadFile("system/upload/create", files);
      console.log(rs_upload);
      if (rs_upload.data.code === 200) {
        const externalLink = rs_upload.data.data[0].externalLink.replace(
          "public",
          ""
        );
        //  document.getElementsByClassName("btn-select-image-inner")[0].innerHTML = `<img src="${process.env.REACT_APP_UPLOAD_CDN+externalLink}" style="width: 100%;
        //  height: 240px;
        //  object-fit: contain;">`;
        setInfos({
          ...infos,
          image: JSON.stringify({ src: externalLink, alt: "" }),
        });
      }
    };
    return (
      <>
        <AddForm
          className="w-full"
          style={{ margin: "0 auto" }}
          checkId={infos.id}
          title="Danh mục bài viết"
          loading={loading}
          onSubmit={handleSubmit}
          routeList="/category/post/list"
          route={Number(id) ? "/categories/update" : "/category/post/add"}
        >
          <div className="field">
            <Panel header="Thông tin">
              <div className="flex justify-content-center">
                <div
                  style={{ backgroundColor: "#f8f9fa" }}
                  className="card col-6"
                >
                  <div className="field grid">
                    <label
                      htmlFor="name"
                      className="col-12 mb-2 md:col-3 md:mb-0"
                    >
                      Tên
                    </label>
                    <div className="col-12 md:col-9">
                      <InputForm
                        className="w-full"
                        id="name"
                        value={infos.name}
                        onChange={(e: any) =>
                          setInfos({ ...infos, name: e.target.value })
                        }
                        label="Tên"
                        required
                      />
                    </div>
                  </div>
                  <div className="field grid">
                    <label
                      htmlFor="remark"
                      className="col-12 mb-3 md:col-3 md:mb-0"
                    >
                      Ghi chú
                    </label>
                    <div className="col-12 md:col-9">
                      <InputForm
                        className="w-full"
                        id="remark"
                        value={infos.remark}
                        onChange={(e: any) =>
                          setInfos({ ...infos, remark: e.target.value })
                        }
                        label="Ghi chú"
                      />
                    </div>
                  </div>
                  <div className="field grid">
                    <label
                      htmlFor="desc"
                      className="col-12 mb-3 md:col-3 md:mb-0"
                    >
                      Mô tả
                    </label>
                    <div className="col-12 md:col-9">
                      <span className="p-float-label">
                        <InputTextarea
                          id="desc"
                          value={infos.desc}
                          onChange={(e: any) =>
                            setInfos({ ...infos, desc: e.target.value })
                          }
                          rows={5}
                          cols={30}
                          className="w-full"
                        />
                        <label htmlFor="desc">Mô tả</label>
                      </span>
                    </div>
                  </div>
                  <div className="field grid">
                  <label
                      htmlFor="desc"
                      className="col-12 mb-3 md:col-3 md:mb-0"
                    >
                      Ảnh
                    </label>
                    <div className="col-12 md:col-9">
                    <div className="flex justify-content-center">
                      <label
                        htmlFor="post_image_id"
                        id="post_select_image_container"
                        className="post-select-image-container"
                      >
                        <div className="btn-select-image-inner">
                          {infos && infos.image ? (
                            <>
                              <img
                                src={
                                  process.env.REACT_APP_UPLOAD_CDN +
                                  JSON.parse(infos.image).src
                                }
                                style={{
                                  width: "100%",
                                  height: "240px",
                                  objectFit: "contain",
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <i className="fa fa-image"></i>
                              <div className="btn">Chọn ảnh</div>
                            </>
                          )}
                        </div>
                        <InputText
                          type="file"
                          name="post_image_id"
                          onChange={uploadImage}
                          style={{ display: "none" }}
                          id="post_image_id"
                          value=""
                        ></InputText>
                      </label>
                    </div>
                    </div>
               
                  </div>
                  <div className="field grid">
                    <label
                      htmlFor="status"
                      className="col-12 mb-2 md:col-3 md:mb-0"
                    >
                      Trạng thái
                    </label>
                    <div className="col-12 md:col-9">
                      <InputSwitch
                        checked={infos.status}
                        onChange={(e: any) =>
                          setInfos({ ...infos, status: e.target.value })
                        }
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
                    <FormInput id="email2" type="text" label="email2" />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput id="email2" type="text" label="email2" />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput id="email2" type="text" label="email2" />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput id="email2" type="text" label="email2" />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput id="email2" type="text" label="email2" />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput id="email2" type="text" label="email2" />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput id="email2" type="text" label="email2" />
                  </div>
                  <div className="field col-3">
                    <label htmlFor="email2">Email</label>
                    <FormInput id="email2" type="text" label="email2" />
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

export default UpdateCatePost;