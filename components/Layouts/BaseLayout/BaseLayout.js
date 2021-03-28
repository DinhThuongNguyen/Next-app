import React, { useContext, useEffect } from "react";
import Head from "next/head";
import Header from "../../Header_Footer/Headers/Header";
import Footer from "../../Header_Footer/Footers/Footer";
import { AuthContext } from "../../../ContextAPI/Auth-context";
import Axios from "../../../Axios/methodApi";

export default function BaseLayout(props) { 
  const { title, metaDescription, ogUrl, ogImage } = props;
  const auth = useContext(AuthContext);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("account"));
    if (storedData) {
      if (new Date(storedData.timer) > new Date()) {
        const getAccount = async () => {
          const url = `/account/${storedData.vhy}`;
          try {
            const dulieu = await Axios.get(url);
            await auth.login(
              dulieu.id,
              dulieu.role,
              dulieu.name,
              dulieu.avatar,
              new Date(storedData.timer)
            );
          } catch (error) {
            console.log({ error });
          }
        };
        getAccount();
      } else {
        auth.logout();
      }
    }
  }, [auth.login]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" key="description" content={metaDescription} />
        <meta name="title" key="title" content={title} />
        <meta property="og:title" key="og:title" content={title} />
        <meta property="og:locale" key="og:locale" content="vi_VN" />
        <meta
          property="og:url"
          key="og:url"
          content={ogUrl}
        />
        <meta property="og:type" key="og:type" content="website" />
        <meta
          property="og:description"
          key="og:description"
          content={metaDescription}
        />
        <meta
          property="og:image"
          key="og:image"
          content={ogImage}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        {/* <link
          rel="canonical"
          href={`${process.env.BASE_URL}${
            canonicalPath ? canonicalPath : router.asPath
          }`}
        /> */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
          integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2"
          crossOrigin="anonymous"
          // Cross-Origin-Embedder-Policy= "require-corp"
          // Cross-Origin-Opener-Policy= "same-origin"
        />
        <script
          src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
          integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
          crossOrigin="anonymous"
          // Cross-Origin-Embedder-Policy= "require-corp"
          // Cross-Origin-Opener-Policy= "same-origin"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx"
          crossOrigin="anonymous"
          // Cross-Origin-Embedder-Policy= "require-corp"
          // Cross-Origin-Opener-Policy= "same-origin"
        ></script>
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v10.0"
          nonce="hvamrI64"
          crossoriginembedderpolicy="require-corp"
          // Cross-Origin-Opener-Policy= "same-origin"
        ></script>
        {/* <script type="text/javascript" src="js/main.js"></script> */}
      </Head>
      <Header />
      {props.children}
      <Footer />
    </>
  );
}
