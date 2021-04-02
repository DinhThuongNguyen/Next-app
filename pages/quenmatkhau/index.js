import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import BaseLayout from "../../components/Layouts/BaseLayout/BaseLayout";
import { AuthContext } from "../../ContextAPI/Auth-context";
import css from "./style.module.scss";
import Axios from "../../Axios/methodApi";
import {useRouter} from "next/router"

const index = () => {
  const auth = useContext(AuthContext);
  const route = useRouter();
  const [showTaskPassword, setShowTaskPassword] = useState(false);
  const [textError, setTextError] = useState({
    email: "",
    matkhau: ""
  });

  const [value, setValue] = useState ({
    dataCheck: "",
    password: "",
    confirmPassword: "",
  });

  const handleChangeValue = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const checkEmail = () => {
    const valueData = JSON.stringify({
      dataCheck: value.dataCheck
    });
    Axios.post("/account/checkAccount", valueData)
                    .then(res => {
                      if(res.message === "yes"){
                        setTextError({
                          ...textError,
                          email: ""
                        });
                        setShowTaskPassword(true)
                      } else {
                        setTextError({
                          ...textError,
                          email: "Tài khoản không đúng, hãy nhập lại "
                        });
                        setShowTaskPassword(false)
                      }
                    }).catch(err => {
                      setShowTaskPassword(false);
                    })
  };

  const changePassword = () => {
    if(value.password === value.confirmPassword){
      const data = {
        dataCheck: value.dataCheck,
        password: value.password
      };
      Axios.patch("/account/updatePassword", data)
      .then(async res => {
        await auth.login(res.accountId, res.role, res.name, res.avatar);
        await route.push("/")
        setTextError({
          ...textError,
          matkhau: ""
        });
      }).catch(err => {
        console.log({err});
      })
      
    } else {
      setTextError({
        ...textError,
        matkhau: "Mật khẩu không trùng nhau, hãy nhập lại"
      })
    }
  }

  return (
    <BaseLayout title="Quên mật khẩu">
      <div className={css.layout}>
        <div className={css.layout__content}>
          <h3>Quên mật khẩu</h3>
          <div className={css.layout__content__form}>
            <div className={css.layout__content__form__item}>
              <label htmlFor="dataCheck">Email or name account</label>
              <input type="text" name="dataCheck" value={value.dataCheck} disabled={showTaskPassword} onChange={handleChangeValue} placeholder="Nhập email hoặc tên tài khoản"/>
            </div>
            {textError.email.length > 0 && <p>{textError.email}</p>}
            {!showTaskPassword && <div className={css.layout__content__form__control}>
                <button onClick={checkEmail}>Check account</button>
              </div>}
            {showTaskPassword && <div className={css.layout__content__form__item}>
              <label htmlFor="password">Mật khẩu</label>
              <input type="password" name="password" value={value.password} onChange={handleChangeValue}/>
            </div>}
            {showTaskPassword && <div className={css.layout__content__form__item}>
              <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
              <input type="password" name="confirmPassword" value={value.confirmPassword} onChange={handleChangeValue}/>
            </div>}
            {textError.matkhau.length > 0 && <p>{textError.matkhau}</p>}
            {showTaskPassword && <div className={css.layout__content__form__control}>
                <button onClick={changePassword}>Đặt lại mật khẩu</button>
              </div>}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default index; 