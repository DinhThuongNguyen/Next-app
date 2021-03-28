import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import css from "./style.module.scss";
import Link from "next/link";
import BaseLayout from "../../../components/Layouts/BaseLayout/BaseLayout";
import methodApi from "../../../Axios/methodApi";
import BaseContent from "../../../components/Layouts/BaseContent";
import Card from "../../../components/Layouts/Cards/Card";

const loadNews = () => {
  const router = useRouter();
  const [arrCard, setArrCard] = useState([]);
  const { category, number } = router.query;
  useEffect(() => {
    let tag;
    if (category) {
      tag = category.replaceAll("-", " ");
      methodApi
        .get(`/loadData/${tag}/all?page=${number && number}&limit=6`)
        .then((res) => setArrCard(res.arrTag))
        .catch((err) => console.log({ err }));
    }
  }, [router.query]);
  return (
    <BaseLayout title={category && category.replaceAll("-", " ")}>
      <div className={css.category}>
        <BaseContent>
          <div className={css.category__card}>
            {arrCard.length > 0 &&
              arrCard.map((item, idx) => (
                <Card id={item} cls="card_small" tag={category} key={idx} />
              ))}
          </div>
        </BaseContent>
        <div className={css.category__page}>
          <div className={css.category__page__button}>
            <div className={css.category__page__button__control}>
              <Link
                href={`/${
                  category &&
                  category +
                    `/page/` +
                    (number === `1` ? number : parseInt(number) - 1)
                }`}
              >
                <a>Trang trước</a>
              </Link>
              <Link href={`/${category && category + `/page/${number}`}`}>
                <a className={css.category__page__button__control__active}>{number && number}</a>
              </Link>
              {arrCard.length >= 6 && (
                <Link
                  href={`/${category && category}/page/${parseInt(number) + 1}`}
                >
                  <a >{number && parseInt(number) + 1}</a>
                </Link>
              )}
              <Link
                href={`/${category && category}/page/${parseInt(number) + 1}`}
              >
                <a>Trang sau</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default loadNews;