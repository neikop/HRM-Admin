import NumberFormat from "react-number-format";

const InputNumberFormat = ({ inputRef, onChange, ...props }) => (
  <NumberFormat
    {...props}
    getInputRef={inputRef}
    allowNegative={false}
    onValueChange={({ value, floatValue }) => {
      onChange({ target: { value: floatValue } });
    }}
  />
);

export default InputNumberFormat;
