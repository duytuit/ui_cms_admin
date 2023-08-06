
import { AddForm, InputForm } from "components/common/AddForm";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Editor from "components/common/Editor";
import {  Dropdown, FileUpload, InputSwitch, InputText, Panel } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { listToast, scrollToTop, refreshObject } from "utils";
import { updatePost, addPost, listPost } from "../api";
import { useDispatch } from "react-redux";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { useListCategories } from "modules/categories/service";
import { uploadFile } from "lib/request";
const UpdatePost = () => {
  const { handleParamUrl} = useHandleParamUrl(); 
  const [visible, setVisible] = useState(false);
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [infos, setInfos] = useState<any>({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = (e:any) => {
        e.preventDefault();
        let info = {
          ...infos, status: infos.status ? 0 : 1,
      };
      console.log(info);
      
      // setLoading(true);
      // fetchDataSubmit(info);
    };
     async function fetchDataSubmit(info:any) {
      if (info.id) {
          const response = await updatePost(info);
          if (response) setLoading(false);
          if (response.data.code === 200) {
              // navigate('/post');
              dispatch(showToast({ ...listToast[0], detail: 'Cập nhật thành công!' }));
          } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
      } else {
          const response = await addPost(info);
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
          listPost({id:id}).then(res=>{
              const detail = res.data.data?.rows[0]
              if(detail){
                let info = {
                  ...detail, status: detail.status === 0 ? true : false
                };
                console.log(info);
                
                setInfos(info)
              }
          }).catch(err => {
            //setHasError(true)
        });
       }
    },[])
    const _categories:any = useListCategories();
    const Type = [
      { name: '1 Lần', type: 1 },
      { name: 'Nhiều lần', type: 2 },
     ];
     const uploadImage= async (event:any)=>{
      const files = event.target.files
       const rs_upload = await uploadFile('system/upload/create',files)
      console.log(rs_upload);
       if(rs_upload.data.code === 200){
        const externalLink = rs_upload.data.data[0].externalLink.replace("public", "")
           document.getElementsByClassName("btn-select-image-inner")[0].innerHTML = `<img src="${process.env.REACT_APP_UPLOAD_CDN+externalLink}" style="width: 100%;
           height: 240px;
           object-fit: contain;">`;
       }
     }
    return (
      <>
        <AddForm
          className="w-full"
          style={{ margin: "0 auto" }}
          checkId={infos.id}
          title="bài viết"
          loading={loading}
          onSubmit={handleSubmit}
          routeList="/post/list"
          route={Number(id) ? "/post/update" : "/post/add"}
        >
          <div className="grid">
            <div className="col-8">
              <div className="field">
                <Panel header="Thông tin">
                  <div style={{ backgroundColor: "#f8f9fa" }} className="card">
                    <div className="field grid">
                      <label
                        htmlFor="name"
                        className="col-12 mb-2 md:col-3 md:mb-0"
                      >
                        Tên bài viết
                      </label>
                      <div className="col-12 md:col-9">
                        <InputForm
                          className="w-full"
                          id="name"
                          value={infos.name}
                          onChange={(e: any) =>
                            setInfos({ ...infos, name: e.target.value })
                          }
                          label="Tên bài viết"
                          required
                        />
                      </div>
                    </div>
                    <div className="field grid">
                      <label
                        htmlFor="slug"
                        className="col-12 mb-2 md:col-3 md:mb-0"
                      >
                        Slug
                      </label>
                      <div className="col-12 md:col-9">
                        <InputForm
                          className="w-full"
                          id="slug"
                          value={infos.slug}
                          onChange={(e: any) =>
                            setInfos({ ...infos, slug: e.target.value })
                          }
                          label="Nếu bạn để trống, nó sẽ được tạo tự động"
                        />
                      </div>
                    </div>
                    <div className="field grid">
                      <label
                        htmlFor="summary"
                        className="col-12 mb-2 md:col-3 md:mb-0"
                      >
                        Summary
                      </label>
                      <div className="col-12 md:col-9">
                        <InputForm
                          className="w-full"
                          id="summary"
                          value={infos.summary}
                          onChange={(e: any) =>
                            setInfos({ ...infos, summary: e.target.value })
                          }
                          label="Summary & Description (Meta Tag)"
                        />
                      </div>
                    </div>
                    <div className="field grid">
                      <label
                        htmlFor="keywords"
                        className="col-12 mb-2 md:col-3 md:mb-0"
                      >
                        Keywords
                      </label>
                      <div className="col-12 md:col-9">
                        <InputForm
                          className="w-full"
                          id="keywords"
                          value={infos.keywords}
                          onChange={(e: any) =>
                            setInfos({ ...infos, keywords: e.target.value })
                          }
                          label="Keywords (Meta Tag)"
                        />
                      </div>
                    </div>
                    <div className="field grid">
                      <label
                        htmlFor="remark"
                        className="col-12 mb-3 md:col-3 md:mb-0"
                      >
                        Danh mục
                      </label>
                      <div className="col-12 md:col-9">
                        <span className="p-float-label">
                          <Dropdown
                            inputId="dd-city"
                            filter
                            label="Danh mục"
                            className="w-full"
                            value={infos.categoryId}
                            options={_categories.rows}
                            optionLabel="name"
                            optionValue="id"
                            onChange={(e: any) =>
                              setInfos({
                                ...infos,
                                categoryId: e.target.value,
                              })
                            }
                          />
                          <label htmlFor="dd-city">Danh mục</label>
                        </span>
                      </div>
                    </div>
                    <div className="field grid">
                      <label
                        htmlFor="tags"
                        className="col-12 mb-2 md:col-3 md:mb-0"
                      >
                        Tags
                      </label>
                      <div className="col-12 md:col-9">
                        <InputForm
                          className="w-full"
                          id="tags"
                          value={infos.tags}
                          onChange={(e: any) =>
                            setInfos({ ...infos, tags: e.target.value })
                          }
                          label="tags"
                        />
                      </div>
                    </div>
                    <div className="field grid">
                      <label
                        htmlFor="is_picked"
                        className="col-12 mb-2 md:col-3 md:mb-0"
                      >
                        Thêm vào lựa chọn chúng tôi
                      </label>
                      <div className="col-12 md:col-9">
                        <InputSwitch
                          checked={infos.is_picked}
                          onChange={(e: any) =>
                            setInfos({ ...infos, is_picked: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="field grid">
                      <label
                        htmlFor="need_auth"
                        className="col-12 mb-2 md:col-3 md:mb-0"
                      >
                        Chỉ hiện thị cho người dùng đã đăng ký
                      </label>
                      <div className="col-12 md:col-9">
                        <InputSwitch
                          checked={infos.need_auth}
                          onChange={(e: any) =>
                            setInfos({ ...infos, need_auth: e.target.value })
                          }
                        />
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
                </Panel>
              </div>
              <Editor value={infos.description?infos.description:''} onChange={(value: any) =>setInfos({ ...infos, description:value })} />
            </div>
            <div className="col-4">
              <div className="field">
                <Panel header="Ảnh">
                  <div className="flex justify-content-center">
                    <label htmlFor="post_image_id"
                      id="post_select_image_container"
                      className="post-select-image-container"
                    >
                      <div className="btn-select-image-inner">
                          <i className="fa fa-image"></i>
                          <div className="btn">Chọn ảnh</div>
                        </div>
                     <InputText type="file" name="post_image_id" onChange={uploadImage} style={{display:'none'}} id="post_image_id" value=""></InputText>
                    </label>
                  </div>
                </Panel>
              </div>
              <div className="field">
                <Panel header="File">
                  <div className="flex justify-content-center">
                    <div
                      style={{ backgroundColor: "#f8f9fa" }}
                      className="card col-6"
                    ></div>
                  </div>
                </Panel>
              </div>
              <div className="field">
                <Panel header="Slider">
                  <div className="flex justify-content-center">
                    <div
                      style={{ backgroundColor: "#f8f9fa" }}
                      className="card col-6"
                    ></div>
                  </div>
                </Panel>
              </div>
            </div>
          </div>
        </AddForm>
      </>
    );
}

export default UpdatePost;