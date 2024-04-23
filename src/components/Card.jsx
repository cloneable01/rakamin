import PropTypes from "prop-types";
import "../index.css";

const Card = ({ type, className, children, ...rest }) => {
  let itemClass =
    "inline-flex items-center justify-center border border-transparent font-medium rounded shadow-sm h-fit text-white p-12";

  switch (type) {
    case "default":
      itemClass += "text-white label-default focus:ring-blue-400";
      break;
    case "primary":
      itemClass += "text-white bg-blue-500 focus:ring-blue-400";
      break;
    case "secondary":
      itemClass += "text-white bg-slate-200 focus:ring-gray-400";
      break;
    default:
      break;
  }

  itemClass += ` ${className}`;

  return (
    <div className="my-auto">
      <div className={itemClass} {...rest}>
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  type: PropTypes.oneOf(["primary", "secondary"]),
  className: PropTypes.string,
  children: PropTypes.node,
};

Card.defaultProps = {
  type: "default",
  className: "",
};

export default Card;
