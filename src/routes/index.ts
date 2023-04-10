import { Router } from "express";
import routes from "./heatingSystem.routtes";

const router = Router();

router.use(
  routes,
);

export default router;