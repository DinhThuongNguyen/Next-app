import React, { useEffect, useState } from "react";
import methodApi from "../../../Axios/methodApi";
import css from "./style.module.scss";
import Link from "next/link";
import Card from "./Card";

export const Cards = (props) => {
  const [classes, setClasses] = useState("");
  const [tags, setTags] = useState([]);
  const { cls, loaitin, arr } = props;
  useEffect(() => {
    switch (cls) {
      case "h1_c3":
        setClasses(css.h1_c3);
        break;
      case "h2_c2":
        setClasses(css.h2_c2);
        break;
      case "h1_c2":
        setClasses(css.h1_c2);
        break;

      default:
        break;
    }
  }, [cls]);

  useEffect(() => {
    if (cls == "h2_c2") {
      methodApi.get(`loadData/${loaitin}/all?page=1&limit=7`).then((res) => {
        let m = [];
        res.arrTag.map((item) => {
          if (arr.includes(item) === false) {
            m.push(item);
          }
        });

        setTags(m.slice(0, 4));
      });
    }
  }, [arr]);

  return (
    <div className={classes}>
      {classes === css.h2_c2 && (
        <p>
          <Link href={`/${loaitin.replaceAll(" ", "-")}/page/1`}>
            <a>Load more</a>
          </Link>
        </p>
      )}
      {classes === css.h2_c2 ? (
        <div className={css.h2_c2__content}>
          <div className={css.h2_c2__content__desktop}>
            {tags.length > 0 &&
              tags.map((item, idx) => (
                <Card id={item} cls="card_small" tag={loaitin} key={idx} />
              ))}
          </div>
          <div className={css.h2_c2__content__mobile}>
            {tags.length > 0 &&
              tags.map((item, idx) => (
                idx <= 1 && <Card id={item} cls="card_small" tag={loaitin} key={idx} />
              ))}
          </div>
        </div>
      ) : (
        props.children
      )}
    </div>
  );
};
