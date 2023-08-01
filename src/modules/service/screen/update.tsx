
import { AddForm, InputForm, DropdownForm } from "components/common/AddForm";
import { MultiSelect } from "primereact/multiselect";
import { classNames } from "primereact/utils";
import { useParams } from "react-router-dom";
import { useDetailCampaign } from "../service";
import { useState } from "react";
import Editor from "components/common/Editor";
import { Accordion } from "components/uiCore/panel/Accordion";
import { AccordionTab } from "primereact/accordion";
import { FormInput } from "components/uiCore";
// const renderTreeData = (arrays, arrays1, arrays2) => {
//     let result = [];
//     let idArrays = {};
//     arrays1.forEach((object) => {
//         const { exchange_id } = object;
//         if (!idArrays[exchange_id]) {
//             idArrays[exchange_id] = [];
//             result.push(idArrays[exchange_id]);
//         }
//         idArrays[exchange_id].push(object);
//     });



//     result.forEach(items => {
//         items.forEach(item => {
//             item.children = [];
//             arrays2.forEach(i => {
//                 const { group_sale_id } = i;
//                 if (item.id === group_sale_id) {
//                     item.children.push(i);
//                 }
//             })
//         })
//     })

//     arrays.forEach(a => {
//         a.children = [];
//         result.forEach(r => {
//             if (a.id === r[0].exchange_id) {
//                 r.forEach(rs => {
//                     a.children.push(rs);
//                 })
//             }
//         })
//     })
//     return arrays;
// };

// export const ListSaleByTree = (props:any) => {
//     const { selectedNodeKeys, setSelectedNodeKeys, company_id, title, sort } = props;

//     const onChangeRemove = (s:any) => {
//         let arr = getArrIdFromTreeSelect(selectedNodeKeys);
//         arr = arr.filter(u => u !== s.user_id);
//         setSelectedNodeKeys(formatTreeSelect(arr));
//     };
//     let saleData:[]=[];
//     return (
//         <Fragment>
//             <div className="flex justify-content-center mb-3">
//                 <label className="block text-900 font-medium w-3 mr-2">{title}</label>
//                 <TreeSelect value={selectedNodeKeys} filter onChange={(e) => setSelectedNodeKeys(e.value)} options={company_id ? [] : []}
//                     metaKeySelection={false} className="w-9" selectionMode="checkbox"
//                     display="chip" placeholder={"Chọn " + title.toLowerCase()} style={{ minHeight: '3rem' }} />
//             </div>
//             <div className="flex justify-content-center mb-3">
//                 <label className="block text-900 font-medium w-4 mr-2"></label>
//                 <div className="card flex flex-wrap gap-2 w-full" style={{ minHeight: '10rem' }}>
//                     {sort ? <SortableList items={[]} onChangeRemove={onChangeRemove} onChange={e => setSelectedNodeKeys(formatTreeSelect(e))} />
//                         : saleData.map(s => {
//                             return <Chip key={s.id} label={s.full_name} removable onRemove={(e) => onChangeRemove(s)} style={{ maxHeight: '2.5rem' }} />
//                         })}
//                 </div>
//             </div>
//         </Fragment>
//     )
// };

const UpdateCampaign = () => {
    const { id } = useParams();
    const campaignInfo = useDetailCampaign(id);
    const [loading, setLoading] = useState(false);
    const [error1, setError1] = useState(false);
    const [error2, setError2] = useState(false);
    const [error3, setError3] = useState(false);
    const [infos, setInfos] = useState({ id:'',name: '', rule_time: '', penalty: '', round:'',
    category_id:'',
    source_id:'',
    company_id:'',
    user_id_manager:''});
    const [selectedNodeKeys, setSelectedNodeKeys] = useState([]);
    const [campaign, setCampaign] = useState({});

    // const companys = useListCompany();
    // const categorys = useListCategory({ company_id: infos.company_id });
    // const sources = useListSource({ company_id: infos.company_id });
    // const users = getSale(useListSale({ company_id: infos.company_id }));

    // useEffect(() => {
    //     if (Number(id)) {
    //         let newCampaign = {
    //             ...infos, ...campaignInfo, user_id_manager: campaignInfo && campaignInfo.user_id_manager ? JSON.parse(campaignInfo.user_id_manager) : [],
    //         };
    //         setInfos(newCampaign);
    //         setCampaign(newCampaign);
    //         if (campaignInfo && campaignInfo.user_sale_ids) {
    //             let newSaleId = [];
    //             if (campaignInfo.user_sale_ids && campaignInfo.user_sale_ids[0]) {
    //                 campaignInfo.user_sale_ids.sort((a, b) => a.sort - b.sort);
    //                 campaignInfo.user_sale_ids.forEach(u => {
    //                     if (u.user_id) newSaleId.push(u.user_id);
    //                 });
    //             };
    //             setSelectedNodeKeys(formatTreeSelect(newSaleId));
    //         };
    //     };
    // }, [campaignInfo]);

    async function fetchDataSubmit(info:any) {
        // if (campaignInfo.id) {
        //     const response = await updateCampaign(info);
        //     if (response) setLoading(false);
        //     if (response.data.status) {
        //         navigate('/campaign');
        //         dispatch(showToast({ ...listToast[0], detail: 'Cập nhật chiến dịch thành công!' }));
        //     } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
        // } else {
        //     const response = await addCampaign(info);
        //     if (response) setLoading(false);
        //     if (response.data.status) {
        //         scrollToTop();
        //         setInfos({ name: '', rule_time: '', penalty: '' });
        //         setSelectedNodeKeys([]);
        //         dispatch(showToast({ ...listToast[0], detail: 'Thêm chiến dịch thành công!' }));
        //     } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
        // }
    };

    const handleSubmit = (e:any) => {
        e.preventDefault();
        // let error = false;
        // if (!infos.category_id) {
        //     setError1(true);
        //     error = true;
        // };
        // if (!infos.source_id) {
        //     setError2(true);
        //     error = true;
        // };
        // if (!infos.user_id_manager[0]) {
        //     setError3(true);
        //     error = true;
        // };
        // if (!error) {
        //     setLoading(true);
        //     let newSaleId = convertArrIdToArrObj(getArrIdFromTreeSelect(selectedNodeKeys));
        //     newSaleId.forEach((n, index) => {
        //         n.sort = index
        //     });
        //     if (Number(id)) {
        //         if (JSON.stringify(newSaleId) === JSON.stringify(campaignInfo.user_sale_ids)) newSaleId = [];
        //         else {
        //             if (campaignInfo.user_sale_ids && campaignInfo.user_sale_ids[0]) {
        //                 const foundElement = campaignInfo.user_sale_ids.filter(d => !newSaleId.some(n => n.user_id === d.user_id));
        //                 if (foundElement && foundElement[0]) {
        //                     foundElement.forEach(f => {
        //                         newSaleId.push({ id: f.id, deleted_at: 1 });
        //                     });
        //                 };
        //                 campaignInfo.user_sale_ids.forEach((d, index) => {
        //                     newSaleId.forEach((n, index) => {
        //                         if (n.user_id === d.user_id) {
        //                             n.id = d.id;
        //                         };
        //                     })
        //                 })
        //             }
        //         };
        //     };
        //     let info = { ...removePropObject({ ...infos, user_sale_ids: newSaleId }, campaign), id: campaignInfo.id };
        //     fetchDataSubmit(info);
        // }
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

export default UpdateCampaign;