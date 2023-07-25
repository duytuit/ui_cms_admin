import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { Card } from "primereact/card";
import { ScrollTop } from "primereact/scrolltop";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "redux/features/toast";
export default function PageTwo() {
    const { handleParamUrl} = useHandleParamUrl(); 
    const [value, setValue] = useState('');
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(
            showToast({
                severity: 'success',
                summary: 'Successful',
                detail: 'Đăng nhập thành công!',
            })
        );
        // setSearchBarParams({myParam: 'bobby_hadz'});
    },[])
    const abc =()=>{
        dispatch(
            showToast({
                severity: 'error',
                summary: 'Successful',
                detail: 'Đăng nhập thành công!',
            })
        );
    }
    return (
        <>
        
        <div className="card">
             Đây là trang page two
        </div>
        <ScrollTop />
        <Card/>
        </>
    )
}
        