import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { classNames } from 'primereact/utils';

const FormInput = (props) => {
  const [error, setError] = useState('');
  const { label, type, validate, onChange, id, required, className, skip, ...inputProps } = props;

  const getValidateType = (type, label) => {
    let validateType = {
      errorMessage: label ? `Vui lòng nhập ${label.toLowerCase()}` : 'Vui lòng nhập đủ thông tin bắt buộc!',
    };
    switch (type) {
      case "email":
        validateType.pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        return validateType;
      case "code":
        validateType.pattern = /^[a-zA-Z0-9_]{1,50}$/;
        return validateType;
      case "phone":
        validateType.pattern = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
        return validateType;
      case "password":
        validateType.minLength = 6;
        validateType.patterns = `^[a-zA-Z0-9!@#$%^&*]{6,20}$`;
      default:
        return validateType;
    };
  };

  const Validate = (e) => {
    const value = e.target.value;
    let error = false;
    if (!value) {
      setError(getValidateType(type, label).errorMessage);
      error = true;
      return;
    };
    if (getValidateType(type).pattern && !getValidateType(type).pattern.test(value)) {
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
    <div className="w-full mb-2">
      <div className="w-full">
        <InputText
          className={classNames("w-full mb-1", className, { 'p-invalid': error })}
          {...inputProps}
          id={id}
          type={type === 'phone' ? 'number' : type}
          onChange={onChange}
          onBlur={required ? Validate : () => { }}
          onInput={required && setFocus}
          required={required}
          pattern={getValidateType(type).patterns}
        />
      </div>
      {required && error && <span className="p-error w-full mt-2">{error}</span>}
    </div>
  );
};

export default FormInput;
