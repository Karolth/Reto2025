import { Router } from "../Dependencies/dependencias.ts";
import { postLocalidad, getLocalidades } from "../Controller/localidadController.ts";

const localidadRouter = new Router();
localidadRouter
  .get("/localidades", getLocalidades)
  .post("/localidades", postLocalidad);

export { localidadRouter };
