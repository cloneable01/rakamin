import PropTypes from "prop-types";
import "../index.css";

const Task = ({ type, className, children, ...rest }) => {
  let itemClass = "border font-md rounded shadow-sm h-fit";

  switch (type) {
    case "default":
      itemClass += "text-black task-default w-full py-4 px-2";
      break;
    case "warning":
      itemClass += "text-black task-warning w-full py-4 px-2";
      break;
    case "danger":
      itemClass += "text-black task-danger w-full py-4 px-2";
      break;
    case "success":
      itemClass += "text-white task-success w-full py-4 px-2";
      break;
    default:
      break;
  }

  itemClass += ` ${className}`;

  return (
    <div className="mr-4 ">
      <div className={itemClass} {...rest}>
        {children}
      </div>
    </div>
  );
};

Task.propTypes = {
  type: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "warning",
    "danger",
    "success",
  ]),
  className: PropTypes.string,
  children: PropTypes.node,
};

Task.defaultProps = {
  type: "default",
  className: "",
};

export default Task;
