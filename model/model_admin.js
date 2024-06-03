import { getData, update, updateFormData } from "../utils/utils_api.js";
import { convertirMarkdownAHTML } from "../utils/text_handler.js";
let forms = {}

const getAdmin = (document) => {
    getData().then(data => {
        forms.stats = () => stats();

        forms.indexForm = () => indexForm(data.data.longText, data.data.cards);

        forms.servicesForm = () => servicesForm(data.data.services);

        forms.usForm = () => usForm(data.data.longText);

        forms.testimoniesForm = () => testimoniesForm(data.data.testimonies, data.data.services);

        forms.contactForm = () => contactForm(data.data.contact);

        forms.closeSession = () => closeSession();

    }).catch(error => {
        console.error('Error al obtener datos:', error);
    });
    stats()
}

const closeSession = () => {

    update({
        endpoint: "archivo/eliminar-dato",
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            session: sessionStorage.getItem('sessionId'),
            nombreArchivo: "session",
            campo: sessionStorage.getItem('sessionId')
        }
    });

    sessionStorage.removeItem('sessionId');

    window.location.href = '/';
}

const stats = () => {
    const html = `
        <canvas id="myChart" width="400" height="200"></canvas>
    `
    htmlUpdate(html);
    // Obtener el contexto del canvas
    const ctx = document.getElementById('myChart').getContext('2d');

    // Crear un nuevo gráfico
    const myChart = new Chart(ctx, {
        type: 'bar', // Tipo de gráfico: bar, line, pie, etc.
        data: {
            labels: ['Rojo', 'Azul', 'Amarillo', 'Verde', 'Púrpura', 'Naranja'],
            datasets: [{
                label: '# de Votos',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

const insertform = (document, form) => {
    forms[form]();
}

const htmlUpdate = (html) => {
    const field = document.querySelector('#render-field');
    field.innerHTML = '';
    field.innerHTML = html;
}

const indexForm = (longText, cards) => {
    let cardOptions = '';

    for (let key in cards) {
        cardOptions += `
            <option value="${cards[key].text}">${key}</option>
            `;
    }
    const html = `
        <div class="container">
            <form class="admin-form update-index-form"
            id="index-welcome-text">
            <label for="bacground-Img">Imagen de fondo</label>
                <div class="row disable">
                    <input type="file" name="bacground-Img" id="bacground-Img" class="disable" accept="image/*">
                    <img id="prev-bacground-img" src="/view/img/enfermera.png" alt="Haz clic para subir una imagen">
                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

            <form class="admin-form update-index-form"
                id="index-welcome-text">
                <label for="welcome-text">Texto de bienvenida</label>
                <div class="row disable">
                    <textarea name="welcome-text" id="welcome-text-update" placeholder="${longText.welcomeText}"></textarea>
                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

            <form class="admin-form update-index-form"
                id="index-nextToVideo">
                <label for="nextToVideo">Texto del video</label>
                <div class="row disable">
                    <textarea name="nextToVideo-text"
                        id="nextToVideo-text-update"
                        placeholder="${longText.nextToVideo}"></textarea>
                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

            <form class="admin-form update-index-form" id="index-whyUs-text">
                <label for="whyUs-text">Texto ¿por que elegirnos?</label>
                <div class="row disable">
                    <textarea name="whyUs-text" id="whyUs-text-update"
                        placeholder="${longText.whyUs}"></textarea>
                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

            <form class="admin-form update-index-form" id="index-cards-text" enctype="multipart/form-data">
                <label for="cards-text">Texto para cartas de puntos
                    positivos</label>
                <div class="row disable">
                <input class="disable mini-input" type="text"
                            name="new-card-name"
                            id="new-card-name"
                            placeholder="titulo para la nueva carta"
                            maxlength="30">
                    <div id="cardInfo" class="row disable">
                        <input type="file" name="card-Img" id="card-Img" accept="image/*">
                        <img id="prev-img" src="/view/img/enfermera.png" alt="Haz clic para subir una imagen">
                        <textarea name="cards-text" id="cards-text" placeholder="texto de explicacion de la carta"></textarea>
                    </div>
                    <div class="horizontal-container">
                        <select name="card-action-select"
                            id="card-action-select">
                            <option value="update-card">actualizar una
                                carta</option>
                            <option value="create-card">crear una
                                carta</option>
                            <option value="delete-card">eliminar una
                                carta</option>
                        </select>

                        <select name="card-to-midify"
                            id="card-to-midify">
                            <option value="">selecciona una
                                carta</option>
                            ${cardOptions}
                        </select>
                    </div>

                    <div class="buttons-horizontal-container">
                        <button type="submit" id="update-button">Actualizar</button>
                        <button class="disable" id="create-button" type="submit">Crear</button>
                        <button class="disable" id="delete-button" type="submit">Eliminar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>
        </div>
    `

    htmlUpdate(html);

    document.getElementById('prev-bacground-img').addEventListener('click', function () {
        document.getElementById('bacground-Img').click();
    });

    document.getElementById('bacground-Img').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('prev-bacground-img').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('prev-img').addEventListener('click', function () {
        document.getElementById('card-Img').click();
    });

    document.getElementById('card-Img').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('prev-img').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.querySelector('#card-to-midify').addEventListener('change', function () {
        if (this.value !== "") {
            document.querySelector('#cards-text').value = this.value;
            document.getElementById('prev-img').src = cards[this.options[this.selectedIndex].text].img;
            document.getElementById('cardInfo').classList.remove('disable');
        } else {
            document.getElementById('cardInfo').classList.add('disable');
        }
    })
    document.querySelector('#card-action-select').addEventListener('change', function () {
        const upB = document.querySelector('#update-button');
        const creB = document.querySelector('#create-button');
        const delB = document.querySelector('#delete-button');

        const cardSelect = document.querySelector('#card-to-midify');
        const cardInfo = document.getElementById('cardInfo');
        const NeCardNa = document.getElementById('new-card-name');


        switch (this.value) {
            case 'update-card':
                upB.classList.remove('disable');
                creB.classList.add('disable');
                delB.classList.add('disable');
                cardSelect.classList.remove('disable');
                NeCardNa.classList.add('disable');
                document.querySelector('#cards-text').readOnly = false;
                document.querySelector('#card-Img').disabled = false;

                cardSelect.value === "" ? cardInfo.classList.add('disable') : cardInfo.classList.remove('disable');

                break;
            case 'create-card':
                upB.classList.add('disable');
                creB.classList.remove('disable');
                delB.classList.add('disable');
                cardSelect.classList.add('disable');
                NeCardNa.classList.remove('disable');
                cardInfo.classList.remove('disable')
                document.querySelector('#cards-text').readOnly = false;
                document.querySelector('#card-Img').disabled = false;
                document.querySelector('#cards-text').value = "";
                break;
            case 'delete-card':
                upB.classList.add('disable');
                creB.classList.add('disable');
                delB.classList.remove('disable');
                cardSelect.classList.remove('disable');
                NeCardNa.classList.add('disable');
                document.querySelector('#cards-text').readOnly = true;
                document.querySelector('#card-Img').disabled = true;

                cardSelect.value === "" ? cardInfo.classList.add('disable') : cardInfo.classList.remove('disable');

                break;
        }
    })


    document.querySelector('#index-welcome-text').addEventListener('submit', (e) => {
        update_text('welcome-text-update', 'longText.welcomeText')
    });

    document.querySelector('#index-nextToVideo').addEventListener('submit', (e) => {
        update_text('nextToVideo-text-update', 'longText.nextToVideo')
    })

    document.querySelector('#index-whyUs-text').addEventListener('submit', (e) => {
        update_text('whyUs-text-update', 'longText.whyUs')
    })

    document.querySelector('#update-button').addEventListener('click', (e) => {
        // e.preventDefault();
        // Obtener el elemento select
        const select = document.querySelector('#card-to-midify');

        // Obtener el índice de la opción seleccionada
        const selectedIndex = select.selectedIndex;

        // Obtener el texto de la opción seleccionada
        const selectedText = select.options[selectedIndex].text;
        update_text_image(selectedText, document.querySelector('#cards-text'), document.querySelector('#card-Img'),);
    })

    document.querySelector('#create-button').addEventListener('click', (e) => {
        e.preventDefault();

        const selectedText = document.querySelector('#new-card-name').value;
        update_text_image(selectedText, document.querySelector('#cards-text'), document.querySelector('#card-Img'));
    })

    document.querySelector('#delete-button').addEventListener('click', (e) => {
        // Obtener el elemento select
        const select = document.querySelector('#card-to-midify');

        // Obtener el índice de la opción seleccionada
        const selectedIndex = select.selectedIndex;

        // Obtener el texto de la opción seleccionada
        const selectedText = select.options[selectedIndex].text;

        update({
            endpoint: "archivo/eliminar-dato",
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                session: sessionStorage.getItem('sessionId'),
                nombreArchivo: "data",
                campo: "cards." + selectedText,
            }
        });
    })

    const update_text = (field, path) => {

        //e.preventDefault();
        const newText = convertirMarkdownAHTML(document.querySelector("#" + field).value);

        update({
            endpoint: "archivo/editar-archivo",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                session: sessionStorage.getItem('sessionId'),
                nombreArchivo: "data",
                campo: path,
                valor: newText
            }
        });
    }

    const update_text_image = (cardName, textField, imgField) => {
        if (!cardName || !textField) {
            console.error('Faltan campos obligatorios.');
            return;
        }

        const formData = new FormData();

        formData.append("session", `${sessionStorage.sessionId}`);
        formData.append("nombreArchivo", "data");
        formData.append("campo", "cards." + cardName);
        formData.append("valor", JSON.stringify({
            "text": textField.value,
            "img": document.getElementById('prev-img').src
        }));

        if (imgField.files.length > 0) {
            formData.append("imagen", imgField.files[0]);
        } else {
            console.error('No se seleccionó ningún archivo de imagen.');
        }

        updateFormData('archivo/modificar-card-imagen', formData);

    };
}

const servicesForm = (services) => {
    let servicesOptions = '';
    for (let key in services) {
        servicesOptions += `
            <option value="${key}">${key}</option>
            `;
    }
    const html = `
    <div class="container">
        <form class="admin-form update-index-form"
        id="index-welcome-text">
        <label for="bacground-Img">Imagen de fondo</label>
            <div class="row disable">
                <input type="file" name="bacground-Img" id="bacground-Img" class="disable" accept="image/*">
                <img id="prev-bacground-img" src="/view/img/enfermera.png" alt="Haz clic para subir una imagen">
                <div class="buttons-horizontal-container">
                    <button type="submit">Actualizar</button>
                    <button type="reset">Resetear</button>
                </div>
            </div>
        </form>
        <form class="admin-form update-services-form" id="services-text">
            <label for="cards-text">administrar Servicios</label>
            <div class="row disable">
                <div id="servInfo" class="row disable">
                    <div style="display:flex; flex-direction:column; padding:0 5px; width:33%;">
                    <input class="disable" type="text"
                        name="service-name"
                        id="service-name"
                        placeholder="Nombre del servicio"
                        maxlength="30">
                        <input type="file" class="disable" name="serv-Img" id="serv-Img" accept="image/*">
                        <img id="prev-img" src="/view/img/enfermera.png" alt="Haz clic para subir una imagen">
                        <button id="new-func-button" style="padding:0 10px;">nueva funcion</button>
                    </div>
                    <div id="service-services" class="sixth-column">

                    </div>
                </div>
                
                <div class="horizontal-container">
                    <select name="service-action-select"
                        id="service-action-select">
                        <option value="update-service">actualizar un
                            Servicio</option>
                        <option value="create-service">crear un
                            Servicio</option>
                        <option value="delete-service">eliminar un
                            Servicio</option>
                    </select>

                    <select class='' name="service-to-modify"
                        id="service-to-modify">
                        <option value="null">selecciona un
                            Servicio</option>
                        ${servicesOptions}
                    </select>
                </div>

                <div class="buttons-horizontal-container">
                    <button id="update-button" type="submit">Actualizar</button>
                    <button id="create-button" class="disable" type="submit">Crear</button>
                    <button id="delete-button" class="disable" type="submit">Eliminar</button>
                    <button type="reset">Resetear</button>
                </div>
            </div>
        </form>
    </div>
`
    htmlUpdate(html);

    document.getElementById('prev-bacground-img').addEventListener('click', function () {
        document.getElementById('bacground-Img').click();
    });

    document.getElementById('bacground-Img').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('prev-bacground-img').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('prev-img').addEventListener('click', function () {
        document.getElementById('serv-Img').click();
    });

    document.getElementById('serv-Img').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('prev-img').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('service-to-modify').addEventListener('change', function () {
        if (this.value === 'null') {
            document.getElementById('servInfo').classList.add('disable');
            document.getElementById('service-name').classList.add('disable');
            return;
        }
        let servlist = '';
        for (let key in services[this.value].functions) {
            servlist += `
                <div class="row b-list service-info-row" id="data-${key}">
                    <input style=" margin: 0 auto;" class="mini-input service-info-title" type="text" value="${key}" placeholder="${key}">
                    <input style=" margin: 0 auto;" class="mini-input service-info-text" type="text" value="${services[this.value].functions[key]}" placeholder="${services[this.value].functions[key]}" maxlength="255">
                </div>
                `;
        }
        document.getElementById('servInfo').classList.remove('disable');
        document.getElementById('service-services').innerHTML = servlist;
        document.getElementById('prev-img').src = services[this.value].img;
        document.getElementById('service-name').value = this.value;

    })

    document.getElementById('service-action-select').addEventListener('change', function () {
        switch (this.value) {
            case 'update-service':
                document.getElementById('service-name').classList.add('disable');

                document.getElementById('update-button').classList.remove('disable');
                document.getElementById('create-button').classList.add('disable');
                document.getElementById('delete-button').classList.add('disable');
                document.getElementById('serv-Img').disabled = false;
                document.getElementById('service-services').classList.remove('disable');
                document.getElementById('new-func-button').classList.remove('disable');

                break;
            case 'create-service':
                document.getElementById('service-name').classList.remove('disable');
                document.getElementById('servInfo').classList.remove('disable');
                document.getElementById('update-button').classList.add('disable');
                document.getElementById('create-button').classList.remove('disable');
                document.getElementById('delete-button').classList.add('disable');
                document.getElementById('serv-Img').disabled = false;
                document.getElementById('service-name').readOnly = false;
                document.getElementById('service-services').classList.remove('disable');
                document.getElementById('new-func-button').classList.remove('disable');

                document.getElementById('new-func-button').click();
                break;
            case 'delete-service':

                document.getElementById('service-name').classList.remove('disable');
                document.getElementById('service-services').classList.add('disable');
                document.getElementById('service-name').readOnly = true;
                document.getElementById('serv-Img').disabled = true;
                document.getElementById('new-func-button').classList.add('disable');

                document.getElementById('update-button').classList.add('disable');
                document.getElementById('create-button').classList.add('disable');
                document.getElementById('delete-button').classList.remove('disable');
                break;
        }
    })

    document.getElementById('update-button').addEventListener('click', (e) => {

        const Nservicio = document.getElementById('service-name').value;
        const docFunc = document.querySelectorAll('.b-list');
        let functions = {};

        docFunc.forEach(element => {
            const title = element.querySelector('.service-info-title').value;
            const text = element.querySelector('.service-info-text').value;
            functions[title] = text;
        });

        console.log('servicio: \n' + Nservicio);
        console.log('functions: \n' + JSON.stringify(functions));

        update_text_image(Nservicio, functions, document.getElementById('serv-Img'));
    });

    document.getElementById('create-button').addEventListener('click', (e) => {

        const Nservicio = document.getElementById('service-name').value;
        const docFunc = document.querySelectorAll('.b-list');
        let functions = {};

        docFunc.forEach(element => {
            const title = element.querySelector('.service-info-title').value;
            const text = element.querySelector('.service-info-text').value;
            functions[title] = text;
        });

        console.log('servicio: \n' + Nservicio);
        console.log('functions: \n' + JSON.stringify(functions));

        update_text_image(Nservicio, functions, document.getElementById('serv-Img'));
    });

    document.getElementById('new-func-button').addEventListener('click', (e) => {
        e.preventDefault();
        let servlist = `
            <div class="row b-list service-info-row">
                <input style=" margin: 0 auto;" class="mini-input service-info-title" type="text" placeholder="nombre de la funcion">
                <input style=" margin: 0 auto;" class="mini-input service-info-text" type="text" placeholder="descripcion de la funcion" maxlength="255">
            </div>
            `;
        document.getElementById('service-services').innerHTML += servlist;
    });

    document.querySelector('#delete-button').addEventListener('click', (e) => {
        // Obtener el elemento select
        const select = document.querySelector('#service-to-modify').value;

        update({
            endpoint: "archivo/eliminar-dato",
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                session: sessionStorage.getItem('sessionId'),
                nombreArchivo: "data",
                campo: "services." + select,
            }
        });
    })



    const update_text_image = (serviceName, functionsField, imgField) => {
        if (!serviceName || !functionsField) {
            console.error('Faltan campos obligatorios.');
            return;
        }

        const formData = new FormData();

        formData.append("session", `${sessionStorage.sessionId}`);
        formData.append("nombreArchivo", "data");
        formData.append("campo", "services." + serviceName);
        formData.append("valor", JSON.stringify({
            "img": document.getElementById('prev-img').src,
            "functions": functionsField,
        }));

        if (imgField.files.length > 0) {
            formData.append("imagen", imgField.files[0]);
        } else {
            console.error('No se seleccionó ningún archivo de imagen.');
        }

        updateFormData('archivo/modificar-card-imagen', formData);

    };
}

const usForm = (us) => {
    const html = `
    <div class="container">
        <form class="admin-form update-index-form"
        id="index-welcome-text">
        <label for="bacground-Img">Imagen de fondo</label>
            <div class="row disable">
                <input type="file" name="bacground-Img" id="bacground-Img" class="disable" accept="image/*">
                <img id="prev-bacground-img" src="/view/img/enfermera.png" alt="Haz clic para subir una imagen">
                <div class="buttons-horizontal-container">
                    <button type="submit">Actualizar</button>
                    <button type="reset">Resetear</button>
                </div>
            </div>
        </form>
        <form class="admin-form update-us-form"
            id="hoWeAre">
            <label for="hoWeAre-text">Texto de Quienes somos</label>
            <div class="row disable">
                <textarea name="hoWeAre-text" id="hoWeAre-text-update"
                    placeholder="${us.hoWeAre}"></textarea>
                <div class="buttons-horizontal-container">
                    <button type="submit">Actualizar</button>
                    <button type="reset">Resetear</button>
                </div>
            </div>
        </form>

        <form class="admin-form update-us-form"
            id="ourHistory">
            <label for="ourHistory-text">Texto de Nuestra
                historia</label>
            <div class="row disable">
                <textarea name="ourHistory-text"
                    id="ourHistory-text-update"
                    placeholder="${us.ourHistory}"></textarea>
                <div class="buttons-horizontal-container">
                    <button type="submit">Actualizar</button>
                    <button type="reset">Resetear</button>
                </div>
            </div>
        </form>

        <form class="admin-form update-us-form"
            id="mission">
            <label for="mission-text">Texto de mision</label>
            <div class="row disable">
                <textarea name="mission-text"
                    id="mission-text-update"
                    placeholder="${us.mission}"></textarea>
                <div class="buttons-horizontal-container">
                    <button type="submit">Actualizar</button>
                    <button type="reset">Resetear</button>
                </div>
            </div>
        </form>

        <form class="admin-form update-us-form"
            id="vision">
            <label for="vision-text">Texto de vision</label>
            <div class="row disable">
                <textarea name="vision-text"
                    id="vision-text-update"
                    placeholder="${us.vision}"></textarea>
                <div class="buttons-horizontal-container">
                    <button type="submit">Actualizar</button>
                    <button type="reset">Resetear</button>
                </div>
            </div>
        </form>

        <form class="admin-form update-us-form"
            id="ourPhilosophy">
            <label for="ourPhilosophy-text">Texto de nuestra
                filosofia</label>
            <div class="row disable">
                <textarea name="ourPhilosophy-text"
                    id="ourPhilosophy-text-update"
                    placeholder="${us.ourPhilosophy}"></textarea>
                <div class="buttons-horizontal-container">
                    <button type="submit">Actualizar</button>
                    <button type="reset">Resetear</button>
                </div>
            </div>
        </form>

        <form class="admin-form update-us-form"
            id="ourValues">
            <label for="ourValues-text">Texto de nuestros
                valores</label>
            <div class="row disable">
                <textarea name="ourValues-text"
                    id="ourValues-text-update"
                    placeholder="${us.ourValues}"></textarea>
                <div class="buttons-horizontal-container">
                    <button type="submit">Actualizar</button>
                    <button type="reset">Resetear</button>
                </div>
            </div>
        </form>

        <form class="admin-form update-us-form"
            id="ourCommitments">
            <label for="ourCommitments-text">Texto de nuestros
                compromisos</label>
            <div class="row disable">
                <textarea name="ourCommitments-text"
                    id="ourCommitments-text-update"
                    placeholder="${us.ourCommitments}"></textarea>
                <div class="buttons-horizontal-container">
                    <button type="submit">Actualizar</button>
                    <button type="reset">Resetear</button>
                </div>
            </div>
        </form>
    </div>
`
    htmlUpdate(html);

    document.getElementById('prev-bacground-img').addEventListener('click', function () {
        document.getElementById('bacground-Img').click();
    });

    document.getElementById('bacground-Img').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('prev-bacground-img').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    const upForms = document.querySelectorAll('.update-us-form');

    upForms.forEach(form => {
        const id = form.querySelector('textarea').id;
        form.addEventListener('submit', () => {
            update_text(id, 'longText.' + form.id);
        })
    });

    const update_text = (field, path) => {

        //e.preventDefault();
        const newText = convertirMarkdownAHTML(document.querySelector("#" + field).value);

        update({
            endpoint: "archivo/editar-archivo",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                session: sessionStorage.getItem('sessionId'),
                nombreArchivo: "data",
                campo: path,
                valor: newText
            }
        });
    }
}

const testimoniesForm = (testimonies, services) => {
    let testimoniesOptions = '';
    let testimoniesPilars = '';
    for (let key in testimonies) {
        testimoniesOptions += `
            <option value="${key}">${testimonies[key].client}</option>
            `;
    }

    for (let key in services) {
        testimoniesPilars += `
            <option value="${key}">${key}</option>
            `;
    }

    const html = `
        <div class="container">
            <form class="admin-form update-index-form"
            id="index-welcome-text">
            <label for="bacground-Img">Imagen de fondo</label>
                <div class="row disable">
                    <input type="file" name="bacground-Img" id="bacground-Img" class="disable" accept="image/*">
                    <img id="prev-bacground-img" src="/view/img/enfermera.png" alt="Haz clic para subir una imagen">
                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>
            <form class="admin-form update-testimonies-form"
                id="testimonies-text">
                <label for="testimonies-text">Administrar
                    Testimonios</label>
                <div class="row disable">

                    <div class="row">
                        <select class="mini-input" type="text"
                            name="new-testimonie-pilar"
                            id="testimonie-pilar">
                            <option value = "">elige un pilar</option>
                            ${testimoniesPilars}
                        </select>

                        <input class="mini-input" type="text"
                            name="new-testimonie-client"
                            id="testimonie-client"
                            placeholder="nombre del cliente en el testimonio">

                        <select class="mini-input" type="text"
                            name="new-testimonie-service"
                            id="pilar-services">
                            <option value>seleccione un pilar de servicio</option>
                        </select>

                        <input class="mini-input" type="text"
                            name="new-testimonie-videoLink"
                            id="testimonie-videoLink"
                            placeholder="link del video para el testimonio">

                    </div>
                    <iframe width="560" height="315"
                    src=""
                    title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    id="video-frame"
                    class="disable"
                    ></iframe>

                    <div class="horizontal-container">
                        <select name="card-action-select"
                            id="card-action-select">
                            <option value="update-card">actualizar un
                                Testimonio</option>
                            <option value="create-card">crear un
                                Testimonio</option>
                            <option value="delete-card">eliminar un
                                Testimonio</option>
                        </select>

                        <select name="card-to-midify"
                            id="card-to-midify">
                            <option value="">selecciona un
                                Testimonio</option>
                            ${testimoniesOptions};
                        </select>
                    </div>

                    <div class="buttons-horizontal-container">
                        <button id="update-button" type="submit">Actualizar</button>
                        <button id="create-button" class="disable" type="submit">Crear</button>
                        <button id="delete-button" class="disable" type="submit">Eliminar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

        </div>
    `
    htmlUpdate(html);

    document.getElementById('prev-bacground-img').addEventListener('click', function () {
        document.getElementById('bacground-Img').click();
    });

    document.getElementById('bacground-Img').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('prev-bacground-img').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    const upB = document.getElementById('update-button');
    const crB = document.getElementById('create-button');
    const dtB = document.getElementById('delete-button');
    const tp = document.getElementById('testimonie-pilar');
    const ps = document.getElementById('pilar-services');
    const tc = document.getElementById('testimonie-client');
    const tv = document.getElementById('testimonie-videoLink');

    document.getElementById('card-action-select').addEventListener('change', function () {
        switch (this.value) {
            case 'update-card':
                upB.classList.remove('disable');
                crB.classList.add('disable');
                dtB.classList.add('disable');
                document.getElementById('card-to-midify').classList.remove('disable');
                break;
            case 'create-card':
                document.getElementById('card-to-midify').classList.add('disable');
                upB.classList.add('disable');
                crB.classList.remove('disable');
                dtB.classList.add('disable');
                break;
            case 'delete-card':
                upB.classList.add('disable');
                crB.classList.add('disable');
                dtB.classList.remove('disable');
                document.getElementById('card-to-midify').classList.remove('disable');
                break;
        };
    });

    document.getElementById('card-to-midify').addEventListener('change', function () {
        const f = document.querySelector('#video-frame');

        if (this.value !== "") {
            const event = new Event('change');
            f.src = testimonies[this.value].videoLink;
            f.classList.remove('disable');
            tp.value = testimonies[this.value].servProv;
            tp.dispatchEvent(event);
            setTimeout(ps.value = testimonies[this.value].service, 500);
            tc.value = testimonies[this.value].client;
            tv.value = obtenerEnlacePublico(f.src);

        } else {
            f.classList.add('disable');
        }
    });

    document.getElementById('testimonie-pilar').addEventListener('change', function () {
        let ps = document.getElementById('pilar-services');
        ps.innerHTML = '';
        ps.innerHTML = getPilarServices(this.value);
    });

    document.getElementById('testimonie-videoLink').addEventListener('change', function () {
        const f = document.querySelector('#video-frame');
        if (this.value !== "") {
            try {
                f.src = obtenerEnlaceDeInsercion(this.value)
                f.classList.remove('disable');
            } catch (error) {
                alert("El link proporcionado no coincide con el formato.\n\nVerifica que sea el link que encuentras en la barra de busqueda al reproduvir el video en youtube")
                f.classList.add('disable');
            }
        } else {
            f.classList.add('disable');
        }
    })

    upB.addEventListener('click', (e) => {
        update_text(document.getElementById('card-to-midify').value);
    });

    crB.addEventListener('click', (e) => {
        update_text(document.getElementById(-1));
    });

    dtB.addEventListener('click', (e) => {
        // Obtener el elemento select
        const select = document.querySelector('#card-to-midify').value;

        update({
            endpoint: "archivo/eliminar-dato",
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                session: sessionStorage.getItem('sessionId'),
                nombreArchivo: "data",
                campo: "testimonies." + select,
            }
        });
    })

    const getPilarServices = (pilar) => {
        let pilarServices = '';
        if (pilar !== "") {
            for (let key in services[pilar].functions) {
                pilarServices += `
                <option value="${key}">${key}</option>
                `;
            }
        } else {
            pilarServices += `
                <option value="">seleccione un pilar de servicio</option>
                `;
        }
        return pilarServices;
    }

    const obtenerEnlaceDeInsercion = (enlacePublico) => {
        // Extraer el ID del video
        const url = new URL(enlacePublico);
        const videoId = url.searchParams.get("v");

        // Construir el enlace de inserción
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        } else {
            throw new Error("Enlace público no válido");
        }
    }

    const obtenerEnlacePublico = (enlaceDeInsercion) => {
        // Extraer el ID del video del enlace de inserción
        const url = new URL(enlaceDeInsercion);
        const videoId = url.pathname.split("/").pop();

        // Construir el enlace público
        if (videoId) {
            return `https://www.youtube.com/watch?v=${videoId}`;
        } else {
            throw new Error("Enlace de inserción no válido");
        }
    }

    const update_text = (tetimonieId) => {
        console.log("id a actualizar: " + tetimonieId);
        console.log("¿Existe este id? " + testimonies.hasOwnProperty(tetimonieId));
        console.log("Cantidad de testimonios: " + Object.keys(testimonies).length);
        if (!testimonies.hasOwnProperty(tetimonieId)) {
            tetimonieId = Object.keys(testimonies).length + 1;
        }
        const formData = new FormData();

        formData.append("session", `${sessionStorage.sessionId}`);
        formData.append("nombreArchivo", "data");
        formData.append("campo", "testimonies." + tetimonieId);
        formData.append("valor", JSON.stringify({
            "client": tc.value,
            "servProv": tp.value,
            "service": ps.value,
            "videoLink": obtenerEnlaceDeInsercion(tv.value)
        }));

        updateFormData('archivo/modificar-card-imagen', formData);
    };

}

