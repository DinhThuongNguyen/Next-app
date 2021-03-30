import React, { useContext, useEffect, memo } from "react";
import css from "./style.module.scss";
import Image from "next/image";
import Link from "next/link";
import { AuthContext } from "../../../ContextAPI/Auth-context";

const Avatar = (props) => {
  const context = useContext(AuthContext);
  const { name, avatar } = props;

  const logout = () => {
    context.fbLogin = false;
    context.ggLogin = false;

    context.logout();
  };

  return (
    <div className={css.avatar}>
      <div className={css.avatar__avt}>
        {avatar && (
          <Image
            src={`${avatar.includes("https") ? avatar : "/" + avatar}`}
            width="50"
            height="50"
            alt="anh dai dien"
          />
        )}
        <span>
          {name && name}
          {context.role === "user" && (
            <ul className={css.avatar__avt__sub}>
              <li>
                <p onClick={logout}>Log out</p>
              </li>
            </ul>
          )}
          {context.role === "admin" && (
            <ul className={css.avatar__avt__sub}>
              <li>
                <p onClick={logout}>Log out</p>
              </li>
              <li>
                <Link href="/editor">
                  <a>Tạo bài mới</a>
                </Link>
              </li>
              <li>
                <Link href="/admin">
                  <a>Quản lý bài viết</a>
                </Link>
              </li>
            </ul>
          )}
        </span>
      </div>
    </div>
  );
};

export default Avatar;
