// import jwt from 'jsonwebtoken';

// const generateToken = (res, userId) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   });

//   // Set JWT as an HTTP-Only cookie
//   res.cookie('jwt', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
//     sameSite: 'strict', // Prevent CSRF attacks
//     maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
//   });
// };

// export default generateToken;

import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Set JWT as an HTTP-Only cookie, 서버에 저장되었다가 로그인 후 every request마다 브라우저로 보내줌
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production(use https://)
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 밀리 second // 30 days
  });
};

export default generateToken;
