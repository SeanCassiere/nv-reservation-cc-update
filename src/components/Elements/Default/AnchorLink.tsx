import React from "react";
import classNames from "classnames";

type Props = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

const AnchorLink: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <a className={classNames("underline", className ? [...className.split(" ")] : undefined)} {...props}>
      {children}
    </a>
  );
};

export default AnchorLink;
