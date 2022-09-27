import React from "react";
import classNames from "classnames";

type IconProps = {
  className?: string;
};

export const ExclamationIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={classNames("w-5", "h-5", className)}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const SuccessIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={classNames("w-5", "h-5", className)}
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm3.059 8.062a.75.75 0 10-.993-1.124 12.785 12.785 0 00-3.209 4.358L9.53 12.22a.75.75 0 00-1.06 1.06l2.135 2.136a.75.75 0 001.24-.289 11.264 11.264 0 013.214-4.815z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const PencilIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={classNames("w-5", "h-5", className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  );
};

export const CreditCardIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames("w-5", "h-5", className)}
    >
      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-2zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"></path>
    </svg>
  );
};

export const MapIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames("w-5", "h-5", className)}
    >
      <g>
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M16.95 11.95a6.996 6.996 0 0 0 1.858-6.582l2.495-1.07a.5.5 0 0 1 .697.46V19l-7 3-6-3-6.303 2.701a.5.5 0 0 1-.697-.46V7l3.129-1.341a6.993 6.993 0 0 0 1.921 6.29L12 16.9l4.95-4.95zm-1.414-1.414L12 14.07l-3.536-3.535a5 5 0 1 1 7.072 0z"></path>
      </g>
    </svg>
  );
};

export const PersonIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames("w-5", "h-5", className)}
    >
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
    </svg>
  );
};
