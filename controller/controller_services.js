import { getServices, constructShowServiceHTML } from "/model/model_services.js";

export default class ServicesController {
    constructor(document) {
        console.log("se cargo el controlador de servicios");
        this.checkHash()

        getServices(document);

        document.querySelectorAll(".choose-service-button").forEach(button => {
            button.addEventListener("click", () => {
                this.chooseService(button.id)
            });
        });
        window.addEventListener("hashchange", () => {
            this.checkHash();
        })
    }

    chooseService = (serviceId) => {
        window.location.hash = 'show-service/' + serviceId;

        const service = document.getElementById(serviceId);
        const serviceTitleElement = service.querySelector('h2').textContent;
        const serviceImgElement = service.querySelector('img').src;

        constructShowServiceHTML(serviceTitleElement, serviceImgElement)
            .then(html => {
                const field = document.getElementById('service-choosed');

                field.innerHTML = html;

                this.setExplainServiceView(true);

                document.querySelector("#explain-service-img").addEventListener("click", () => {
                    this.setExplainServiceView(false);
                });
            })
            .catch(error => {
                console.error('Error al generar el HTML:', error);
            });

    };

    setExplainServiceView = (setHide) => {
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

    checkHash = () => {
        const hashrout = window.location.hash.slice(1).split("/");
        console.log("checking hash: " + hashrout)

        if (hashrout[0] === "show-service" && hashrout.length >= 2) {
            this.chooseService(hashrout[1]);
        } else {
            this.setExplainServiceView(false)
        }
    }
}