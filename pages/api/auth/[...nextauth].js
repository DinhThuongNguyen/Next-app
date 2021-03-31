import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import dbConnect from '../../../util/dbConnect';
import dbAccount from "../../../models/account";

dbConnect();
export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    }),
    Providers.Facebook({
      clientId: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {
      console.log(user);
      if(user.email){
        const kq = await dbAccount.findOne({email: user.email});
        if(kq === null) {
          const newAccount = await dbAccount({
            email: user.email,
            name: user.name,
            avatar: user.image,
            password: "no password",
            genre: "khong biet",
            phone: "0000000000000000",
            posts: []
          });
          await newAccount.save();
        }
      }
      return true;
    },
    redirect(url, baseUrl) {
      return baseUrl
    },
    session(session, user) {
      return session;
    },
    jwt(token, user, account, profile, isNewUser) {
      return token
    },
},
})