import React, { useEffect, useState } from "react";
import methodApi from "../../../../Axios/methodApi";
import css from "./style.module.scss";
import Image from "next/image";
import Link from "next/link";

const Card = (props) => {
  const { id, cls, tag } = props;
  const [classes, setClasses] = useState("");
  const [dulieu, setDulieu] = useState({
    title: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await methodApi.get(`/loadData/blog/${id}`);
      if(res.result){
       setDulieu({
         title: res.result.title,
         description: res.result.description,
         image: res.result.images.length > 0 ? res.result.images[0].value : "Images/DSCF0311.JPG",
        });
      }
    }
    
    const setClass = () => {
      switch (cls) {
        case "card_big":
          setClasses(css.card_big);
          break;
        case "card_small":
          setClasses(css.card_small);
          break;
  
        default:
          break;
      }
    }

    if (id) {
      const fetch = setTimeout(() => {
        setClass();
        fetchData();
      }, 0);
      return ()=>{
        clearTimeout(fetch)
      }
   }
  }, [id]);

  return (
    <div className={classes}>
      {classes === "style_card_big__3UiyB" ? (
        <div className={css.card}>
          <Link href={`/${tag}/${id}`}>
            <a>
              <Image
                src={dulieu.image.includes(".com") ? dulieu.image : `/${dulieu.image}`}
                alt="big"
                layout="fill"
              />
              <span>{dulieu.title}</span>
              <h5>{dulieu.description}</h5>
            </a>
          </Link>
          
        </div>
      ) : <div className={css.card}>
      <Link href={`/${tag}/${id}`}>
        <a>
          <Image
            src={dulieu.image.includes("com") ? dulieu.image : `/${dulieu.image}`}
            alt="big"
            layout="fill"
          />
          <span>{dulieu.title}</span>
          <h5>{dulieu.description}</h5>
        </a>
      </Link>
      
    </div>}
    </div>
  );
};

export default Card;
