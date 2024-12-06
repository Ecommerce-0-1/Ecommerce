import PropTypes from "prop-types";
import { HashLink } from "react-router-hash-link";

export default function CustomLink({ path, children, ...rest }) {
  return (
    <HashLink to={path} smooth {...rest}>
      {children}
    </HashLink>
  );
}

CustomLink.propTypes = {
  path: PropTypes.string,
};
