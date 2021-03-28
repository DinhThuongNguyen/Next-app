import React, {  useContext, useEffect, useState } from "react";
import css from "./style.module.scss";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Nav from "../Navigations/Nav";
import Avatar from "../../Layouts/Avatar/Avatar";
import { AuthContext } from "../../../ContextAPI/Auth-context";

const Header = () => {
  const context = useContext(AuthContext);
  const [account, setAccount] = useState();
  const [showIcon, setShowIcon] = useState(false);
  const [textFind, setTextFind] = useState("");
  const date = new Date();
  const clickShow = () => {
    setShowIcon(!showIcon)
  }
  useEffect(() => {
    if(context.accountId) {
      setAccount(<Avatar name={context.name} avatar={context.avatar} />);
    } else {
      setAccount(null);
    }
  }, [context])
  
  

  return (
    <>
      <header className={css.headerContainer} id="top">
        <div className={css.headerContainer__TOP}>
          <div className={css.headerContainer__TOP__content}>
            <div className={css.headerContainer__TOP__content__textDATE}>
              {`${date.getHours() < 10 ? `0${date.getHours().toString()}` : `${date.getHours()}`}:${date.getMinutes() < 10 ? `0${date.getMinutes().toString()}`: date.getMinutes()} Ngày ${date.getDate()} tháng ${date.getMonth() + 1} năm ${date.getFullYear()}.`}
            </div>
            <div className={css.headerContainer__TOP__content__textAUTH}>
              <div className={css.headerContainer__TOP__content__textAUTH__find}>
                <input type="text" placeholder="Tìm kiếm" value={textFind} name="textFind" onChange={(e) => setTextFind(e.target.value)}/>
                <button><FaSearch/></button>
              </div>
              {
                account ? account :
                <div className={css.headerContainer__TOP__content__textAUTH__url}>
                <Link href="/login">
                  <a >LOG IN</a>
                </Link>
                <span style={{marginLeft: "5px", marginRight: "5px"}}>|</span>
                <Link href="/signup">
                  <a>SIGN UP</a>
                </Link>
              </div>
              }
            </div>
          </div>
        </div>
        <div className={css.headerContainer__MIDDLE}>
          <div className={css.headerContainer__MIDDLE__content}>
            <div className={css.headerContainer__MIDDLE__content__logo}>
              <Link href="/">
                <a >
                  <Image src="/vhylogo.png" width="350" height="80" alt="logo"/>
                </a>
              </Link>
            </div>
            <div className={css.headerContainer__MIDDLE__content__showMobile}>
              <button onClick={clickShow}>
                {
                  showIcon ? <IoClose/> : <FaBars/>
                }
              </button>
            </div>
          </div>
        </div>
        <div className={`${showIcon ? css.headerContainer__BOTTOMmobile : css.headerContainer__BOTTOM } ${showIcon ? 'animate__animated animate__slideInDown' : ''}`}>
          <div className={css.headerContainer__BOTTOM__content}>
            <Nav  showMobile={showIcon} clickShow={clickShow}/>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;