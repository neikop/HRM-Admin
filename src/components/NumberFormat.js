import InputNumberFormat from "react-number-format";

const NumberFormat = ({ inputRef, onChange, ...props }) => (
  <InputNumberFormat
    {...props}
    getInputRef={inputRef}
    allowNegative={false}
    onValueChange={({ value, floatValue }) => {
      onChange({ target: { value: floatValue } });
    }}
  />
);

export default NumberFormat;
