import { json } from "@remix-run/cloudflare";
import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Masonry from "react-masonry-component";
import fetchToBase64 from "~/utils/fetch-to-base64.server";

interface ExternalLink {
  img?: string;
  title: string;
  author: string;
  description: string;
  href: string;
}

export const loader = () =>
  json([
    {
      title: "博瀚君の鸽子窝",
      author: "博瀚君",
      description: "蒟蒻 OIer",
      href: "https://weibohan.com/",
    },
    {
      img: "https://ghproxy.com/https://raw.githubusercontent.com/ForkKILLET/ForkKILLET.github.io/master/icelava.jpg",
      title: "IceLava",
      author: "ForkKILLET",
      description: "Website of IceLava",
      href: "https://icelava.top/",
    },
  ] as ExternalLink[]);

export const meta: MetaFunction = () => ({
  title: "External Links | wxh.im",
});

export const links: LinksFunction = () => [
  { rel: "dns-prefetch", href: "https://cdn.jsdelivr.net/" },
];

function Card({
  title,
  author,
  img,
  href,
  children,
}: {
  title: string;
  author: string;
  img?: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="col-sm-6 col-lg-4 mb-4">
      <div className="card">
        {img && <img src={img} className="card-img-top" alt={title} />}
        <div className="card-body">
          <h5 className="card-title">
            <a
              href={href}
              className="stretched-link"
              rel="noopener noreferrer"
              target="_blank"
            >
              {title}
            </a>
          </h5>
          <p className="card-text">{children}</p>
          <p className="card-text text-end">
            <small className="text-muted">by {author}</small>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ExternalLinks() {
  return (
    <Masonry className="row">
      {useLoaderData<ExternalLink[]>().map(
        ({ img, title, author, description, href }) => (
          <Card img={img} title={title} author={author} href={href} key={title}>
            {description}
          </Card>
        )
      )}
      <div className="col-sm-6 col-lg-4 mb-4">
        <div className="card">
          <svg
            className="bd-placeholder-img card-img-top"
            width="100%"
            height="200"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Placeholder: Image cap"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          >
            <title>Placeholder</title>
            <rect width="100%" height="100%" fill="#868e96" />
            <text x="50%" y="50%" fill="#dee2e6" dy=".3em">
              Image cap
            </text>
          </svg>

          <div className="card-body">
            <h5 className="card-title">Card title that wraps to a new line</h5>
            <p className="card-text">
              This is a longer card with supporting text below as a natural
              lead-in to additional content. This content is a little bit
              longer.
            </p>
          </div>
        </div>
      </div>
      <div className="col-sm-6 col-lg-4 mb-4">
        <div className="card p-3">
          <figure className="p-3 mb-0">
            <blockquote className="blockquote">
              <p>A well-known quote, contained in a blockquote element.</p>
            </blockquote>
            <figcaption className="blockquote-footer mb-0 text-muted">
              Someone famous in <cite title="Source Title">Source Title</cite>
            </figcaption>
          </figure>
        </div>
      </div>
      <div className="col-sm-6 col-lg-4 mb-4">
        <div className="card">
          <svg
            className="bd-placeholder-img card-img-top"
            width="100%"
            height="200"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Placeholder: Image cap"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          >
            <title>Placeholder</title>
            <rect width="100%" height="100%" fill="#868e96"></rect>
            <text x="50%" y="50%" fill="#dee2e6" dy=".3em">
              Image cap
            </text>
          </svg>

          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">
              This card has supporting text below as a natural lead-in to
              additional content.
            </p>
            <p className="card-text">
              <small className="text-muted">Last updated 3 mins ago</small>
            </p>
          </div>
        </div>
      </div>
      <div className="col-sm-6 col-lg-4 mb-4">
        <div className="card text-bg-primary text-center p-3">
          <figure className="mb-0">
            <blockquote className="blockquote">
              <p>A well-known quote, contained in a blockquote element.</p>
            </blockquote>
            <figcaption className="blockquote-footer mb-0 text-white">
              Someone famous in <cite title="Source Title">Source Title</cite>
            </figcaption>
          </figure>
        </div>
      </div>
      <div className="col-sm-6 col-lg-4 mb-4">
        <div className="card text-center">
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">
              This card has a regular title and short paragraph of text below
              it.
            </p>
            <p className="card-text">
              <small className="text-muted">Last updated 3 mins ago</small>
            </p>
          </div>
        </div>
      </div>
      <div className="col-sm-6 col-lg-4 mb-4">
        <div className="card">
          <svg
            className="bd-placeholder-img card-img"
            width="100%"
            height="260"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Placeholder: Card image"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          >
            <title>Placeholder</title>
            <rect width="100%" height="100%" fill="#868e96"></rect>
            <text x="50%" y="50%" fill="#dee2e6" dy=".3em">
              Card image
            </text>
          </svg>
        </div>
      </div>
      <div className="col-sm-6 col-lg-4 mb-4">
        <div className="card p-3 text-end">
          <figure className="mb-0">
            <blockquote className="blockquote">
              <p>A well-known quote, contained in a blockquote element.</p>
            </blockquote>
            <figcaption className="blockquote-footer mb-0 text-muted">
              Someone famous in <cite title="Source Title">Source Title</cite>
            </figcaption>
          </figure>
        </div>
      </div>
      <div className="col-sm-6 col-lg-4 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">
              This is another card with title and supporting text below. This
              card has some additional content to make it slightly taller
              overall.
            </p>
            <p className="card-text">
              <small className="text-muted">Last updated 3 mins ago</small>
            </p>
          </div>
        </div>
      </div>
    </Masonry>
  );
}
