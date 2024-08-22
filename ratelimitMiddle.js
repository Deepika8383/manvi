const rateLimit = (limit, interval) => {
    let requestCount = 0;
    let resetTime = Date.now() + interval;
  
    return (req, res, next) => {
      const currentTime = Date.now();
  
      if (currentTime > resetTime) {
        resetTime = currentTime + interval;
        requestCount = 0;
      }
  
      if (requestCount >= limit) {
        return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
      }
  
      requestCount++;
      next();
    };
};
  
module.exports = rateLimit;
  