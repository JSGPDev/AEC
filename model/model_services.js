import { getData } from "/utils/utils_api.js";

import { insertHeader } from "/utils/utils_header.js";

const getServices = (document) => {
    insertHeader(document);
}

const constructShowServiceHTML = (Title, ImgSrc) => {
    return getData()
        .then(data => {
            if (!data.error) {
                const serviceFunctios = data.data.serviceFunctions;

                const serviceTitle = Title ? Title : 'Error 404';
                const serviceImgSrc = ImgSrc ? ImgSrc : "../global/img/error-404.png";
                const serviceOptions = serviceFunctios[serviceTitle];

                var html = '';
                html += '<div class="solid complete-width border-rouded">';
                html += '   <div class="option-box-static shadowed border-rouded" id="explain-service-img">';
                html += '       <h2>' + serviceTitle + '</h2>';
                html += '       <img src="' + serviceImgSrc + '" alt="">';
                html += '   </div>';
                html += '</div>';

                html += '<div class="vertical-container complete-width border-rouded" id="service-functions-list">';
                if (serviceOptions) {
                    html += '<ul>';
                    serviceOptions.forEach(function (item) {
                        html += '<li class="card-function border-rouded" id="' + item + '" ><h2 class = "autotext">' + item + '</h2></li>';
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
    return getData()
        .then(data => {
            if (!data.error) {
                const selectedFunction = data.data.serviceFunctionsText;


                return html;
            }
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            // Si hay un error, devolver un HTML de error
            return '<h2>Error al obtener datos del servicio</h2>';
        });
}


export { getServices, constructShowServiceHTML, constructExplainServFuncionHTML }