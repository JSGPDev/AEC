import { getData } from "../utils/utils_api.js";
import { insertHeader } from "../utils/utils_header.js";

const getTestimonies = (document) => {
    insertHeader(document);
    const container = document.querySelector("#content-container");

    getData()
        .then(data => {
            const testimonies = data.data.testimonies;
            for (const key in testimonies) {
                if (testimonies.hasOwnProperty(key)) {
                    const testimonie = testimonies[key];
                    container.insertAdjacentHTML('afterbegin', contructHtml(testimonie, key % 2 == 0 ? 1 : 2));
                }
            }
            document.querySelectorAll(".a-service").forEach(element => {
                element.addEventListener("click", () => {
                    const url = `/view/services.html#show-service/${element.id}`;
                    window.location.href = url;
                });
            });
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            document.querySelector("#content-container").insertAdjacentHTML('beforeend', '<h1>Error al obtener datos: </h1><h3>' + error + '</h3>');
        });
}

const contructHtml = (testimonie, poss) => {
    const html = poss == 1 ? `
        <div class="row opaque-alfa-container shadowed-in">
            <iframe width="560" height="315"
                src="${testimonie.videoLink}"
                title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"></iframe>
            <div id="${testimonie.servProv}" class="a-service text-container" style="background-color:#fff0;cursor:pointer;">
                <h1>${testimonie.service}</h1>
            </div>
        </div>
    `:
        `
        <div class="row opaque-container shadowed">
            <div id="${testimonie.servProv}" class="a-service text-container" style="background-color:#fff0;cursor:pointer;">
                <h1>${testimonie.service}</h1>
            </div>
            <iframe width="560" height="315"
                src="${testimonie.videoLink}"
                title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>
    `
    return html;
}

export { getTestimonies };