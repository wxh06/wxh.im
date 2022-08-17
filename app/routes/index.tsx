import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { TwitterFollowButton } from "react-twitter-embed";
import GitHubButton from "react-github-btn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faBilibili,
  faQq,
  faTelegram,
  faTwitch,
  faTwitter,
  faWeibo,
  faYoutube,
  faZhihu,
} from "@fortawesome/free-brands-svg-icons";
import styles from "~/styles/starter-template.css";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export const meta: MetaFunction = () => ({
  title: "汪心禾 | wxh.im",
});

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

function Contact({
  icon,
  platform,
  user,
  link,
}: {
  icon: IconProp;
  platform: string;
  user: string;
  link: string;
}) {
  return (
    <li className="mb-1">
      <FontAwesomeIcon icon={icon} /> {platform}{" "}
      <a href={link} rel="noopener noreferrer" target="_blank">
        {user}
      </a>
    </li>
  );
}

export default function Index() {
  return (
    <div className="col-lg-8 mx-auto p-3 py-md-5">
      <header className="d-flex align-items-center pb-3 mb-5 border-bottom">
        <a
          href="/"
          className="d-flex align-items-center text-dark text-decoration-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="32"
            className="me-2"
            viewBox="0 0 118 94"
            role="img"
          >
            <title>Bootstrap</title>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M24.509 0c-6.733 0-11.715 5.893-11.492 12.284.214 6.14-.064 14.092-2.066 20.577C8.943 39.365 5.547 43.485 0 44.014v5.972c5.547.529 8.943 4.649 10.951 11.153 2.002 6.485 2.28 14.437 2.066 20.577C12.794 88.106 17.776 94 24.51 94H93.5c6.733 0 11.714-5.893 11.491-12.284-.214-6.14.064-14.092 2.066-20.577 2.009-6.504 5.396-10.624 10.943-11.153v-5.972c-5.547-.529-8.934-4.649-10.943-11.153-2.002-6.484-2.28-14.437-2.066-20.577C105.214 5.894 100.233 0 93.5 0H24.508zM80 57.863C80 66.663 73.436 72 62.543 72H44a2 2 0 01-2-2V24a2 2 0 012-2h18.437c9.083 0 15.044 4.92 15.044 12.474 0 5.302-4.01 10.049-9.119 10.88v.277C75.317 46.394 80 51.21 80 57.863zM60.521 28.34H49.948v14.934h8.905c6.884 0 10.68-2.772 10.68-7.727 0-4.643-3.264-7.207-9.012-7.207zM49.948 49.2v16.458H60.91c7.167 0 10.964-2.876 10.964-8.281 0-5.406-3.903-8.178-11.425-8.178H49.948z"
              fill="currentColor"
            ></path>
          </svg>
          <span className="fs-4">Starter template</span>
        </a>
      </header>

      <main>
        <h1>Hey there</h1>
        <p className="fs-5 col-md-8">
          I&apos;m <span lang="zh-Hans">汪心禾</span> (
          <a
            href="https://en.wikipedia.org/wiki/Pinyin"
            hrefLang="en"
            rel="noopener noreferrer"
            target="_blank"
          >
            pinyin
          </a>
          : Wāng Xīnhé), a 16 y.o. student.
        </p>
        <ul className="list-unstyled">
          <li className="bi bi-book">
            {" "}
            Grade 11 at{" "}
            <a
              href="https://www.ghcis.com/"
              hrefLang="zh-Hans-CN"
              rel="noopener noreferrer"
              target="_blank"
            >
              GHCIS
            </a>
          </li>
          <li className="bi bi-geo-alt">
            {" "}
            Shanghai, People&apos;s Republic of China (
            <span lang="zh-Hans">中华人民共和国 上海市</span>)
          </li>
          <li className="bi bi-translate">
            {" "}
            Simplified Chinese (<span lang="zh-Hans">简体中文</span>), English
          </li>
        </ul>

        <GitHubButton
          href="https://github.com/wxh06"
          data-size="large"
          data-text="Follow @wxh06"
          data-show-count
        />
        <TwitterFollowButton screenName="wxh06" options={{ size: "large" }} />

        <hr className="col-3 col-md-2 mb-5" />

        <div className="row g-5">
          <div className="col-md-6">
            <h2>Social Media &amp; Contact Info.</h2>
            <p>You can reach me via:</p>
            <ul className="ps-3">
              <Contact
                icon={faTwitter}
                platform="Twitter"
                user="@wxh06"
                link="https://twitter.com/wxh06"
              />
              <Contact
                icon={faWeibo}
                platform="微博"
                user="@汪心禾"
                link="https://weibo.com/u/5542763526"
              />
              <Contact
                icon={faZhihu}
                platform="知乎"
                user="@汪心禾"
                link="https://www.zhihu.com/people/wangxinhe-2006"
              />
              <Contact
                icon={faYoutube}
                platform="YouTube"
                user="汪心禾"
                link="https://www.youtube.com/channel/UCGTCE1U3QblnN070LFeM_Bw"
              />
              <Contact
                icon={faBilibili}
                platform="哔哩哔哩"
                user="@wxh06"
                link="https://space.bilibili.com/551132744"
              />
              <Contact
                icon={faTwitch}
                platform="Twitch"
                user="@wxh06"
                link="https://www.twitch.tv/wxh06"
              />
              <Contact
                icon={faTelegram}
                platform="Telegram"
                user="@wangxinhe"
                link="https://t.me/wangxinhe"
              />
              <Contact
                icon={faQq}
                platform="QQ"
                user="1659133940"
                link="https://wpa.qq.com/msgrd?uin=1659133940"
              />
              <Contact
                icon={faEnvelope}
                platform="Email:"
                user="wangxinhe06@gmail.com"
                link="mailto:wangxinhe06@gmail.com"
              />
            </ul>
          </div>

          <div className="col-md-6">
            <h2>Programming-related</h2>
            <p>Open Source, Olympiad in Informatics, etc.</p>
            <ul className="icon-list ps-0">
              <li className="d-flex align-items-start mb-1">
                <a
                  href="https://github.com/wxh06"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitHub @wxh06
                </a>
              </li>
              <li className="d-flex align-items-start mb-1">
                <a
                  href="https://gitlab.com/wangxinhe"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitLab @wangxinhe
                </a>
              </li>
              <li className="d-flex align-items-start mb-1">
                <a
                  href="https://gitee.com/wangxinhe"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Gitee @wangxinhe
                </a>
              </li>
              <li className="d-flex align-items-start mb-1">
                <a
                  href="https://www.luogu.com.cn/user/108135"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  洛谷 @wangxinhe
                </a>
              </li>
              <li className="d-flex align-items-start mb-1">
                <a
                  href="https://blog.csdn.net/wangxinhe2006"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  CSDN: wangxinhe2006
                </a>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <footer className="pt-5 my-5 text-muted border-top">
        Created by the Bootstrap team &middot; &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
