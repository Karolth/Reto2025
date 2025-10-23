import { Router } from "../Dependencies/dependencias.ts";
import {
  consultarEventosDisponibles,
  obtenerDetalleEvento,
  listarDepartamentos,
  listarMunicipios,
  listarLugaresPorMunicipio,
} from "../Controller/consultaController.ts";

const consultaRouter = new Router();

consultaRouter
  .get("/consulta/eventos", consultarEventosDisponibles)          // RF7: Consultar eventos (público, con filtros)
  .get("/consulta/eventos/:id", obtenerDetalleEvento)             // RF7: Detalle de evento (público)
  .get("/consulta/departamentos", listarDepartamentos)            // Listar departamentos (público)
  .get("/consulta/municipios", listarMunicipios)                  // Listar municipios (público)
  .get("/consulta/municipios/:id/lugares", listarLugaresPorMunicipio); // Listar lugares (público)

export { consultaRouter };
