import type { LinksFunction } from "@remix-run/cloudflare";
import Masonry from "react-masonry-component";
import ExternalLink from "~/components/external-link";
import starterTemplateStyles from "~/styles/starter-template.css";

function Skill({
  children,
  proficiency,
  deprecated,
}: {
  children: React.ReactNode;
  deprecated?: boolean;
  proficiency: 0 | 1 | 2 | 3;
}) {
  return (
    <li className="d-flex align-items-start mb-1">
      <span className="d-inline">
        {deprecated ? <del>{children}</del> : children}{" "}
        <span
          className={`badge rounded-pill text-bg-${
            ["secondary", "info", "primary", "success"][proficiency]
          }`}
        >
          {["beginner", "intermediate", "familiar", "proficient"][proficiency]}
        </span>
      </span>
    </li>
  );
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: starterTemplateStyles },
];

export default function Skills() {
  return (
    <main>
      <h1 className="mb-4">Skills</h1>
      <Masonry className="row g-5">
        <div className="col-md-6">
          <h2>Programming Languages</h2>
          <p>
            Used in Open Source Projects, Olympiad in Informatics Contests, etc.
          </p>
          <ul className="icon-list ps-0">
            <Skill proficiency={2}>
              C / C++ <del>(C with STL)</del>
            </Skill>
            <Skill proficiency={3}>
              <ExternalLink href="https://www.python.org/">Python</ExternalLink>
            </Skill>
            <Skill proficiency={2}>
              JavaScript /{" "}
              <ExternalLink href="https://www.typescriptlang.org/">
                TypeScript
              </ExternalLink>
            </Skill>
            <Skill proficiency={1}>
              <ExternalLink href="https://go.dev/">Go</ExternalLink>
            </Skill>
            <Skill proficiency={0}>
              <ExternalLink href="https://www.rust-lang.org/">
                Rust
              </ExternalLink>
            </Skill>
          </ul>
        </div>

        <div className="col-md-6">
          <h2>Web Frameworks</h2>
          <p>For constructing website...</p>
          <ul className="icon-list ps-0">
            <Skill proficiency={3}>
              <ExternalLink href="https://www.djangoproject.com/">
                Django
              </ExternalLink>
            </Skill>
            <Skill proficiency={2}>
              <ExternalLink href="https://flask.palletsprojects.com/">
                Flask
              </ExternalLink>
            </Skill>
            <Skill proficiency={3}>
              <ExternalLink href="https://expressjs.com/">Express</ExternalLink>
            </Skill>
            <Skill proficiency={1}>
              <ExternalLink href="https://koajs.com/">Koa</ExternalLink>
            </Skill>
            <Skill proficiency={1}>
              <ExternalLink href="https://remix.run/">Remix</ExternalLink>
            </Skill>
          </ul>
        </div>

        <div className="col-md-6">
          <h2>Frontend / UI Frameworks</h2>
          <p>To build web applications...</p>
          <ul className="icon-list ps-0">
            <Skill proficiency={1} deprecated>
              <ExternalLink href="https://semantic-ui.com/">
                Semantic UI
              </ExternalLink>
            </Skill>
            <Skill proficiency={2}>
              <ExternalLink href="https://vuejs.org/">Vue.js</ExternalLink>
            </Skill>
            <Skill proficiency={2}>
              <ExternalLink href="https://getbootstrap.com/">
                Bootstrap
              </ExternalLink>
            </Skill>
            <Skill proficiency={1}>
              <ExternalLink href="https://reactjs.org/">React</ExternalLink>
            </Skill>
          </ul>
        </div>

        <div className="col-md-6">
          <h2>Build Tools</h2>
          <p>Bundle, minify and optimize</p>
          <ul className="icon-list ps-0">
            <Skill proficiency={2}>
              <ExternalLink href="https://webpack.js.org/">
                webpack
              </ExternalLink>
            </Skill>
            <Skill proficiency={0}>
              <ExternalLink href="https://esbuild.github.io/">
                esbuild
              </ExternalLink>
            </Skill>
            <Skill proficiency={1}>
              <ExternalLink href="https://vitejs.dev/">Vite</ExternalLink>
            </Skill>
          </ul>
        </div>

        <div className="col-md-6">
          <h2>Data-related Libraries</h2>
          <p>Data analysis, image processing, deep learning</p>
          <ul className="icon-list ps-0">
            <Skill proficiency={0}>
              <ExternalLink href="https://www.tensorflow.org/">
                TensorFlow
              </ExternalLink>
            </Skill>
            <Skill proficiency={1}>
              <ExternalLink href="https://numpy.org/">NumPy</ExternalLink>
            </Skill>
            <Skill proficiency={1}>
              <ExternalLink href="https://pandas.pydata.org/">
                pandas
              </ExternalLink>
            </Skill>
            <Skill proficiency={0}>
              <ExternalLink href="https://python-pillow.org/">
                Pillow
              </ExternalLink>
            </Skill>
          </ul>
        </div>
      </Masonry>
    </main>
  );
}
