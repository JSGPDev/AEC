import { getData } from "/utils/utils_api.js";

import { insertHeader, insertPricesForm } from "/utils/utils_header.js";
import { insertFooter } from "/utils/utils_footer.js";

import { changeBackgroundUrl } from "/utils/changeBackgroundUrl.js";


const getServices = (document) => {
    insertHeader(document);
    insertFooter();
}

const constructServices = () => {
    return getData()
        .then(data => {
            if (!data.error) {
                const find_X_Y = (A) => {
                    for (let X = 1; X < A; X++) {
                        let Y = Math.floor((A - X) / 2);
                        if ((Y * 2) + X === A && Y < X && X - Y <= 2) {
                            return [X, Y];
                        }
                    }
                    let Z = Math.floor(A / 3);
                    return [Z, Z];
                }

                const services = data.data.services;
                const maxitemColumsArray = find_X_Y(Object.keys(services).length);
                const maxItemSideColumns = maxitemColumsArray[1];
                const maxItemCenterColumn = maxitemColumsArray[0];

                let html = '';

                // Construir la primera columna
                html += `<div class="third-column vertical-container">
                            <div class="solid complete-width border-rouded">`;
                for (let i = 0; i < maxItemSideColumns; i++) {
                    const serviceName = Object.keys(services)[i];
                    const service = services[serviceName];
                    html += `
                        <div class="option-box-static shadowed border-rouded choose-service-button"
                            id="serv-${serviceName}">
                            <h2>${serviceName}</h2>
                            <img src="${service.img}" alt="${serviceName}">
                        </div>`;
                }
                html += `</div></div>`;

                // Construir la segunda columna
                html += `<div class="third-column vertical-container">
                            <div class="solid complete-width border-rouded">`;
                for (let i = maxItemSideColumns; i < maxItemSideColumns + maxItemCenterColumn; i++) {
                    const serviceName = Object.keys(services)[i];
                    const service = services[serviceName];
                    html += `
                        <div class="option-box-static shadowed border-rouded choose-service-button"
                            id="serv-${serviceName}">
                            <h2>${serviceName}</h2>
                            <img src="${service.img}" alt="${serviceName}">
                        </div>`;
                }
                html += `</div></div>`;

                // Construir la tercera columna
                html += `<div class="third-column vertical-container">
                            <div class="solid complete-width border-rouded">`;
                for (let i = maxItemSideColumns + maxItemCenterColumn; i < Object.keys(services).length; i++) {
                    const serviceName = Object.keys(services)[i];
                    const service = services[serviceName];
                    html += `
                        <div class="option-box-static shadowed border-rouded choose-service-button"
                            id="serv-${serviceName}">
                            <h2>${serviceName}</h2>
                            <img src="${service.img}" alt="${serviceName}">
                        </div>`;
                }
                html += `</div></div>`;

                return html;

                changeBackgroundUrl(data.data.backgrounds, 'bg002');
            } else {
                throw new Error('Error al obtener datos de servicios');
            }
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            return '<h2>Error al obtener datos de servicios</h2>';
        });
}

const constructShowServiceHTML = (service) => {
    return getData()
        .then(data => {
            if (!data.error) {
                const serviceFunctios = data.data.services;

                const serviceTitle = service ? service : 'Error 404';
                const serviceImgSrc = serviceFunctios[service].img ? data.data.services[service].img : "/view/img/error-404.png";
                const serviceOptions = Object.keys(serviceFunctios[service].functions);

                let html = '';
                html += '<div class="solid complete-width border-rouded">';
                html += '   <div class="option-box-static shadowed border-rouded" id="explain-service-img">';
                html += '       <h2>' + serviceTitle + '</h2>';
                html += '       <img src="' + serviceImgSrc + '" alt="">';
                html += '   </div>';
                html += '</div>';

                html += '<div class="vertical-container complete-width border-rouded" id="service-functions-list">';
                if (serviceOptions) {
                    html += '<ul>';
                    serviceOptions.forEach(item => {
                        html += '<li class="card-function border-rouded" id="' + serviceTitle + "-" + item.replace(/\s/g, "_") + '" ><h2 class = "autotext">' + item + '</h2></li>';
                    });
                    html += '</ul>';
                } else {
                    html += '<h2>Error: No se encontraron funciones para este servicio</h2>';
                }
                html += '</div>';

                return html;
            }
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            // Si hay un error, devolver un HTML de error
            return '<h2>Error al obtener datos del servicio</h2>';
        });
}

const constructExplainServFuncionHTML = (funtionId) => {
    getData()
        .then(data => {
            if (!data.error) {
                const service = funtionId ? funtionId.split("-") : "null";
                const functionName = funtionId ? service[1].replaceAll("_", " ") : "A tu servicio";
                const textFunction = funtionId ? data.data.services[service[0]].functions[functionName] : "selecciona una de las opciones que te brindamos";

                document.querySelector("#function-title").textContent = functionName;
                document.querySelector("#service-function-text").textContent = textFunction;

                if (!funtionId)
                    document.querySelector("#Button-Serv-Function").classList.add("disable");
                else {
                    document.querySelector("#Button-Serv-Function").classList.remove("disable");
                }
                document.getElementById('cotizar-button').addEventListener('click', () => {
                    servfunction('Cotizar');
                });
                document.getElementById('contratar-button').addEventListener('click', () => {
                    servfunction('Agendar');
                });

                const servfunction = (accion) => {
                    insertPricesForm(accion, data.data.services);
                    const serv = document.querySelector('#serv');
                    const funct = document.querySelector('#funct');
                    const cantidad = document.querySelector('#cantidad');

                    serv.value = service[0];

                    // Crear un nuevo evento 'change'
                    var event = new Event('change', {
                        bubbles: true,
                        cancelable: true,
                    });

                    // Despachar el evento 'change'
                    serv.dispatchEvent(event);

                    funct.value = functionName;

                    serv.disabled = true;
                    funct.disabled = true;

                    funct.classList.remove('disable');
                    cantidad.classList.remove('disable');

                    document.getElementById('float-prices-modal').classList.remove('disable');
                }
            }
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
        });
}


export { getServices, constructServices, constructShowServiceHTML, constructExplainServFuncionHTML }