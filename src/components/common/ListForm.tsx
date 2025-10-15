// import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';
// import { classNames } from 'primereact/utils';

import { Button, FormInput, InputText } from "components/uiCore";
import Calendarz from "components/uiCore/form/Calendar";
import Dropdownz from "components/uiCore/form/Dropdown";
import MultiSelectz from "components/uiCore/form/MultiSelect";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState } from "react";
import { refreshObject } from "utils";

export const Calendar = (props:any) => {
      const [textValue, setTextValue] = useState<string>("");
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.maxLength = 10; // Giới hạn 10 ký tự (dd/mm/yyyy)
    }
  }, []);

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    let val = e.currentTarget.value.replace(/[^0-9]/g, ""); // chỉ giữ số

    // Giới hạn tối đa 8 số (ddMMyyyy)
    if (val.length > 8) val = val.slice(0, 8);

    // Auto chèn dấu /
    if (val.length > 2 && val.length <= 4)
      val = val.slice(0, 2) + "/" + val.slice(2);
    else if (val.length > 4)
      val = val.slice(0, 2) + "/" + val.slice(2, 4) + "/" + val.slice(4, 8);

    // Nếu vượt 10 ký tự thì không cập nhật
    if (val.length > 10) return;

    setTextValue(val);

    if (val.trim() === "") setDateValue(null);
  };

  const handleBlur = () => {
    const parts = textValue.split("/");
    if (parts.length === 3) {
      const [d, m, y] = parts.map(Number);

      // Giới hạn giá trị hợp lệ
      if (
        m < 1 || m > 12 ||
        d < 1 || d > 31 ||
        y < 1900 || y > 2100 ||
        parts[2].length !== 4
      ) {
        setDateValue(null);
        return;
      }

      const parsed = new Date(y, m - 1, d);
      if (
        parsed.getFullYear() !== y ||
        parsed.getMonth() !== m - 1 ||
        parsed.getDate() !== d
      ) {
        setDateValue(null);
        return;
      }

      setDateValue(parsed);
    } else {
      setDateValue(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = [
      "0","1","2","3","4","5","6","7","8","9",
      "Backspace","Delete","ArrowLeft","ArrowRight","Tab","Enter"
    ];

    // Chặn ký tự không hợp lệ
    if (!allowed.includes(e.key)) e.preventDefault();

    // Giới hạn 10 ký tự
    if (
      inputRef.current &&
      inputRef.current.value.length >= 10 &&
      !["Backspace","Delete","ArrowLeft","ArrowRight","Tab","Enter"].includes(e.key)
    ) {
      e.preventDefault();
    }

    // 👉 Nếu nhấn Enter hoặc Tab thì focus sang input tiếp theo
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault(); // Ngăn hành vi mặc định
      const form = e.currentTarget.form;
      if (form) {
        const index = Array.prototype.indexOf.call(form, e.currentTarget);
        const next = form.elements[index + 1] as HTMLElement;
        if (next) next.focus();
      }
    }
  };
    const { id,className, ...prop } = props;
    return (
        <>
            <span className="p-float-label">
                <Calendarz id={id}
                    value={dateValue}
                    panelClassName="calendar-hidden-popup"
                    placeholder="__/__/____"
                    inputMode="numeric"
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    onBlur={handleBlur}
                    valueDisplayMode="input"
                    inputRef={(el:any) => {
                    inputRef.current = el;
                    if (el) {
                        el.value = textValue;
                        el.maxLength = 10;
                    }
                    }}
                   className={classNames("w-full", className)} {...prop} />
                <label className={classNames("label-sm")} htmlFor={id}>{props.label}</label> 
            </span>
        </>
    )
};

export const MultiSelect = (props:any) => {
    const { optionLabel, optionValue, className, ...prop } = props;
    return (
        <MultiSelectz optionLabel={optionLabel ? optionLabel : 'name'} filter display="chip"
            optionValue={optionValue ? optionValue : 'id'} className='w-full' {...prop} />
    )
};

export const Input = (props:any) => {
    const { id, placeholder, className, ...prop } = props;
    return (
        <>
            <span className="p-float-label">
                <InputText  className={classNames("w-full", className)} {...prop} />
                <label className={classNames("label-sm")} >{props.label}</label> 
            </span>
        </>
    )
};

export const Dropdown = (props:any) => {
    const { optionLabel, optionValue, className, ...prop } = props;
    return (
        <Dropdownz optionLabel={optionLabel ? optionLabel : 'name'} filter appendTo="self"
            optionValue={optionValue ? optionValue : 'id'} className='w-full' {...prop} />
    )
};

export const GridForm = (props:any) => {
    const { paramsPaginator, setParamsPaginator, filter, handleFilter ,defaultParam } = props;
    const handleClear = (e:any) => {
        setParamsPaginator(defaultParam);
        refreshObject(filter)
    };

    const handleSubmit = (e:any) => {
        let filters = filter;
        e.preventDefault();
        if (handleFilter) {
            filters = handleFilter(filter);
        };
        setParamsPaginator({ ...paramsPaginator, ...filters });
    };

    return (
       <form  id="form_search" onSubmit={handleSubmit} className="grid formgrid mb-2 aligin-items-center">
            <div className="col">
                 <div className="formgrid grid">
                    {props.children}
                 </div>
            </div>
            <div className="col">
                <div className="flex justify-content-end flex-wrap">
                   <Button type="button" label="Thêm mới" severity="success" size="small" outlined />
                   <Button type="button" label="Làm mới" className="ml-2" onClick={handleClear} severity="secondary" size="small" outlined />
                   <Button type="submit" label="Lọc" className="ml-2" severity="info" size="small" raised />
                </div>
            </div>
        </form>
    )
};
