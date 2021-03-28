import React, { useEffect, useRef, useState } from "react";
import methodApi from "../../../Axios/methodApi";
import css from "./style.module.scss";
import Link from "next/link";

const BaseContent = (props) => {
  const [arr, setArr] = useState([]);

  useEffect(() => {
    methodApi
      .get("/loadData/getmostview")
      .then((res) => {
        setArr(res.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={css.baseContent}>
      <div className={css.baseContent__left}>{props.children}</div>
      <div className={css.baseContent__right}>
        <div className={css.baseContent__right__fb}>
          <iframe
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fluongyvohoangyen%2F&tabs=timeline&width=350&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=485441712846003"
            width="350"
            height="600"
            style={{ border: "none", overflow: "hiden" }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
        </div>
        <section className={css.baseContent__right__mostView}>
          <p>Most view</p>
          <ul className={css.baseContent__right__mostView__content}>
            {arr.length > 0 &&
              arr.map((item, idx) => (
                <li key={idx}>
                  <Link href={`/${item.tag}/${item.id}`}>
                    <a>{item.title}</a>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default BaseContent;