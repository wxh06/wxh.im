import type { SimpleIcon as SimpleIconType } from "simple-icons";

/* eslint-disable react/require-default-props */
export default function SimpleIcon({
  icon,
  title,
  ...params
}: Omit<JSX.IntrinsicElements["svg"], "role" | "viewBox" | "xmlns"> & {
  icon: SimpleIconType;
  title?: string;
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...params} // eslint-disable-line react/jsx-props-no-spreading
    >
      <title>{title ?? icon.title}</title>
      <path d={icon.path} />
    </svg>
  );
}
