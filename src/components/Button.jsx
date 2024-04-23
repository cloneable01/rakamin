import PropTypes from "prop-types";
import "../index.css";

const Button = ({ type, shape, size, className, children, ...rest }) => {
  let buttonClass =
    "inline-flex items-center justify-center border border-transparent font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 h-fit text-white";

  switch (type) {
    case "default":
      buttonClass += "text-white btn-default focus:ring-blue-400";
      break;
    case "primary":
      buttonClass += "text-white btn-primary focus:ring-blue-400";
      break;
    case "danger":
      buttonClass += "text-white btn-danger focus:ring-red-400";
      break;
    case "secondary":
      buttonClass +=
        "text-white bg-slate-200 hover:bg-gray-300 focus:ring-gray-400";
      break;
    default:
      break;
  }

  switch (shape) {
    case "round":
      buttonClass += " rounded-full";
      break;
    case "circle":
      buttonClass += " rounded-full p-0";
      break;
    default:
      break;
  }

  switch (size) {
    case "small":
      buttonClass += " px-2 py-1 text-xs";
      break;
    case "large":
      buttonClass += " px-4 py-1 text-lg";
      break;
    default:
      buttonClass += " px-3 py-1 text-sm";
      break;
  }

  buttonClass += ` ${className}`;

  return (
    <div className="my-auto">
      <button
        className={buttonClass}
        {...rest}
        style={{ color: "white !important" }}
        onClick={rest.onClick}
      >
        {children}
      </button>
    </div>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["primary", "secondary"]),
  shape: PropTypes.oneOf(["round", "circle"]),
  size: PropTypes.oneOf(["small", "default", "large"]),
  className: PropTypes.string,
  children: PropTypes.node,
};

Button.defaultProps = {
  type: "default",
  shape: "default",
  size: "default",
  className: "",
};

export default Button;
