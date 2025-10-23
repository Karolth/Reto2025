// // Controller/consultaController.ts

// import { Context } from "../Dependencies/dependencias.ts";
// import { Consulta } from "../Models/consultaModel.ts"; // Asegúrate de tener la ruta correcta

// // ... (otras funciones como consultarEventosDisponibles, obtenerDetalleEvento)

// /**
//  * Listar departamentos (público)
//  * RUTA: GET /consulta/departamentos
//  */
// export const listarDepartamentos = async (ctx: Context) => {
//     try {
//         const result = await Consulta.listarDepartamentos(); // Asumo que el modelo tiene este método
        
//         ctx.response.status = 200;
//         ctx.response.body = { 
//             success: true, 
//             data: result,
//             message: "Departamentos listados correctamente." // Mensaje de éxito
//         };
//     } catch (error) {
//         console.error("Error al listar departamentos:", error);
//         ctx.response.status = 500;
//         ctx.response.body = { 
//             success: false, 
//             message: "Error interno al listar departamentos." 
//         };
//     }
// };

// // ... (otras funciones como listarMunicipios, listarLugaresPorMunicipio)