import React from 'react';
import css from "./nav.module.scss";
import NavItems from './NavItems/NavItems';

const Nav = (props) => {
  const {showMobile, clickShow} = props;
  return (
    <>
      <nav className={css.nav__desktop}>
        <NavItems/>
      </nav>

        <nav className={`${showMobile ? css.nav__mobile : css.nav__mobileHden}`}>
          <NavItems showMobile={showMobile} clickShow={clickShow}/>
        </nav>
    </>
  )
}

export default Nav;