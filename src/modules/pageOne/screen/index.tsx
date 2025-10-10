import { Card } from "primereact/card";
import { ScrollTop } from "primereact/scrolltop";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "redux/features/toast";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
export default function PageOne() {
    const { handleParamUrl} = useHandleParamUrl(); 
    const dispatch = useDispatch();
    const abc =()=>{
        dispatch(
            showToast({
                severity: 'error',
                summary: 'Successful',
                detail: 'Đăng nhập thành công!',
            })
        );
    }
    const [query, setQuery] = useState('');


    const handleSubmit = (event:any) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const formObject = Object.fromEntries(data);
      handleParamUrl(formObject)
    } 
    const handleChange = (event:any) => {
      setQuery(event.target.value);
    };
  
    return (
        <>
        <div className="card">
           Đang cập nhật
        </div>
        <ScrollTop />
        </>
    )
}