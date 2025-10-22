import { Router } from "../Dependencies/dependencias.ts";
import { postBoleteria, getBoleteriaPorEvento } from "../Controller/boletaContoller.ts";

const boleteriaRouter = new Router();
boleteriaRouter
  .get("/boleteria/:id_evento", getBoleteriaPorEvento)
  .post("/boleteria", postBoleteria);

export { boleteriaRouter };
