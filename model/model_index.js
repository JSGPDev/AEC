import { insertHeader } from "/utils/utils_header.js";
import { insertFooter } from "../utils/utils_footer.js";
import { getData } from "/utils/utils_api.js";
import { changeBackgroundUrl } from "../utils/changeBackgroundUrl.js";


const getIndex = (document) => {
    window.location.hash = "";
    getData()
        .then(data => {
            if (!data.error) {
                insertHeader(document);
                document.querySelector("#welcome-text").innerHTML = data.data.longText.welcomeText;

                document.querySelector('#card-container').innerHTML = '';
                let card_container = '';
                for (let key in data.data.cards) {
                    card_container += `
                        <div class="explain-card box-double tinny-box card">
                            <p class="card-title">${key}</p>
                            <p class="explain-card-text disable">${data.data.cards[key].text}</p>
                            <img src="${data.data.cards[key].img}" alt="imagen representativa de ${key}">
                        </div>
                    `
                }
                document.querySelector('#card-container').innerHTML = card_container;

                document.querySelectorAll('.explain-card').forEach(element => {

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
                        <img class="option-box-index-img" src="${services[service].img}" alt="${service}">
                    </div>`;
                });


                container.innerHTML = html;

                document.querySelectorAll(".option-box").forEach(element => {
                    element.addEventListener("click", () => {
                        const url = `/view/services.html#show-service/${element.id}`;
                        window.location.href = url;
                    });
                });
                document.querySelector('.videoY').src = data.data.longText.nextToVideoLink;

                changeBackgroundUrl(data.data.backgrounds, 'bg001');
            } else {
                console.error(data.message);
                document.querySelector("#welcome-text").textContent = data.message;
            }
            insertFooter();

        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            document.querySelector("#welcome-text").textContent = 'Error al obtener datos:' + error;
        });
}



export { getIndex }
