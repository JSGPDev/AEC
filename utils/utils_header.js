import { getData, update } from "./utils_api.js";

const pageTitlesToIds = {
    "AEC - Atencion En Casa - Pagina Principal": "inicio",
    "AEC - Atencion En Casa - Servicios": "servicios",
    "AEC - Atencion En Casa - Nosotros": "nosotros",
    "AEC - Atencion En Casa - Testimonios": "testimonios",
    "AEC - Atencion En Casa - Iniciar sesion": "sesion",
    "AEC - Atencion En Casa - Administrar contenido": "admin",

    "inicio": "index.html",
    "servicios": "services.html",
    "nosotros": "us.html",
    "testimonios": "testimonies.html",
    "sesion": "login.html",
    "admin": "admin.html"
};

const insertHeader = async (document) => {
    try {
        const data = await getData();
        const docTitle = document.title;

        if (docTitle in pageTitlesToIds) {
            const getOptionLi = (docTitle) => {
                return pageTitlesToIds[docTitle] ? `id="${pageTitlesToIds[docTitle]}"` : '';
            };

            const getNewOptionLi = (optionLi) => {
                return optionLi + ' style="color: var(--color-alfa-secundario)"';
            };

            const response = await fetch('/view/components/header.html');
            if (!response.ok) {
                throw new Error('Error al cargar el archivo HTML');
            }

            let htmlContent = await response.text();
            const optionLi = getOptionLi(docTitle);
            const newOptionLi = getNewOptionLi(optionLi);
            htmlContent = htmlContent.replace(optionLi, newOptionLi);
            document.querySelector('#header-container').insertAdjacentHTML('afterbegin', htmlContent);

            const script = document.createElement('script');
            script.src = '/view/js/bubbleButton.js';
            document.head.appendChild(script);

            document.querySelectorAll(".linkTo").forEach(element => {
                element.addEventListener("click", () => {
                    let url = element.id === "inicio" ? "/index.html" : `/view/${pageTitlesToIds[element.id]}`
                    window.location.hash = url;
                });
            });

            document.querySelector("#header-image").addEventListener("click", () => {
                changeLocation("/index.html")
            });

            // Mover la lógica de asignación de href aquí
            const correo = data.data.contact.Email;
            const numero = data.data.contact.Whatsapp;
            const facebook = data.data.contact.Facebook;
            const instagram = data.data.contact.Instagram;

            document.querySelector("#gmail-b").href = `mailto:${correo}?subject=Consulta%20de%20Enfermería&body=Hola,%20me%20gustaría%20obtener%20información%20sobre%20sus%20servicios%20de%20enfermería.%20Por%20favor,%20contáctenme%20para%20discutir%20mis%20necesidades.%20Gracias.`;
            document.querySelector("#whatsapp-b").href = `https://wa.me/${numero}?text=Hola`;
            document.querySelector("#facebook-b").href = facebook;
            document.querySelector("#instagram-b").href = instagram;

            document.querySelector("#gmail-b").addEventListener('click', () => {
                updateStats('gmail');
            });
            document.querySelector("#whatsapp-b").addEventListener('click', () => {
                updateStats('whatsapp');
            });
            document.querySelector("#facebook-b").addEventListener('click', () => {
                updateStats('facebook');
            });
            document.querySelector("#instagram-b").addEventListener('click', () => {
                updateStats('instagram');
            });

            document.querySelector('#nosotros').addEventListener('click', () => {
                updateStats('nosotros');
            });
            document.querySelector('#servicios').addEventListener('click', () => {
                updateStats('servicios');
            });
            document.querySelector('#testimonios').addEventListener('click', () => {
                updateStats('testimonios');
            });

        } else {
            const errorMessage = 'Error al cargar el archivo HTML: el título de la página no coincide con los datos estáticos';
            console.error(errorMessage);
            document.querySelector('body').insertAdjacentHTML('afterbegin', errorMessage);
        }
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
};

const updateStats = (campo) => {
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

const changeLocation = (url) => {
    window.location.href = url;
}

export { pageTitlesToIds, insertHeader, changeLocation }
