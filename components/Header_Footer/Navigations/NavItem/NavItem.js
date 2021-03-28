import React, { useState } from "react";
import css from "./style.module.scss";
import Link from "next/link";

const NavItem = (props) => {
  const { name, chil, children, url, showMobile, page } = props;
  const [show, setShow] = useState(false);

  const click = () => {
    setShow(!show);
  };
  return !showMobile ? (
    <li className={css.navItem}>
      <div className={css.navItem__control}>
        {url ? (
          <Link href={url}>
            <a onClick={() => setShow(true)}>{name}</a>
          </Link>
        ) : (
          <span>{name}</span>
        )}
        {chil && (
          <>
            {show ? (
              <button onClick={click}>-</button>
            ) : (
              <button onClick={click}>+</button>
            )}
          </>
        )}
      </div>
      {chil && children}
    </li>
  ) : (
    <li className={css.navItem} onClick={click}>
      <div className={css.navItem__control}>
      {url ? (
          <Link href={url}>
            <a onClick={() => setShow(true)}>{name}</a>
          </Link>
        ) : (
          <span>{name}</span>
        )}
        {chil && (
          <>
            {show ? (
              <button onClick={click}>-</button>
            ) : (
              <button onClick={click}>+</button>
            )}
          </>
        )}
      </div>
      <div
        className={`${show ? css.navItem__mobile : ""} ${
          show ? "animate__animated animate__fadeInLeft" : ""
        }`}
      >
        {show && children}
      </div>
    </li>
  );
};

export default NavItem;