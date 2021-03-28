import "../styles/globals.css";
import "../styles/globals.scss";
import { AuthContext } from "../ContextAPI/Auth-context";
import { UseAuth } from "../ContextAPI/customHook/UseAuth";
import { Provider } from "next-auth/client";

function MyApp({ Component, pageProps }) {
  const { valueAccount, login, logout, update, getIdBlog } = UseAuth();

  return (
    <AuthContext.Provider
      value={{
        accountId: valueAccount.accountId,
        name: valueAccount.name,
        avatar: valueAccount.avatar,
        role: valueAccount.role,
        login: login,
        logout: logout,
        update: update,
        getIdBlog: getIdBlog,
        idBlog: valueAccount.idBlog,
        idUpdate: valueAccount.idUpdate,
        TTupdate: valueAccount.TTupdate,
      }}
    >
      <Provider
        options={{
          clientMaxAge: 0,
          
          keepAlive: 0,
        }}
        session={pageProps.session}
      >
        <Component {...pageProps} />
      </Provider>
    </AuthContext.Provider>
  );
}

export default MyApp;