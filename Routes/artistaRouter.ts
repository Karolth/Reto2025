import { Router } from "../Dependencies/dependencias.ts";
import { postArtista, getArtistas } from "../Controller/artistaController.ts";

const artistaRouter = new Router();
artistaRouter
  .get("/artistas", getArtistas)
  .post("/artistas", postArtista);

export { artistaRouter };
