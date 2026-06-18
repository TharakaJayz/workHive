// import rateLimit from 'express-rate-limit'

// export const rateLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,  // 15 minutes
//   max:      100,              // limit each IP to 100 requests per window
//   standardHeaders: true,      // return rate limit info in RateLimit-* headers
//   legacyHeaders:   false,

//   // Returns the consistent error shape used everywhere in the app
//   handler: (_req, res) => {
//     res.status(429).json({
//       success: false,
//       error: {
//         code:    'RATE_LIMIT_EXCEEDED',
//         message: 'Too many requests. Please wait 15 minutes and try again.',
//       },
//     })
//   },
// })