import type { SimpleIcon as SimpleIconType } from "simple-icons";

/* eslint-disable react/require-default-props */
export default function SimpleIcon({
  icon,
  title,
  fill,
  ...params
}: Omit<JSX.IntrinsicElements["svg"], "role" | "viewBox" | "xmlns" | "fill"> & {
  icon: SimpleIconType;
  fill?: string | boolean;
  title?: string;
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={
        // eslint-disable-next-line no-nested-ternary
        typeof fill === "boolean"
          ? fill
            ? `#${icon.hex}`
            : undefined
          : fill ?? "currentColor"
      }
      {...params} // eslint-disable-line react/jsx-props-no-spreading
    >
      <title>{title ?? icon.title}</title>
      <path d={icon.path} />
    </svg>
  );
}
