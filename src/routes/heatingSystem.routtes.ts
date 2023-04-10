import { Router } from "express";
import { HeatingSystemController } from "../controllers/heatingSystem.controller";

const ctrl = new HeatingSystemController();

const router = Router({
  mergeParams: true
});

const routes = {
  setTemp: "/set-temp",
};

router.post(
    routes.setTemp,
    ctrl.setRoomTemperature()
);

export default router;