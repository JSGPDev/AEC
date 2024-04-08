import IndexController from "./controller_index.js";
import ServicesController from "./controller_services.js";
// Importa otros controladores según sea necesario

export const controllers = {
    "index.html": IndexController,
    "services.html": ServicesController,
    // "us.html": UsController,
    // "testimonies.html": TestimoniesController
    // Agrega aquí otros controladores según sea necesario
};