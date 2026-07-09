import { User } from '../models/user.model.js';
import { RecentChat } from '../models/recentChat.model.js';
import { AnonymousUsage } from '../models/anonymousUsage.model.js';

export const checkRequestLimit = async (req, res, next) => {
    try {
        if (!req.user) {
            const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            let usage = await AnonymousUsage.findOne({ ipAddress });
            
            if (!usage) {
                usage = await AnonymousUsage.create({ ipAddress, requestCount: 0 });
            }

            if (usage.requestCount >= 5) {
                return res.status(403).json({ 
                    success: false, 
                    error: "Anonymous Limit Reached", 
                    message: "You have used your 5 free trial requests. Please sign up to continue generating and get 15 more free requests!" 
                });
            }

            usage.requestCount += 1;
            await usage.save();
            return next();
        }

        const user = await User.findById(req.user._id).populate({
            path: 'currentSubscription',
            populate: { path: 'plan' }
        });
        
        // Determine if user is a free user
        const isFreeUser = !user.currentSubscription || user.currentSubscription.status !== 'active';
        
        // Determine the anchor date for the billing cycle
        // For Pro users: use the subscription start date
        // For Free users: use their account creation date
        const anchorDate = isFreeUser ? user.createdAt : (user.currentSubscription.startDate || user.createdAt);
        
        // Calculate the start of the current 7-day cycle
        const now = new Date();
        const msPer7Days = 7 * 24 * 60 * 60 * 1000;
        const diffMs = Math.max(0, now.getTime() - new Date(anchorDate).getTime());
        const cyclesPassed = Math.floor(diffMs / msPer7Days);
        
        // This is the exact moment their current 7-day week started
        const currentCycleStart = new Date(new Date(anchorDate).getTime() + (cyclesPassed * msPer7Days));
        
        // Count recent chats since the start of this current cycle
        const chatCount = await RecentChat.countDocuments({
            user: req.user._id,
            createdAt: { $gte: currentCycleStart }
        });
        
        if (isFreeUser) {
            if (chatCount >= 15) {
                return res.status(403).json({ 
                    success: false, 
                    error: "Free Limit Reached", 
                    message: "You have reached your limit of 15 requests for this week. Your limit will reset 7 days from when you created your account." 
                });
            }
        } else {
            // Pro Plan limit dynamically fetched from the plan
            const proLimit = user.currentSubscription.plan?.maxRequestsPerWindow || 300;
            if (chatCount >= proLimit) {
                return res.status(403).json({ 
                    success: false, 
                    error: "Pro Limit Reached", 
                    message: `You have reached your limit of ${proLimit} requests for this billing week.` 
                });
            }
        }
        
        next();
    } catch (error) {
        console.error("Error checking request limit:", error);
        res.status(500).json({ success: false, error: "Failed to check request limit" });
    }
};
