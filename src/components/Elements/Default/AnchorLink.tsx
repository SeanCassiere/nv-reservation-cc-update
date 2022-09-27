import React from "react";
import classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {}

const AnchorLink: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <a className={classNames("underline", className ? [...className.split(" ")] : undefined)} {...props}>
      {children}
    </a>
  );
};

export default AnchorLink;
