import React from 'react';
import css from "./style.module.scss";

const SubMenu = (props) => {
  return (
    <ul className={css.subMenu}>
      {props.children}
    </ul>
  )
}

export default SubMenu
