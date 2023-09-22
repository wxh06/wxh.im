import type { SimpleIcon } from "simple-icons";
import Icon from "@/components/SimpleIcon";
import GitHubButton from "@/components/GitHubButton";

export interface Project {
  href: string;
  name: string;
  github: `${string}/${string}`;
  description: React.ReactNode;
  icons: SimpleIcon[];
}

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {projects.map(({ href: url, name, github, description, icons }) => (
        <div
          className="rounded-xl border px-6 py-4 dark:border-gray-700"
          key={url}
        >
          <a
            className="text-lg text-blue-500 hover:underline dark:text-blue-500"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            {name}
          </a>
          <div className="float-right ml-2">
            <GitHubButton
              href={`https://github.com/${github}`}
              data-color-scheme="no-preference: light; light: light; dark: dark_dimmed;"
              data-icon="octicon-star"
              data-size="large"
              data-show-count="true"
              data-text="Star"
              aria-label={`Star ${github} on GitHub`}
            />
          </div>
          <div className="mt-2">{description}</div>
          <div className="float-right space-x-2">
            {icons.map((icon) => (
              <Icon
                className="inline-block text-gray-500 dark:text-gray-400"
                icon={icon}
                width={18}
                height={18}
                fill="currentColor"
                key={icon.slug}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
