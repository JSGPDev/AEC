document.addEventListener('DOMContentLoaded', () => {
    checkHash();
})


const chooseService = (serviceId) => {
    window.location.hash = 'show-service/' + serviceId;


    const service = document.getElementById(serviceId);
    const serviceTitleElement = service.querySelector('h2').textContent;
    const serviceImgElement = service.querySelector('img').src;

    var html = contructShowServiceHTML(serviceTitleElement, serviceImgElement)

    const field = document.getElementById('service-choosed');

    field.innerHTML = html;

    setExplainServiceView(true);

};

const contructShowServiceHTML = (Title, ImgSrc) => {

    const serviceFunctios = {
        Enfermeria: ['Inyectologia', 'Curaciones', 'Cuidado post quirurgico', 'Administracion de medicamentos', 'Administracion y manejo de ostomias', 'retiro de puntos ', 'toma de signos vitales'],
        Acompanamiento: ['Citas medicas', 'Acompanamiento en casa diurno y nocturno', 'Procedimientos ambulatorios', 'Acompanamiento en hospitalización'],
        Rehabilitacion: ['Terapia ocupacional', 'Terapia fisica', 'Terapia respiratoria', 'Terapia fonoaudiologia'],
        Medicina: ['Visita medica', 'Lectura de examenes', 'Formulacion de medicamentos']
    };

    const serviceTitle = Title ? Title : 'Error 404';
    const serviceImgSrc = ImgSrc ? ImgSrc : "../global/img/error-404.png";
    const serviceOptions = serviceFunctios[serviceTitle];

    var html = '';
    html += '<div class="solid complete-width border-rouded">';
    html += '   <div class="option-box-static shadowed border-rouded" onclick="setExplainServiceView(false)">';
    html += '       <h2>' + serviceTitle + '</h2>';
    html += '       <img src="' + serviceImgSrc + '" alt="">';
    html += '   </div>';
    html += '</div>';

    html += '<div class="color-solid vertical-container complete-width border-rouded">';
    if (serviceOptions) {
        html += '<ul>';
        serviceOptions.forEach(function (item) {
            html += '<li class="card-function border-rouded shadowed" ><h2 class = "autotext">' + item + '</h2></li>';
        });
        html += '</ul>';
    } else {
        html += '<h2>Error: No se encontraron funciones para este servicio</h2>';
    }
    html += '</div>';

    return html;
}

const setExplainServiceView = (setHide) => {
    const show_section = document.getElementById('show-services')
    const explain_section = document.getElementById('explain-service')

    if (setHide) {
        explain_section.classList.remove('disable');
        show_section.classList.add('disable');
    } else {
        window.location.hash = '';
        explain_section.classList.add('disable');
        show_section.classList.remove('disable');
    }
}

const checkHash = () => {
    var url = window.location.href;

    if (url.indexOf('#') !== -1) {
        var hash = url.substring(url.indexOf('#') + 1).substring(url.substring(url.indexOf('#') + 1).indexOf('/') + 1);
        chooseService(hash);
    }
}