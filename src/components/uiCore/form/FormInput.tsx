import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { classNames } from 'primereact/utils';

const FormInput = (props:any) => {
  const [error, setError] = useState('');
  const { label, type, validate, onChange, id, required, className, skip, ...inputProps } = props;

  const getValidateType = (type?:any, label?:any) => {
    
    let validateType = {
      errorMessage: label ? `Vui lòng nhập ${label.toLowerCase()}` : 'Vui lòng nhập đủ thông tin bắt buộc!',
      pattern:'',
      minLength:0,
      patterns:'',
    };
    switch (type) {
      case "email":
        validateType.pattern = "/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/";
        return validateType;
      case "code":
        validateType.pattern = "/^[a-zA-Z0-9_]{1,50}$/";
        return validateType;
      case "phone":
        validateType.pattern = "/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/";
        return validateType;
      case "password":
        validateType.minLength = 6;
        validateType.patterns = "^[a-zA-Z0-9!@#$%^&*]{6,20}$";
        return validateType;
      default:
        return validateType;
    };
  };

  const Validate = (e:any) => {
    const value = e.target.value;
    let error = false;
    if (!value) {
      setError(getValidateType(type, label).errorMessage);
      error = true;
      return;
    };
    if (getValidateType(type).pattern && RegExp(getValidateType(type).pattern).test(value)) {
      setError(`Vui lòng nhập đúng định dạng`);
      error = true;
    };
    if (getValidateType(type).minLength && value.length < getValidateType(type).minLength) {
      setError(`Vui lòng tối thiểu ${getValidateType(type).minLength} ký tự`);
      error = true;
    };
    if (!error) {
      setError('');
    }
  };

  const setFocus = () => {
    setError('');
  };

  return (
    <>
      <span className="p-float-label">
        <InputText
          className={classNames("p-inputtext-sm",className, { 'p-invalid': error })}
          {...inputProps}
          id={id}
          type={type === 'phone' ? 'number' : type}
          onChange={onChange}
          onBlur={required ? Validate : () => { }}
          onInput={required && setFocus}
          required={required}
          pattern={ getValidateType(type).patterns !== ''?getValidateType(type).patterns : null}
        />
       <label htmlFor={id}>{props.label}</label> 
      </span>
         {required && error && <span className="p-error w-full mt-2">{error}</span>}
    </>
  );
};

export default FormInput;
