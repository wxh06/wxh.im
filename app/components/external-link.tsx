export default function ExternalLink(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>
) {
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...props} rel="noopener noreferrer" target="_blank" />;
}
