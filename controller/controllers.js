import IndexController from "./controller_index.js";
import ServicesController from "./controller_services.js";
import UsController from "./controller_us.js"
import TestimoniesController from "./controller_testimonies.js"
import LoginController from "./controller_login.js";
import AdminController from "./Controller_admin.js";
// Importa otros controladores según sea necesario

export const controllers = {
    "index.html": IndexController,
    "services.html": ServicesController,
    "us.html": UsController,
    "testimonies.html": TestimoniesController,
    "login.html": LoginController,
    "admin.html": AdminController
    // Agrega aquí otros controladores según sea necesario
};