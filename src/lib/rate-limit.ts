/**
 * In-Memory Rate Limiter Abstraction.
 * Designed to be swapped with Upstash Redis or similar later for multi-node deployments.
 */
type RateLimitConfig = {
  maxRequests: number;
  windowMs: number;
};

class RateLimiter {
  // Store format: map of identifier -> { count, expiresAt }
  private store = new Map<string, { count: number; expiresAt: number }>();

  /**
   * Applies standard rate limiting based on identifier (IP or Email).
   */
  async limit(identifier: string, config: RateLimitConfig): Promise<{ success: boolean; limitExceeded: boolean }> {
    const now = Date.now();
    const record = this.store.get(identifier);

    if (!record || record.expiresAt < now) {
      this.store.set(identifier, { count: 1, expiresAt: now + config.windowMs });
      return { success: true, limitExceeded: false };
    }

    if (record.count >= config.maxRequests) {
      return { success: false, limitExceeded: true };
    }

    record.count++;
    return { success: true, limitExceeded: false };
  }

  /**
   * Tracks failed login attempts to lock out accounts after 5 failures for 15 minutes.
   */
  async recordFailedLogin(email: string): Promise<{ locked: boolean }> {
    const identifier = `lockout:${email.toLowerCase()}`;
    const now = Date.now();
    const record = this.store.get(identifier);

    if (record && record.expiresAt > now) {
      if (record.count >= 5) {
        return { locked: true };
      }
      record.count++;
      if (record.count >= 5) {
        // Lock for 15 minutes from now
        record.expiresAt = now + 15 * 60 * 1000;
        return { locked: true };
      }
      return { locked: false };
    }

    // First failed attempt, track for 15 minutes window
    this.store.set(identifier, { count: 1, expiresAt: now + 15 * 60 * 1000 });
    return { locked: false };
  }

  /**
   * Checks if an account is currently locked without incrementing the counter.
   */
  async checkLockout(email: string): Promise<boolean> {
    const identifier = `lockout:${email.toLowerCase()}`;
    const record = this.store.get(identifier);
    if (record && record.expiresAt > Date.now() && record.count >= 5) {
      return true;
    }
    return false;
  }

  /**
   * Resets the lockout counter after a successful login.
   */
  async resetLoginLockout(email: string): Promise<void> {
    this.store.delete(`lockout:${email.toLowerCase()}`);
  }
}

export const rateLimiter = new RateLimiter();
