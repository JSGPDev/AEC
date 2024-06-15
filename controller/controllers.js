import IndexController from "/controller/controller_index.js";
import ServicesController from "/controller/controller_services.js";
import UsController from "/controller/controller_us.js"
import TestimoniesController from "/controller/controller_testimonies.js"
import LoginController from "/controller/controller_login.js";
import AdminController from "/controller/Controller_admin.js";
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