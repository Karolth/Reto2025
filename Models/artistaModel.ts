import { conexion } from "./conexion.ts";

export class Artista {
  constructor(
    public codigo: string,
    public nombres: string,
    public apellidos: string,
    public genero_musica: string,
    public ciudad_natal: string
  ) {}

  async insertarArtista() {
    try {
      await conexion.execute(
        `INSERT INTO artistas (codigo_artista, nombres, apellidos, genero_musica, ciudad_natal)
         VALUES (?, ?, ?, ?, ?)`,
        [this.codigo, this.nombres, this.apellidos, this.genero_musica, this.ciudad_natal]
      );
      return { success: true, message: "Artista registrado correctamente" };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return { success: false, message };
    }
  }

  async listarArtistas() {
    const result = await conexion.query("SELECT * FROM artistas");
    return result;
  }
}
