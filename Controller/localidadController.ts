import { Context } from "../Dependencies/dependencias.ts";
import { Localidad } from "../Models/localidadModel.ts";

export const postLocalidad = async (ctx: Context) => {
  const { request, response } = ctx;
  const body = await request.body.json();
  const localidad = new Localidad(body.codigo, body.nombre);
  const result = await localidad.insertarLocalidad();
  response.status = result.success ? 201 : 400;
  response.body = result;
};

export const getLocalidades = async (ctx: Context) => {
  const { response } = ctx;
  const localidades = await new Localidad("", "").listarLocalidades();
  response.status = 200;
  response.body = { success: true, data: localidades };
};
