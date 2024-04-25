import { insertHeader } from "/utils/utils_header.js";
import { getData } from "/utils/utils_api.js";


const getIndex = (document) => {
    window.location.hash = "";
    getData()
        .then(data => {
            if (!data.error) {
                insertHeader(document);
                document.querySelector("#welcome-text").textContent = data.data.longText.welcomeText;
                document.querySelectorAll('.explain-card').forEach(element => {
                    let title = element.querySelector(".card-title").textContent;
                    element.querySelector(".explain-card-text").textContent = data.data.longText.cardText[title];

                    document.querySelector("#nextToVideo").textContent = data.data.longText.nextToVideo;
                    document.querySelector("#whyUs").textContent = data.data.longText.whyUs;

                });
                const services = data.data.services;
                const servicesNames = Object.keys(services);
                const container = document.querySelector("#service-carousel");
                let html = '';

                servicesNames.forEach((service, index) => {
                    // Utilizamos un operador ternario para determinar la clase a aplicar
                    const classToShow = index === 0 ? 'unhide' : 'hide';

                    html += `
                    <div class="option-box ${classToShow}" id="serv-${service}">
                        <h2>${service}</h2>
                        <img src="${services[service].img}" alt="${service}">
                    </div>`;
                });

                container.innerHTML = html;

                document.querySelectorAll(".option-box").forEach(element => {
                    element.addEventListener("click", () => {
                        const url = `/view/services.html#show-service/${element.id}`;
                        window.location.href = url;
                    });
                });

            } else {
                console.error(data.message);
                document.querySelector("#welcome-text").textContent = data.message;
            }
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            document.querySelector("#welcome-text").textContent = 'Error al obtener datos:' + error;
        });
}



export { getIndex }
