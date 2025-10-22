import { Context } from "../Dependencies/dependencias.ts";
import { Evento } from "../Models/eventoModel.ts";

// GET - Listar todos los eventos
export const getEventos = async (ctx: Context) => {
  const { response } = ctx;
  try {
    const objListarEventos = new Evento();
    const ListarEventos = await objListarEventos.seleccionarEventos();
    response.status = 200;
    response.body = { success: true, data: ListarEventos };
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al listar eventos", errors: error };
  }
};

// GET - Obtener evento por ID
export const getEventoPorId = async (ctx: any) => {
  const { response, params } = ctx;
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      response.status = 400;
      response.body = { success: false, message: "ID de evento inválido" };
      return;
    }

    const objEvento = new Evento(null, id);
    const evento = await objEvento.seleccionarEventoPorId();

    if (evento) {
      response.status = 200;
      response.body = { success: true, data: evento };
    } else {
      response.status = 404;
      response.body = { success: false, message: "Evento no encontrado" };
    }
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al obtener el evento", errors: error };
  }
};

// GET - Buscar eventos por fecha
export const getEventosPorFecha = async (ctx: Context) => {
  const { response, request } = ctx;
  try {
    const url = new URL(request.url);
    const fecha = url.searchParams.get("fecha");

    if (!fecha) {
      response.status = 400;
      response.body = { success: false, message: "Debe proporcionar una fecha" };
      return;
    }

    const objEvento = new Evento();
    const eventos = await objEvento.seleccionarEventosPorFecha(fecha);
    response.status = 200;
    response.body = { success: true, data: eventos };
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al buscar eventos por fecha", errors: error };
  }
};

// GET - Buscar eventos por municipio
export const getEventosPorMunicipio = async (ctx: Context) => {
  const { response, request } = ctx;
  try {
    const url = new URL(request.url);
    const municipio = url.searchParams.get("municipio");

    if (!municipio) {
      response.status = 400;
      response.body = { success: false, message: "Debe proporcionar un municipio" };
      return;
    }

    const objEvento = new Evento();
    const eventos = await objEvento.seleccionarEventosPorMunicipio(municipio);
    response.status = 200;
    response.body = { success: true, data: eventos };
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al buscar eventos por municipio", errors: error };
  }
};

// GET - Buscar eventos por departamento
export const getEventosPorDepartamento = async (ctx: Context) => {
  const { response, request } = ctx;
  try {
    const url = new URL(request.url);
    const departamento = url.searchParams.get("departamento");

    if (!departamento) {
      response.status = 400;
      response.body = { success: false, message: "Debe proporcionar un departamento" };
      return;
    }

    const objEvento = new Evento();
    const eventos = await objEvento.seleccionarEventosPorDepartamento(departamento);
    response.status = 200;
    response.body = { success: true, data: eventos };
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al buscar eventos por departamento", errors: error };
  }
};

// POST - Crear nuevo evento
export const postEvento = async (ctx: Context) => {
  const { request, response } = ctx;
  try {
    const contentLength = request.headers.get("content-length");
    if (contentLength === "0") {
      response.status = 400;
      response.body = { success: false, message: "El cuerpo de la solicitud está vacío" };
      return;
    }

    const body = await request.body.json();
    const EventoData = {
      nombre: body.nombre || "",
      descripcion: body.descripcion || "",
      fecha_inicio: body.fecha_inicio || "",
      fecha_fin: body.fecha_fin || "",
      municipio: body.municipio || "",
      departamento: body.departamento || "",
      lugar: body.lugar || "",
    };

    const objEvento = new Evento(EventoData);
    const result = await objEvento.insertarEvento();

    if (result.success) {
      response.status = 201;
      response.body = result;
    } else {
      response.status = 400;
      response.body = result;
    }
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al procesar la solicitud", errors: error };
  }
};

// PUT - Actualizar evento
export const putEvento = async (ctx: any) => {
  const { request, response, params } = ctx;
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      response.status = 400;
      response.body = { success: false, message: "ID de evento inválido" };
      return;
    }

    const contentLength = request.headers.get("content-length");
    if (contentLength === "0") {
      response.status = 400;
      response.body = { success: false, message: "El cuerpo de la solicitud está vacío" };
      return;
    }

    const body = await request.body.json();
    const EventoData = {
      nombre: body.nombre || "",
      descripcion: body.descripcion || "",
      fecha_inicio: body.fecha_inicio || "",
      fecha_fin: body.fecha_fin || "",
      municipio: body.municipio || "",
      departamento: body.departamento || "",
      lugar: body.lugar || "",
    };

    const objEvento = new Evento(EventoData, id);
    const result = await objEvento.actualizarEvento();

    if (result.success) {
      response.status = 200;
      response.body = result;
    } else {
      response.status = 400;
      response.body = result;
    }
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al procesar la solicitud", errors: error };
  }
};

// DELETE - Eliminar evento
export const deleteEvento = async (ctx: any) => {
  const { response, params } = ctx;
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      response.status = 400;
      response.body = { success: false, message: "ID de evento inválido" };
      return;
    }

    const objEvento = new Evento(null, id);
    const result = await objEvento.eliminarEvento();

    if (result.success) {
      response.status = 200;
      response.body = result;
    } else {
      response.status = 400;
      response.body = result;
    }
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al eliminar el evento", errors: error };
  }
};