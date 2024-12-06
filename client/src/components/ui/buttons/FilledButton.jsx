import PropTypes from "prop-types";
import CustomLink from "../CustomLink";

function FilledButton({
  path,
  text,
  icon,
  width,
  height,
  iconLeft = false,
  isButton = false,
  onClick,
  buttonType,
  isDisable,
  className = "rounded-custom-44",
}) {
  const buttonStyles = {
    normal: `${className}  bg-primary_1 justify-center items-center inline-flex text-primary_2 transaction-colors duration-200 select-none`,
    disabled: `${className} bg-secondary_4 justify-center items-center inline-flex text-primary_2 transaction-colors duration-200 select-none`,
  };

  const buttonClass = isDisable ? buttonStyles.disabled : buttonStyles.normal;

  return isButton ? (
    <button
      onClick={onClick}
      type={buttonType || "button"}
      disabled={isDisable}
      className={`${width} ${height} ${buttonClass}`}
    >
      {iconLeft ? (
        <>
          {icon}
          {text}
        </>
      ) : (
        <>
          {text}
          {icon}
        </>
      )}
    </button>
  ) : isDisable ? (
    <div className={`${width} ${height} ${buttonStyles.disabled}`}>{text}</div>
  ) : (
    <CustomLink path={path}>
      <button type='button' className={`${width} ${height} ${buttonClass}`}>
        {iconLeft ? (
          <>
            {icon}
            {text}
          </>
        ) : (
          <>
            {text}
            {icon}
          </>
        )}
      </button>
    </CustomLink>
  );
}

FilledButton.propTypes = {
  path: PropTypes.string,
  text: PropTypes.string,
  icon: PropTypes.element,
  iconLeft: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
  isButton: PropTypes.bool,
  onClick: PropTypes.func,
  buttonType: PropTypes.string,
  isDisable: PropTypes.bool,
};

export default FilledButton;
