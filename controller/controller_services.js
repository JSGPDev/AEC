import { getServices, constructServices, constructShowServiceHTML, constructExplainServFuncionHTML } from "/model/model_services.js";

export default class ServicesController {
    constructor(document) {
        console.log("se cargo el controlador de servicios");
        this.checkHash()

        getServices(document);

        constructServices()
            .then(html => {
                const field = document.querySelector("#show-services");
                field.innerHTML = html;

                document.querySelectorAll(".choose-service-button").forEach(button => {
                    button.addEventListener("click", () => {
                        this.chooseService(button.id)
                    });
                });
            }).catch(error => {
                console.error('Error al generar el HTML:', error);
            });

        window.addEventListener("hashchange", () => {
            this.checkHash();
        })
    }

    chooseService = (serviceId) => {
        window.location.hash = 'show-service/' + serviceId;

        const service = serviceId.substring(serviceId.indexOf('-') + 1);

        constructShowServiceHTML(service)
            .then(html => {
                const field = document.getElementById('service-choosed');

                field.innerHTML = html;

                this.setExplainServiceView(true);

                document.querySelector("#explain-service-img").addEventListener("click", () => {
                    this.setExplainServiceView(false);
                    constructExplainServFuncionHTML();
                });

                document.querySelectorAll(".card-function").forEach(button => {
                    button.addEventListener("click", () => {
                        constructExplainServFuncionHTML(button.id);
                    });
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