const contactForm = (contact) => {
    const html = `
    <div class="container">
        <form class="admin-form update-us-form"
            id="contact-text">
            <label>Contacto</label>
            <div class="row">
                <input type="text" name="address-text"
                    id="address-text-update"
                    placeholder="Direccion" value="${contact.address}"></input>

                <input type="number" name="phone-text"
                id="phone-text-update"
                placeholder="Telefono" value="${parseInt(contact.Phone)}"></input>

                <input type="email" name="email-text"
                id="email-text-update"
                placeholder="Correo" value="${contact.Email}"></input>

                <input type="text" name="hours-text"
                id="hours-text-update"
                placeholder="Horario" value="${contact.Hours}"></input>

                <div class="buttons-horizontal-container">
                    <button id="update-button" type="submit">Actualizar</button>
                    <button type="reset">Resetear</button>
                </div>
            </div>
        </form>
    </div>
`
    htmlUpdate(html);

    document.getElementById('update-button').addEventListener('click', (e) => {
        update_text();
    })

    const update_text = () => {
        const ad = document.getElementById('address-text-update').value !== "" ? document.getElementById('address-text-update').value : contact.address;
        const ph = document.getElementById('phone-text-update').value !== "" ? document.getElementById('phone-text-update').value : contact.Phone;
        const em = document.getElementById('email-text-update').value !== "" ? document.getElementById('email-text-update').value : contact.Email;
        const ho = document.getElementById('hours-text-update').value !== "" ? document.getElementById('hours-text-update').value : contact.Hours;


        const formData = new FormData();

        formData.append("session", `${sessionStorage.sessionId}`);
        formData.append("nombreArchivo", "data");
        formData.append("campo", "contact");
        formData.append("valor", JSON.stringify({
            "address": ad,
            "Phone": parseInt(ph),
            "Email": em,
            "Hours": ho
        }));

        updateFormData('archivo/modificar-card-imagen', formData);
    };

}

export { getAdmin, insertform };