import { Link } from "@remix-run/react";
import {
  faBootstrap,
  faCloudflare,
  faFacebook,
  faInstagram,
  faReact,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExternalLink from "~/components/external-link";

export default function Footer() {
  return (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
      <div className="col-md d-flex align-items-center">
        <ExternalLink
          href="https://getbootstrap.com/"
          className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"
        >
          <FontAwesomeIcon
            icon={faBootstrap}
            style={{ width: "2.5em", height: "1.75em" }}
          />
        </ExternalLink>
        <span className="mb-3 mb-md-0 text-muted">
          © 2022 Wang, Xinhe
          <br />
          Powered by{" "}
          <FontAwesomeIcon icon={faReact} style={{ height: "1em" }} />{" "}
          <ExternalLink href="https://reactjs.org/">React</ExternalLink>,{" "}
          <ExternalLink href="https://remix.run/">Remix</ExternalLink> and{" "}
          <FontAwesomeIcon icon={faCloudflare} style={{ height: "1em" }} />{" "}
          <ExternalLink href="https://pages.cloudflare.com/">
            Cloudflare Pages
          </ExternalLink>
        </span>
      </div>

      <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
        <li className="ms-3">
          <ExternalLink className="text-muted" href="https://twitter.com/wxh06">
            <FontAwesomeIcon
              icon={faTwitter}
              style={{ width: 24, height: 24 }}
            />
          </ExternalLink>
        </li>
        <li className="ms-3">
          <a className="text-muted" href="#">
            <FontAwesomeIcon
              icon={faInstagram}
              style={{ width: 24, height: 24 }}
            />
          </a>
        </li>
        <li className="ms-3">
          <a className="text-muted" href="#">
            <FontAwesomeIcon
              icon={faFacebook}
              style={{ width: 24, height: 24 }}
            />
          </a>
        </li>
      </ul>
    </footer>
  );
}
