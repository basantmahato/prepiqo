import { User } from '../models/user.model.js';
import { Plan } from '../models/plan.model.js';
import { Subscription } from '../models/subscription.model.js';

// @desc    Get all users (with pagination)
// @route   GET /api/v1/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const total = await User.countDocuments();
    const users = await User.find()
      .select('-password')
      .populate({ path: 'currentSubscription', populate: { path: 'plan' } })
      .skip(startIndex)
      .limit(limit)
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Get all plans
// @route   GET /api/v1/admin/plans
// @access  Private/Admin
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort('priceMonthly');
    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching plans' });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/v1/admin/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments({ status: 'active' });
    
    // Calculate total revenue, etc. if needed
    // For now, return basic stats
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeSubscriptions: totalSubscriptions,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};

// @desc    Update a user
// @route   PUT /api/v1/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('currentSubscription');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    
    // Handle manual plan override
    if (req.body.planId !== undefined) {
      if (req.body.planId === 'free') {
        user.currentSubscription = null;
      } else {
        const plan = await Plan.findById(req.body.planId);
        if (plan) {
          // Create a manual subscription that doesn't rely on razorpay
          const endDate = new Date();
          endDate.setFullYear(endDate.getFullYear() + 10); // 10 years access for manual admin assignment
          
          const subscription = await Subscription.create({
            user: user._id,
            plan: plan._id,
            status: 'active',
            startDate: new Date(),
            endDate: endDate,
            provider: 'razorpay',
            providerSubscriptionId: 'manual_admin_override_' + Date.now()
          });
          
          user.currentSubscription = subscription._id;
        }
      }
    }
    
    const updatedUser = await user.save();
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating user' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

// @desc    Create a plan
// @route   POST /api/v1/admin/plans
// @access  Private/Admin
export const createPlan = async (req, res) => {
  try {
    const { name, price, currency, maxRequestsPerWindow, features } = req.body;
    const plan = await Plan.create({
      name,
      price,
      currency,
      maxRequestsPerWindow,
      features
    });
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating plan' });
  }
};

// @desc    Update a plan
// @route   PUT /api/v1/admin/plans/:id
// @access  Private/Admin
export const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating plan' });
  }
};

// @desc    Delete a plan
// @route   DELETE /api/v1/admin/plans/:id
// @access  Private/Admin
export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    await plan.deleteOne();
    res.status(200).json({ success: true, message: 'Plan deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting plan' });
  }
};
