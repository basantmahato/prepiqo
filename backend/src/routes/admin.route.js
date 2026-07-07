import express from 'express';
import { 
  getUsers, updateUser, deleteUser,
  getPlans, createPlan, updatePlan, deletePlan,
  getDashboardStats 
} from '../controllers/admin.controller.js';
import { protect, authorizeAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes below use protect and authorizeAdmin middleware
router.use(protect);
router.use(authorizeAdmin);

router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

router.route('/plans')
  .get(getPlans)
  .post(createPlan);

router.route('/plans/:id')
  .put(updatePlan)
  .delete(deletePlan);

router.route('/dashboard-stats').get(getDashboardStats);

export default router;
