import { getUs } from "/model/model_us.js";

export default class UsController {
    constructor(document) {
        console.log("se cargo el controlador de nosotros");

        getUs(document);
    }
}