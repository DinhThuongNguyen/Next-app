import React from 'react';
import css from "./style.module.scss";

function TextError (props) {
  return <p className={css.error}>{props.children}</p>
}

export default TextError