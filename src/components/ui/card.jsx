import PropTypes from 'prop-types';

/**
 * Card component wrapper for consistent styling
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - Card content
 */
export function Card({ className = "", children, ...props }) {
  return <div className={className} {...props}>{children}</div>;
}

/**
 * CardContent component for card body styling
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - Content
 */
export function CardContent({ className = "", children, ...props }) {
  return <div className={className} {...props}>{children}</div>;
}

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

CardContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
