import { Router } from "express";
import { 
    getAllApplications,
    getApplicationById,
    updateApplication,
    deleteApplication,
    createApplication
} from "../controllers/applications.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

//Todas las rutas requieren de JWT
router.use(authenticateToken)

router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
