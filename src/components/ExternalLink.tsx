import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

/* eslint-disable react/require-default-props */
export default function ExternalLink({
  icon = true,
  children,
  ...params
}: Omit<JSX.IntrinsicElements["a"], "className" | "target" | "rel"> & {
  icon?: boolean;
}) {
  return (
    <a
      className="text-slate-500 hover:underline dark:text-slate-300"
      target="_blank"
      rel="noreferrer"
      {...params} // eslint-disable-line react/jsx-props-no-spreading
    >
      {children}
      {icon && (
        <FontAwesomeIcon
          height=".625em"
          icon={faArrowUpRightFromSquare}
          className="ml-1 align-baseline"
        />
      )}
    </a>
  );
}
