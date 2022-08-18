import {
  faBootstrap,
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  return (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
      <div className="col-md-4 d-flex align-items-center">
        <a
          href="/"
          className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"
        >
          <FontAwesomeIcon
            icon={faBootstrap}
            style={{ width: 30, height: 24 }}
          />
        </a>
        <span className="mb-3 mb-md-0 text-muted">© 2022 Wang, Xinhe</span>
      </div>

      <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
        <li className="ms-3">
          <a
            className="text-muted"
            href="https://twitter.com/wxh06"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FontAwesomeIcon
              icon={faTwitter}
              style={{ width: 24, height: 24 }}
            />
          </a>
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
