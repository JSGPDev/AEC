import { getData, getAny, update } from "/utils/utils_api.js";

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


            document.querySelector('#AGENDAR-B').addEventListener('click', () => {
                document.querySelector('#float-prices-modal').classList.remove('disable');
                insertPricesForm('Agendar', data.data.services);
            });
            document.querySelector('#PRECIOS-B').addEventListener('click', () => {
                document.querySelector('#float-prices-modal').classList.remove('disable');
                insertPricesForm('Cotizar', data.data.services);
            });

            document.querySelector('#float-prices-modal #exit').addEventListener('click', () => {
                document.querySelector('#float-prices-modal').classList.add('disable');
                document.querySelector('#serv').disabled = false;
                document.querySelector('#funct').disabled = false;
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

const insertPricesForm = (type, services) => {
    let servicesOptions = '';
    for (let key in services) {
        servicesOptions += `
            <option value="${key}">${key}</option>
            `;
    }

    const html = `
        <form class="admin-form update-index-form"
            id="cotizar-contratar-form"
            style="border-radius: 25px; box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 10px; width: 90%; height: 90%;">
            <label>${type} Servicio</label>
            <div class="column-flow">

                <input type="text" id="nombre" name="nombre"
                    placeholder="Tu nombre" required>
                <input type="email" id="email" name="email"
                    placeholder="correo: email@ejemplo.com" required>
                <input type="number" name="telefono" id="telefono"
                    placeholder="numero de telefono">

                <div class="row">

                    <select name="serv" id="serv" required>
                        <option value="">Selecciona un Servicio</option>
                        ${type === 'Agendar' ? '' : '<option value="All">Precio Para Todos Los Servicios</option>'}
                        ${servicesOptions}
                    </select>

                    <input type="number" name="cantidad" id="cantidad" class="mini-input disable"
                        placeholder="cantidad" class="mini-input" required>

                    <select name="funct" id="funct" class="disable" required>
                        <option value=''>Selecciona una Funcion</option>
                    </select>
                </div>
            </div>
            <div class="buttons-horizontal-container">
                <button type="submit">${type}</button>
                <button type="reset">Resetear</button>
            </div>
        </form>
    `

    document.querySelector('#float-prices-modal .float-container').innerHTML = html;

    document.querySelector('#serv').addEventListener('change', function () {
        const cantidad = document.querySelector('#cantidad');
        const funct = document.querySelector('#funct')
        if (this.value === "" || this.value === 'All') {
            cantidad.required = false;
            funct.required = false;

            cantidad.classList.add('disable');
            funct.classList.add('disable');
        } else {
            cantidad.required = true;
            funct.required = true;

            cantidad.classList.remove('disable');
            funct.classList.remove('disable');

            let functOptions = "<option value=''>Selecciona una Funcion</option>";
            for (let key in services[this.value].functions) {
                functOptions += `
                    <option value="${key}">${key}</option>
                    `;
            }
            funct.innerHTML = '';
            funct.innerHTML = functOptions;

        }
    })

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            document.querySelector('#float-prices-modal').classList.add('disable');
            document.querySelector('#serv').disabled = false;
            document.querySelector('#funct').disabled = false;
        }
    });
    window.addEventListener('popstate', function (event) {
        document.querySelector('#float-prices-modal').classList.add('disable');
        document.querySelector('#serv').disabled = false;
        document.querySelector('#funct').disabled = false;
    });

    document.querySelector('#cotizar-contratar-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const method = type === 'Agendar' ? 'GET' : 'POST';
        const email = document.querySelector('#email').value;
        const nombre = document.querySelector('#nombre').value;
        const telefono = document.querySelector('#telefono').value || 'null';
        const serv = document.querySelector('#serv').value;
        const funct = document.querySelector('#funct').value;
        const cantidad = document.querySelector('#cantidad').value;
        const endpoint = type === 'Agendar' ? `prices/subscribe/${email}/${nombre}/${telefono}/${serv}/${funct}/${cantidad}` : `prices/${serv === 'All' ? 'all' : 'quote'}`;

        const body = {
            endpoint: endpoint,
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                "email": email,
                "nombre": nombre,
                "telefono": String(telefono),
                "serv": serv,
                "funct": funct,
                "cantidad": cantidad
            }
        };
        console.log(body);
        if (method !== 'GET') { update(body); } else { getAny(endpoint) }
        alert('¡GENIAL!\nRevisa tu correo, ahi encontraras Nuestra respuesta');
    });

}

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

export { pageTitlesToIds, insertHeader, changeLocation, insertPricesForm }
