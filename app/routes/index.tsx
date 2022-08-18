import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { TwitterFollowButton, TwitterTimelineEmbed } from "react-twitter-embed";
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
    <main>
      <div className="row">
        <div className="col-md-8">
          <h1>Hey there</h1>
          <p className="fs-5">
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
        </div>

        <div className="col">
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="wxh06"
            options={{ height: "20em" }}
          />
        </div>
      </div>

      <hr className="col-3 col-md-2 mb-5" />

      <div className="row">
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
            {/* <Contact
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
            /> */}
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
  );
}
