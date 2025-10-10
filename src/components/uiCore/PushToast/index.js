import * as React from 'react';
import { CToast, CToaster } from "@coreui/react";
import MuiAlert from '@mui/material/Alert';
import { useRef } from "react";
import { useStateFix, UtilHook } from "@lib";


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Toast = () => {
    const [toast] = useStateFix("TOAST", 0)
    const toaster = useRef()
    return <div>
        <CToaster ref={toaster} push={toast} placement="top-center">
        </CToaster>
    </div>
}

const ToastView = (mess, type) => <CToast autohide={true} visible={false} style={{ border: "none", outline: "none", padding: "none", boxShadow: "none", background: "rgba(0,0,0,0)" }}>
    <div style={{ margin: "12px" }}><Alert severity={type} > {mess}
    </Alert>
    </div>
</CToast>

class PushToast {
    static error(mess) {
        UtilHook.setData("TOAST")(ToastView(mess, "error"))
    }
    static info(mess) {
        console.log(UtilHook.Store)
        UtilHook.setData("TOAST")(ToastView(mess, "info"))
    }
    static success(mess) {
        UtilHook.setData("TOAST")(ToastView(mess, "success"))
    }
    static warning(mess) {
        UtilHook.setData("TOAST")(ToastView(mess, "warning"))
    }
}
export { PushToast }


