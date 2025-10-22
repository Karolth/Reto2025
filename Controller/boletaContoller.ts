import { Context } from "../Dependencies/dependencias.ts";
import { Boleteria } from "../Models/boleteriaModel.ts";

export const postBoleteria = async (ctx: Context) => {
  const { request, response } = ctx;
  const body = await request.body.json();
  const boleto = new Boleteria(body.id_evento, body.localidad, body.valor, body.cantidad);
  const result = await boleto.insertarBoleteria();
  response.status = result.success ? 201 : 400;
  response.body = result;
};

export const getBoleteriaPorEvento = async (ctx: any) => {
  const { params, response } = ctx;
  const boleteria = await new Boleteria(0, "", 0, 0).listarBoleteriaPorEvento(params.id_evento);
  response.status = 200;
  response.body = { success: true, data: boleteria };
};
