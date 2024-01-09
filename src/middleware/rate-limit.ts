import { rateLimit } from 'express-rate-limit';
import appConfig from "../app-config";

const limiter = rateLimit({
	windowMs: appConfig.rateLimitInterval * 60 * 1000, // 15 minutes
	limit: appConfig.rateLimit, // Limit each IP
    message: `Too many requests, please try again after ${appConfig.rateLimitInterval} minutes.`
});

export default limiter;
