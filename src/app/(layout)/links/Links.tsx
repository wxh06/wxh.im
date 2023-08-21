"use client";

import { useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import baoshuoFavicon from "bsi/favicon/favicon.svg";
import useMasonryLayout from "@/hooks/masonry-layout";

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
    desc: "ForkΨKillet",
  },
  {
    href: "https://ucw.moe/",
    img: {
      src: "https://raw.githubusercontent.com/wuxianucw/ucw-desu/master/misaka_a.jpg",
      width: 600,
      height: 600,
      alt: "无限 UCW",
    },
    title: "UCW's Blog",
    desc: "无限 UCW 的个人博客",
  },
  {
    href: "https://smallfang.fun/",
    img: {
      src: "https://blog.smallfang.fun/image/tx.png",
      width: 853,
      height: 853,
      alt: "smallfang",
    },
    title: "smallfang",
    desc: "摆烂第一人",
  },
  {
    href: "https://www.amzcd.top/",
    img: {
      src: "https://cdn.luogu.com.cn/upload/image_hosting/3enxgywp.png",
      width: 512,
      height: 512,
      alt: "diyanqi",
    },
    title: "Dignite's Blog!",
    desc: "When Nothing Goes Right, Go Left.",
  },
  {
    href: "https://baoshuo.ren/",
    img: {
      src: baoshuoFavicon as StaticImageData,
      alt: "Baoshuo",
    },
    title: "Baoshuo",
    desc: "Even with a heavy past, accept it and continue moving forward.",
  },
];

export default function Links() {
  const ref = useRef<HTMLDivElement>(null);
  useMasonryLayout(ref);

  return (
    <div className="flex flex-wrap py-2" ref={ref}>
      {links.map(({ href, img, title, desc }) => (
        <div
          className="w-full p-2 transition-all duration-75 md:w-1/2 lg:w-1/3 xl:w-1/4"
          key={href}
        >
          <a href={href} target="_blank" rel="noreferrer">
            <div className="overflow-hidden rounded-xl border bg-slate-200 transition-colors duration-100 hover:bg-slate-300 dark:border-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600">
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Image className="w-full bg-white" {...img} />
              <div className="mx-6 my-4">
                <h2 className="text-xl">{title}</h2>
                <p className="mt-3 text-lg">{desc}</p>
              </div>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}
