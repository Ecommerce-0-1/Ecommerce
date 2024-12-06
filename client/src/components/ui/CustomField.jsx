import PropTypes from "prop-types";

function CustomField({ label, value, className, style }) {
  const classNames = {
    container: className,
    label: "font-bold text-black mb-1",
    valueContainer: "",
    valueSpan:
      "inline-block p-2 rounded-md border bg-white shadow-md transition-colors duration-300 hover:bg-white hover:bg-opacity-80 hover:shadow-yellow-500 transition-shadow",
  };

  return (
    <div className={`mt-4 grid gap-2 ${classNames.container}`}>
      <div className={classNames.label}>{label}</div>
      <div className={`${classNames.valueContainer}`} style={style}>
        <span className={classNames.valueSpan}>{value}</span>
      </div>
    </div>
  );
}

CustomField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object, // Define style prop type
};

export default CustomField;
