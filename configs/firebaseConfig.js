// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
require("dotenv").config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key:
    process.env.FIREBASE_PRIVATE_KEY ||
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDNKoKXOQrxbxiL\nWe3GacgE1mSRrOALhmnD7arytkzSIzeo6IB5tcs84PyKfoV5vU4X/UtNEUeTT8zv\nktNZ+C9/nQMHoBDOizrTa/QyMvggE9g4Gce+aoP2XkKs+a/mt9OJ2ICaw+yNd2eR\n3uYFf0hcOiPv5adEBc2AavdgjW+DtsU6QLhBt5hCW8agxJWnubL/xYBHpMH4ESqk\nir3TThwZdF+2B4Ti54w0DyAek22bm9S4YYK+dbfUCeRBFJAD6qPvx6bDTJ0ZFznP\nY6v442KZmHeKelm0xeiJydz2r4N4CjwFfQ61MWP277WDBehDEwFkaXgryYVA4wV/\n4y6Ta5yNAgMBAAECggEAQSPmIq1x1AY5/MSowf6EC0Um2TnSSNZ8bkDfrgBDk9Sq\nr25inEIkLUgh5rcVGfoI+YTqi6WY3CTSJJ6xjDdInXP0qk8gBvQd0VLNTcLxFP44\nAFfvG34mN+rlsJX2S4LCH1omOv1J9gCbWa0zyzsGdoHfNyPrX6WYAdX0hSti5KZp\nDxi7rVh/AnES2g+R5/nwGPDYAhgY1pINe2YJPUCf5KfH/SehNL70ZwMG618jVTnd\nielOyt8Fsn898Fb0XCME716AdV6HIYoWB8+bZnW1AaSqUctUbqrt1XjPu9nwUCUs\n/B62idtZUD0//Pr9mby7c05Jdzzp6VtwCS21KRNj4QKBgQD6XA39Ip+kBFmeGhsT\nEmTRqdXdn9mM/4Z2cu2YAgVgHghueHJ5IRm4jYNI3dYMDKiDCVsI+ZxGLOZV/D8g\nvFP7ryWkOO+1qu98sF090LPtG8aN4rniVqC3cNnjuzyzOyGczQmwLsDK7/+dmrWi\nmRXnypZyTxP1Lacdjofoyg5xMwKBgQDRyc1rOZ3a6UO95QVKY5SPNwT7TI3BJIBq\n/3kRTg/6nPBdDVv6+J/AFtrNVPDGMS/p/0E51y7eZHH+eh6BczKlRTdrUGdhRyob\nMN5uR3hyWZRZYpbBpy76kNWILzkvMO6QDB1QcY0A0ee5feGDg6xUKZmVS8BG3oLz\nZs3CgR07PwKBgQD0bkXWHCTCrOCWRKSkZTP7o5ZDT9rGF4A/Swv/ehGnewr+WChj\nbNbA4aEI1lUx5HXtoYe45oMV3KZx0toLavOP6buVb2VR9/bjxQjz3jycxZ6ATpjv\ni2ZUUyDYf6jO0G+LuH+5/JuMRu9I/5BQlKfXa2qhZeV1XcIoUE0PEZ8yEwKBgQCw\nTu8qnCOEJOJfpyfJGuNxcQXoxK+lkK20PrxaxMY9EsQXD/ErfOOVJiAAzNAFYLUp\n7PG+UI/9K2F6Qtt8Y3o+12r573rSkGJcs7db6wjY4VwBuw+D9KNQxYQPjdB7Tp5P\nxT6lqqib9czPYXGze2fK26NNi3oulTZspQtr2eLdNQKBgDbTbSvPs0pGdgAVA8/U\nl+Kr4jNNeowfD0iTl8WyRjfFPkELf1rxhH2vh9U//355/HZgyzuGXlDq+KJHzTFo\nPFEqD5vGCG5ASxUnODlpVIah1P7pxFIbb5msnNWdyA8ziDZwzkQQl/OSHUmAlMQt\nQRyNJLMEPQ+5T698Kq0xQD/Y\n-----END PRIVATE KEY-----\n",
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = firebaseConfig;
