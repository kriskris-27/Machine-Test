import { Router } from 'express';
import { createAgent, getAllAgents, getAgentTasks } from '../controllers/agent.controller';
import { protect } from '../middlewares/auth.middleware';
import { agentValidator, validateRequest } from '../middlewares/validator.middleware';

const router = Router();

// All agent routes are protected (Admin only)
router.use(protect);

router.post('/', agentValidator, validateRequest, createAgent);
router.get('/', getAllAgents);
router.get('/:agentId/tasks', getAgentTasks);

export default router;
