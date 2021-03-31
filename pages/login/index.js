import React, { useContext, useEffect, useState } from "react";
import css from "./style.module.scss";
import BaseLayout from "../../components/Layouts/BaseLayout/BaseLayout";
import { Form, Formik } from "formik";
import { object, string } from "yup";
import FormikControls from "../../components/FormikForm/FormControls";
import Axios from "../../Axios/methodApi";
import { signIn } from "next-auth/client";
import { AuthContext } from "../../ContextAPI/Auth-context";
import { useRouter } from "next/router";
import Link from "next/link";

const index = () => {
  const context = useContext(AuthContext);
  const [textError, setTextError] = useState();
  const route = useRouter();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = object({
    email: string().required("Hãy nhập thông tin"),
    password: string().required("Chưa nhập mật khẩu"),
  });

  const onSubmit = (values) => {
    const dataLogin = {
      email: values.email,
      password: values.password,
    };

    try {
      Axios.post("/account/login", JSON.stringify(dataLogin))
      .then(res => {
        context.login(
          res.accountId,
          res.role,
          res.name,
          res.avatar
        );
        setTextError("");
        route.push("/");
      })
      .catch(err => {
        console.log({err});
      })
    } catch (error) {
      console.log(error);
    }
  };

  const loginWithGoogle_ = () => {
    localStorage.setItem("flagData", "yes")
    signIn("google", {
      callbackUrl: `${process.env.NEXTAUTH_URL}api/auth/callback/google`,
    });
  };
  const loginWithFacebook = () => {
    route.push("/api/authfb/facebook");
  };

  return (
    <BaseLayout title="Đăng nhập tài khoản">
      <div className={css.signup}>
        <div className={css.signup__content}>
          <h4>Đăng nhập</h4>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => {
              return (
                <Form>
                  <FormikControls
                    control="input"
                    type="text"
                    label="Tên đăng nhập"
                    name="email"
                    placeholder="Nhập email hoặc tên tài khoản"
                  />
                  <FormikControls
                    control="input"
                    type="password"
                    label="Mật khẩu"
                    name="password"
                    placeholder="Nhập mật khẩu"
                  />
                  {textError && (
                    <p
                      style={{
                        color: "red",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      {textError}
                    </p>
                  )}
                  {textError === "sai mật khẩu" && (
                    <p
                      style={{
                        color: "black",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      Nếu bạn quên mật khẩu, hãy{" "}
                      <Link href="/quenmatkhau">
                        <a style={{ color: "blue" }}>tạo mật khẩu mới !</a>
                      </Link>
                    </p>
                  )}
                  <div className={css.btnSubmit}>
                    <button
                      type="submit"
                      disabled={!formik.isValid}
                      className={css.buttonControl}
                      className="mx-auto"
                    >
                      Đăng nhập
                    </button>
                  </div>
                  {formik.isSubmitting && (
                    <div className={css.loaded}>
                      <div className={css.sk__chase}>
                        <div className={css.sk__chase__dot}></div>
                        <div className={css.sk__chase__dot}></div>
                        <div className={css.sk__chase__dot}></div>
                        <div className={css.sk__chase__dot}></div>
                        <div className={css.sk__chase__dot}></div>
                        <div className={css.sk__chase__dot}></div>
                      </div>
                    </div>
                  )}
                </Form>
              );
            }}
          </Formik>

          <div className={css.signup__content__loginWithFbGg}>
            <div className={css.signup__content__loginWithFbGg__google}>
              <button className="btn btn-primary" onClick={loginWithGoogle_}>
                Login with Google
              </button>
            </div>
            <div className={css.signup__content__loginWithFbGg__facebook}>
              <button
                className="btn btn-success"
                onClick={loginWithFacebook}
                disabled={true}
              >
                Login with Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default index;
