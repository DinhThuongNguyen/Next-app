module.exports = {
  env: {
    MONGODB_URL: process.env.MONGODB_URL,
    NEXTAUTH_URL:process.env.NEXTAUTH_URL
  },
  images: {
    domains: [
      "lh6.googleusercontent.com",
      "lh5.googleusercontent.com",
      "lh3.googleusercontent.com",
      "lh4.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
      "1.bp.blogspot.com",
      "nguoiphattu.com",
      "www.bookofjoe.com",
      '3.bp.blogspot.com',
      '4.bp.blogspot.com',
      'lh4.ggpht.com',
      '2.bp.blogspot.com',
      "res.cloudinary.com",
      "hungantu.com"
    ],
  },
  // async headers() {
  //   return [
  //     {
  //       // matching all API routes
  //       source: "/api/:path*",
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         { key: "Access-Control-Allow-Origin", value: "*" },
  //         { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
  //         { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
  //       ]
  //     }
  //   ]
  // }
};
