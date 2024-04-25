import { getTestimonies } from "../model/model_testimonies.js";

export default class UsController {
    constructor(document) {
        console.log("se cargo el controlador de tesimonios");

        getTestimonies(document);
    }
}