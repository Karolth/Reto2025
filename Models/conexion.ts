import { Client } from "../Dependencies/dependencias.ts";

export const conexion = await new Client().connect({
  hostname: "localhost",
  username: "root",
  password: "",
  db: "sistema_eventos_colombia",
});