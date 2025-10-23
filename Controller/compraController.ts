// import { Context } from "../Dependencies/dependencias.ts";
// import { Compra } from "../Models/compraModel.ts";

// // RF8: Realizar compra (usuario debe estar autenticado)
// export const realizarCompra = async (ctx: Context) => {
//   const { request, response, state } = ctx;
//   const body = await request.body().value;
//   const id_usuario = state.userId;

//   const compra = new Compra(
//     id_usuario,
//     body.numero_documento_comprador,
//     body.id_evento,
//     body.id_boleteria,
//     body.cantidad,
//     body.metodo_pago
//   );

//   const result = await compra.realizarCompra();
//   response.status = result.success ? 201 : 400;
//   response.body = result;
// };

// // RF12: Obtener historial de compras
// export const obtenerHistorialCompras = async (ctx: Context) => {
//   const { response, state } = ctx;
//   const id_usuario = state.userId;

//   const historial = await Compra.obtenerHistorialCompras(id_usuario);
//   response.status = 200;
//   response.body = { success: true, data: historial };
// };

// // RF12: Filtrar compras por evento
// export const filtrarComprasPorEvento = async (ctx: Context) => {
//   const { response, state, params } = ctx;
//   const id_usuario = state.userId;
//   const id_evento = params.id;

//   if (!id_evento) {
//     response.status = 400;
//     response.body = { success: false, message: "ID de evento requerido" };
//     return;
//   }

//   const compras = await Compra.filtrarComprasPorEvento(id_usuario, parseInt(id_evento));
//   response.status = 200;
//   response.body = { success: true, data: compras };
// };

// // RF12: Filtrar compras por fecha
// export const filtrarComprasPorFecha = async (ctx: Context) => {
//   const { response, state, request } = ctx;
//   const id_usuario = state.userId;
//   const url = new URL(request.url);
//   const fecha = url.searchParams.get("fecha");

//   if (!fecha) {
//     response.status = 400;
//     response.body = { success: false, message: "Debe proporcionar una fecha" };
//     return;
//   }

//   const compras = await Compra.filtrarComprasPorFecha(id_usuario, fecha);
//   response.status = 200;
//   response.body = { success: true, data: compras };
// };