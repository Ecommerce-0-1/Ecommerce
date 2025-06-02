import PropTypes from "prop-types";

const SHAPE_STYLES = {
  1: "bg-secondary_5 text-custom-3xl text-primary_2 border border-solid border-secondary_3 rounded-[53px] removeInputIcon",
  2: "bg-primary_4 text-4 text-primary_2 border border-solid border-secondary_3 rounded-custom-16 ps-6 pt-[2rem] removeInputIcon",
  // For Search 
  3: "w-[250px] p-2 rounded-md bg-[#F5F5F5] inline-block ",
};

export default function CustomInput({
  className = "",
  onChange,
  onBlur,
  placeholder,
  isRequired = false,
  name,
  id,
  value,
  type = "text",
  withFocus = true,
  defaultValue = "",
  isDisable = false,
  pattern,
  shape,
  icon,
  iconLeft = false,
  iconClassName = "",
}) {
  const disabledClass = isDisable ? "bg-secondary_4" : "bg-secondary_5";
  const focusClass = withFocus
    ? "focus:outline-primary_1 transition-all duration-200"
    : "outline-none";
    
  const shapeClass = SHAPE_STYLES[shape] || 2;

  return (
    <div className='relative'>
      {icon && (
        <div
          className={`absolute top-[50%] -translate-y-1/2 transform ${
            iconLeft ? "left-3" : "right-3"
          } ${iconClassName}`}
        >
          {icon}
        </div>
      )}
      <input
        pattern={pattern}
        disabled={isDisable}
        id={id}
        name={name}
        defaultValue={defaultValue}
        value={value}
        className={`${shapeClass} ${disabledClass} ${focusClass} ${shapeClass} ${className}`}
        type={type}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={isRequired}
      />
    </div>
  );
}

CustomInput.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  isRequired: PropTypes.bool,
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  withFocus: PropTypes.bool,
  isDisable: PropTypes.bool,
  pattern: PropTypes.string,
  shape: PropTypes.number,
  icon: PropTypes.element,
  iconLeft: PropTypes.bool,
  iconClassName: PropTypes.string,
};
