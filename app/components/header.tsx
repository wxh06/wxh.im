import { NavLink } from "@remix-run/react";

export default function Header() {
  return (
    <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none"
      >
        <span className="fs-4">wxh06</span>
      </a>

      <ul className="nav nav-pills">
        <li className="nav-item">
          <NavLink to="/" end prefetch="intent" className="nav-link">
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/links" prefetch="intent" className="nav-link">
            Links
          </NavLink>
        </li>
      </ul>
    </header>
  );
}
