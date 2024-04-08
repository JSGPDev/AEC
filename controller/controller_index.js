import { getIndex } from "/model/model_index.js";

export default class IndexController {
    constructor(document) {
        getIndex(document);
    }
}

