import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import dbConnect from '../../../util/dbConnect';
import dbAccount from "../../../models/account";

dbConnect();
export default NextAuth({
  // Configure one or more authentication providers
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
      if(user.email){
        const kq = await dbAccount.findOne({email: user.email});
        if(!kq) {
          const newAccount = await dbAccount({
            email: user.email,
            name: user.name,
            avatar: user.picture,
            password: "no password",
            genre: "khong biet",
            phone: "0000000000000000",
            posts: []
          })
          await newAccount.save();
        }
      }
      return true;
    },
    async redirect(url, baseUrl) {
      return baseUrl
    },
    async session(session, user) {
      return session;
    },
    async jwt(token, user, account, profile, isNewUser) {
      return token
    },
},
})