/**
 * Rate limiting utility for API calls
 */

class RateLimiter {
  constructor(maxRequests = 60, windowMs = 900000) { // 60 requests per 15 minutes
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  isAllowed() {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    // Check if we're under the limit
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  }

  getRemainingRequests() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    return this.maxRequests - this.requests.length;
  }

  getResetTime() {
    if (this.requests.length === 0) return null;
    return this.requests[0] + this.windowMs;
  }
}

module.exports = RateLimiter;
