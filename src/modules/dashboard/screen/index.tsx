import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { ScrollTop } from "primereact/scrolltop";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "redux/features/toast";
export default function DashBoard() {
    const { handleParamUrl} = useHandleParamUrl(); 
    const [value, setValue] = useState('');
    const dispatch = useDispatch();
    useEffect(()=>{
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
    const handleSubmit = (e:any) => {
        e.preventDefault();
    };
    return (
        <>
        <div className="card">
             Đây là trang dashboard
        </div>
        <ScrollTop />
        </>
    )
}
        