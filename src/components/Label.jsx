import PropTypes from "prop-types";
import "../index.css";

const Label = ({ type, shape, size, className, children, ...rest }) => {
  let itemClass =
    "inline-flex items-center justify-center border border-transparent font-medium rounded shadow-sm h-fit";

  switch (type) {
    case "default":
      itemClass += "text-white label-default px-1.5 py-0.25 font-normal";
      break;
    case "warning":
      itemClass += "text-white label-warning px-1.5 py-0.25 font-normal";
      break;
    case "danger":
      itemClass += "text-white label-danger px-1.5 py-0.25 font-normal";
      break;
    case "success":
      itemClass += "text-white label-success px-1.5 py-0.25 font-normal";
      break;
    default:
      break;
  }

  switch (shape) {
    case "round":
      itemClass += "rounded-full";
      break;
    case "circle":
      itemClass += "rounded-full p-0";
      break;
    default:
      break;
  }

  switch (size) {
    case "small":
      itemClass += "py-1 px-2 text-xs";
      break;
    case "large":
      itemClass += "py-1 px-4 text-lg";
      break;
    default:
      break;
  }

  itemClass += ` ${className}`;

  return (
    <div className="my-auto w-fit">
      <div className={itemClass} {...rest}>
        {children}
      </div>
    </div>
  );
};

Label.propTypes = {
  type: PropTypes.oneOf(["default", "warning", "danger", "success"]),
  shape: PropTypes.oneOf(["round", "circle"]),
  size: PropTypes.oneOf(["small", "default", "large"]),
  className: PropTypes.string,
  children: PropTypes.node,
};

Label.defaultProps = {
  type: "default",
  shape: null,
  size: "default",
  className: "",
};

export default Label;
