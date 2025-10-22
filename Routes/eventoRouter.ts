import { Router } from "../Dependencies/dependencias.ts";
import {
  getEventos,
  getEventoPorId,
  getEventosPorFecha,
  getEventosPorMunicipio,
  getEventosPorDepartamento,
  postEvento,
  putEvento,
  deleteEvento,
} from "../Controller/eventoController.ts";

const eventoRouter = new Router();

// Rutas para eventos
eventoRouter.get("/eventos", getEventos);
eventoRouter.get("/eventos/:id", getEventoPorId);
eventoRouter.get("/eventos/buscar/fecha", getEventosPorFecha);
eventoRouter.get("/eventos/buscar/municipio", getEventosPorMunicipio);
eventoRouter.get("/eventos/buscar/departamento", getEventosPorDepartamento);
eventoRouter.post("/eventos", postEvento);
eventoRouter.put("/eventos/:id", putEvento);
eventoRouter.delete("/eventos/:id", deleteEvento);

export { eventoRouter };