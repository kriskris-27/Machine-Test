import { Router } from 'express';
import { createAgent, getAllAgents, getAgentTasks, deleteAgent } from '../controllers/agent.controller';
import { protect } from '../middlewares/auth.middleware';
import { agentValidator, validateRequest } from '../middlewares/validator.middleware';

const router = Router();

// Public route for Agent Portal
router.get('/:agentId/tasks', getAgentTasks);

// All other agent routes are protected (Admin only)
router.use(protect);

router.post('/', agentValidator, validateRequest, createAgent);
router.get('/', getAllAgents);
router.delete('/:id', deleteAgent);

export default router;
