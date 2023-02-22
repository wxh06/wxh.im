import Image from "next/image";
import Link from "next/link";
// https://sb.cdn.baoshuo.ren/bsi@0.0.7/banner/1600x900.webp
import baoshuoBanner from "bsi/banner/1600x900.webp";
import { Masonry } from "./mui-lab";

export const metadata = {
  title: "Links | wxh.im",
};

const links = [
  {
    href: "https://weibohan.com/",
    img: {
      src: "https://thirdqq.qlogo.cn/g?b=qq&nk=3415751684&s=640",
      width: 640,
      height: 640,
      alt: "韦博瀚",
    },
    title: "博瀚君の鸽子窝",
    desc: "蒟蒻 OIer",
  },
  {
    href: "https://icelava.top/",
    img: {
      src: "https://raw.githubusercontent.com/ForkKILLET/ForkKILLET.github.io/master/icelava.jpg",
      width: 2603,
      height: 1387,
      alt: "IceLava",
    },
    title: "IceLava",
    desc: "ForkKILLET",
  },
  {
    href: "https://blog.baoshuo.ren/?utm_source=friends",
    img: {
      src: baoshuoBanner,
      alt: "Baoshuo",
    },
    title: "Baoshuo's Blog",
    desc: "Learning is a process of discovering your own shortcomings.",
  },
];

export default function Page() {
  return (
    <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>
      {links.map(({ href, img: { src, width, height, alt }, title, desc }) => (
        <div className="px-2 pt-4 transition-all duration-100" key={title}>
          <Link href={href} target="_blank" rel="noreferrer">
            <div className="overflow-hidden rounded-xl bg-slate-200 transition-colors duration-100 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600">
              <Image
                className="w-full"
                src={src}
                width={width}
                height={height}
                alt={alt}
                quality={25}
              />
              <div className="mx-6 my-4">
                <h2 className="text-xl">{title}</h2>
                <p className="mt-3 text-lg">{desc}</p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </Masonry>
  );
}
