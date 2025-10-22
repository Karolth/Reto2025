import { Context } from "../Dependencies/dependencias.ts";
import { Artista } from "../Models/artistaModel.ts";

export const postArtista = async (ctx: Context) => {
  const { request, response } = ctx;
  const body = await request.body.json();
  const artista = new Artista(
    body.codigo,
    body.nombres,
    body.apellidos,
    body.genero_musica,
    body.ciudad_natal
  );
  const result = await artista.insertarArtista();
  response.status = result.success ? 201 : 400;
  response.body = result;
};

export const getArtistas = async (ctx: Context) => {
  const { response } = ctx;
  const artistas = await new Artista("", "", "", "", "").listarArtistas();
  response.status = 200;
  response.body = { success: true, data: artistas };
};
