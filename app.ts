import { Application, oakCors } from "./Dependencies/dependencias.ts";
import { eventoRouter } from "./Routes/eventoRouter.ts";
// import { localidadRouter } from "./Routes/localidadRouter.ts";
// import { artistaRouter } from "./Routes/artistaRouter.ts";
// import { localidadRouter } from "./Routes/localidadRouter.ts";
import { boleteriaRouter } from "./Routes/boleteriaRouter.ts";
// import { artistaRouter } from "./Routes/artistaRouter.ts";
import { localidadRouter } from "./Routes/localidadRouter.ts";
import { artistaRouter } from "./Routes/artistaRouter.ts";
import { usuarioRouter } from "./Routes/usuarioRouter.ts";

const app = new Application();

app.use(oakCors());
const routers = [usuarioRouter,boleteriaRouter, eventoRouter, localidadRouter, artistaRouter];

routers.forEach((r) => {
  app.use(r.routes());
  app.use(r.allowedMethods());
});

console.log("Servidor esta corriendo por el puerto 8000");
await app.listen({ hostname:"127.0.0.1" ,port: 8000 });

  