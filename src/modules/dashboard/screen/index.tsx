import { Card } from "components/uiCore";
import { InputText } from "primereact/inputtext";
import { ScrollTop } from "primereact/scrolltop";
import { useState } from "react";
export default function DashBoard() {
    const [value, setValue] = useState('');
    return (
        <>
            <InputText value={value} onChange={(e) => setValue(e.target.value)} />
        <div className="card">
             Đây là trang dashboard
        </div>
        <ScrollTop />
        <Card/>
        </>
    )
}
        