import { pageTitlesToIds, changeLocation } from "/utils/utils_header.js";

import { controllers } from "/controller/controllers.js";

import { update } from "/utils/utils_api.js";

const curDocument = pageTitlesToIds[pageTitlesToIds[document.title]];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('loading-screen').style.display = 'none';

    const curDocument = pageTitlesToIds[pageTitlesToIds[document.title]];
    const Controller = controllers[curDocument];

    if (Controller) {
        const curController = new Controller(document);
        window.curController = curController;
    } else {
        console.error("No se encontró un controlador para la vista actual.");
    }

    updateStats("views");
});

window.addEventListener("hashchange", () => {
    const hashrout = window.location.hash.slice(1).split("/");

    if (hashrout[1] === "index.html") {
        changeLocation("/index.html")
    }

    if (hashrout[1] === "view") {
        changeLocation(`/${hashrout[1]}/${hashrout[2]}`);
    }

});

const updateStats = (campo) => {
    if (sessionStorage.getItem("first-view") !== "false") {
        sessionStorage.setItem("first-view", "false");
        update({
            endpoint: "archivo/actualizar-stat",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                campo: campo,
            }
        });
    }
}
