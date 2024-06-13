import { getData, getStats, getAny, update, updateFormData } from "../utils/utils_api.js";
import { convertirMarkdownAHTML } from "../utils/text_handler.js";
let forms = {}

const getAdmin = (document) => {
    getData().then(data => {
        forms.stats = () => stats();

        forms.indexForm = () => indexForm(data.data.longText, data.data.cards, data.data.backgrounds);

        forms.servicesForm = () => servicesForm(data.data.services, data.data.backgrounds);

        forms.usForm = () => usForm(data.data.longText, data.data.backgrounds);

        forms.testimoniesForm = () => testimoniesForm(data.data.testimonies, data.data.services, data.data.backgrounds);

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

const stats = async () => {
    const checkWathsapp = async () => {
        if (document.getElementById('whatsapp-info')) {
            console.log('checking whatsapp');
            getAny('whatsapp/qr-code').then(result => {
                const data = result.data;
                const field = document.getElementById('whatsapp-info');
                const close_whatsapp = document.getElementById('close_whatsapp');

                close_whatsapp.addEventListener('click', () => {
                    update({
                        endpoint: "whatsapp/whatsapp-session",
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: {
                            session: sessionStorage.getItem('sessionId')
                        }
                    });

                    setTimeout(() => {
                        checkWathsapp();
                    }, 5000)
                });

                if (data.status !== 'fail') {
                    field.querySelector('#whatsapp_img').innerHTML = '';
                    field.querySelector('#whatsapp_img').innerHTML = data.img;
                }
                if (data.status === 'logged') {
                    close_whatsapp.classList.remove('disable');
                } else if (data.status === 'stand-by') {
                    close_whatsapp.classList.add('disable');
                    setTimeout(checkWathsapp, 5000); // Guardar el ID del intervalo
                }

            }).catch(error => {
                console.error('Error al obtener datos:', error);
            })
        }
    }

    getStats().then(result => {
        const dateCounts = result.data.views;
        const socialCounts = {
            "facebook": result.data.facebook,
            "instagram": result.data.instagram,
            "whatsapp": result.data.whatsapp,
            "gmail": result.data.gmail,
        }
        const pagesCount = {
            "servicios": result.data.servicios,
            "testimonios": result.data.testimonios,
            "nosotros": result.data.nosotros
        }
        const monthCounts = {
            'enero': 0,
            'febrero': 0,
            'marzo': 0,
            'abril': 0,
            'mayo': 0,
            'junio': 0,
            'julio': 0,
            'agosto': 0,
            'septiembre': 0,
            'octubre': 0,
            'noviembre': 0,
            'diciembre': 0
        };
        const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

        const currentYear = new Date().getFullYear();

        function convertDateFormat(date) {
            const [day, month, year] = date.split('/');
            return `${month}/${day}/${year}`;
        }

        // Recorre cada fecha en los datos
        for (const date in dateCounts) {
            // Crea un objeto de fecha a partir de la cadena de fecha
            const dateObj = new Date(convertDateFormat(date));

            // Verifica si el año de la fecha es el año actual
            if (dateObj.getFullYear() === currentYear) {
                // Extrae el mes de la fecha (recuerda que los meses en JavaScript van de 0 a 11)
                const month = dateObj.getMonth();

                // Suma el conteo de visitas al mes correspondiente
                monthCounts[monthNames[month]] += dateCounts[date];
            }
        }

        // Ordena las fechas en orden descendente
        const sortedDates = Object.keys(dateCounts);

        // Toma solo los primeros diez elementos
        const lastEightDates = sortedDates.slice(0, 8);
        // Toma solo los primeros 12 mese

        // Crea un nuevo objeto con las fechas y sus conteos correspondientes
        const lastEightDateCounts = {};
        for (const date of lastEightDates) {
            lastEightDateCounts[date] = dateCounts[date];
        }

        const currentMonth = new Date().getMonth();
        const passMonth = currentMonth - 1;

        const html = `
        <section class="container stats">                
            <div id="grafics">
                <span class="mid-table">
                    <canvas id="DayGraf" width="400" height="200"></canvas>
                </span>
                <span class="mid-table">
                    <canvas id="monthGraf" width="400" height="200"></canvas>
                </span>
                <span class="big-table">
                    <canvas id="TowMonthGraf" width="400" height="200"></canvas>
                </span>
                <span class="mini-table">
                    <canvas id="SocialGraf" width="400" height="200"></canvas>
                </span>
                <span class="mini-table">
                    <canvas id="PagesGraf" width="400" height="200"></canvas>
                </span>
            </div>
            <div id="whatsapp-info">
                <div id="whatsapp_img"></div>
                <div id="close_whatsapp"><h1>Cerrar Sesion</h1> </div>
            </div>
        </section>
        `
        htmlUpdate(html);

        checkWathsapp();


        // Obtener el contexto del canvas
        const DayGraf = document.getElementById('DayGraf').getContext('2d');
        const monthGraf = document.getElementById('monthGraf').getContext('2d');
        const TowMonthGraf = document.getElementById('TowMonthGraf').getContext('2d');
        const SocialGraf = document.getElementById('SocialGraf').getContext('2d');
        const PagesGraf = document.getElementById('PagesGraf').getContext('2d');

        // Crear un nuevo gráfico
        const monthChart = new Chart(monthGraf, {
            type: 'line', // Tipo de gráfico: bar, line, pie, etc.
            data: {
                labels: Object.keys(monthCounts),
                datasets: [{
                    label: 'visitas en el año',
                    data: Object.values(monthCounts),
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
            }
        });

        // Crear un nuevo gráfico
        const DayChart = new Chart(DayGraf, {
            type: 'line', // Tipo de gráfico: bar, line, pie, etc.
            data: {
                labels: Object.keys(lastEightDateCounts),
                datasets: [{
                    label: 'visitas Ultimos Diez Dias',
                    data: Object.values(lastEightDateCounts),
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
            }
        });

        // Crear un nuevo gráfico
        const TowMonthChart = new Chart(TowMonthGraf, {
            type: 'bar', // Tipo de gráfico: bar, line, pie, etc.
            data: {
                labels: [monthNames[passMonth], monthNames[currentMonth]], // Etiquetas para cada segmento del gráfico de pastel
                datasets: [{
                    label: 'Visitas de los últimos dos meses',
                    data: [monthCounts[monthNames[passMonth]], monthCounts[monthNames[currentMonth]]], // Datos para cada segmento del gráfico de pastel
                    backgroundColor: ['rgba(255, 99, 132)', 'rgba(54, 162, 235)'], // Colores de fondo para cada segmento
                    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'], // Colores de borde para cada segmento
                    borderWidth: 1 // Ancho del borde para cada segmento
                }]
            },
            options: {
                responsive: true, // Asegura que el gráfico se redimensione correctamente en diferentes tamaños de pantalla
                plugins: {
                    legend: {
                        position: 'top', // Posición de la leyenda
                    },
                    title: {
                        display: false, // Muestra un título para el gráfico
                        text: 'Visitas de los últimos dos meses' // Texto del título
                    }
                }
            }
        });

        // Crear un nuevo gráfico
        const SocialChart = new Chart(SocialGraf, {
            type: 'pie',
            data: {
                labels: Object.keys(socialCounts),
                datasets: [{
                    label: 'Social Media Counts',
                    data: Object.values(socialCounts),
                    backgroundColor: [
                        'rgba(59, 89, 152, 0.6)', // Facebook color
                        'rgba(225, 48, 108, 0.6)', // Instagram color
                        'rgba(37, 211, 102, 0.6)', // WhatsApp color
                        'rgba(219, 68, 55, 0.6)'   // Gmail color
                    ],
                    borderColor: [
                        'rgba(59, 89, 152, 1)',
                        'rgba(225, 48, 108, 1)',
                        'rgba(37, 211, 102, 1)',
                        'rgba(219, 68, 55, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.raw;
                                return label;
                            }
                        }
                    }
                }
            }
        });

        // Crear un nuevo gráfico
        const PagesChart = new Chart(PagesGraf, {
            type: 'pie',
            data: {
                labels: Object.keys(pagesCount),
                datasets: [{
                    label: 'Social Media Counts',
                    data: Object.values(pagesCount),
                    backgroundColor: [
                        'rgba(18,152,14, 0.6)',
                        'rgba(70,130,180, 0.6)',
                        'rgba(255,165,0, 0.6)',
                    ],
                    borderColor: [
                        'rgba(18,152,14, 1)',
                        'rgba(70,130,180, 1)',
                        'rgba(255,165,0, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.raw;
                                return label;
                            }
                        }
                    }
                }
            }
        });


    }).catch(error => {
        console.error('Error al obtener datos:', error);
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

const indexForm = (longText, cards, backgrounds) => {
    let cardOptions = '';

    for (let key in cards) {
        cardOptions += `
            <option value="${cards[key].text}">${key}</option>
            `;
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

    const html = `
        <div class="container">
            <form class="admin-form update-index-form"
            id="change-background">
            <label for="bacground-Img">Imagen de fondo</label>
                <div class="row disable">
                    <input type="file" name="bacground-Img" id="bacground-Img" class="disable" accept="image/*">
                    <img id="prev-bacground-img" src="${backgrounds.bg001}" alt="Haz clic para subir una imagen">
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

            <form class="admin-form update-index-form" id="index-Video">
                <label for="video-Link">Video</label>
                <div class="row disable">
                    <div class="column-flow">
                        <input class="mini-input" type="text"
                        name="video-Link"
                        id="video-Link"
                        placeholder="link del video"
                        value="${obtenerEnlacePublico(longText.nextToVideoLink)}">
                        
                        <iframe width="560" height="315"
                        src="${longText.nextToVideoLink}"
                        title="YouTube video player" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        id="video-frame"
                        ></iframe>
                    </div>
                    <div class="buttons-horizontal-container">
                        <button type="submit" id="update-button">Actualizar</button>
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
                        <button class="" id="update-b" type="submit">Actualizar</button>
                        <button class="disable" id="create-button" type="submit">Crear</button>
                        <button class="disable" id="delete-button" type="submit">Eliminar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>
        </div>
    `

    htmlUpdate(html);

    document.getElementById('video-Link').addEventListener('change', function () {
        const frame = document.getElementById('video-frame');
        if (this.value !== "") {
            frame.src = obtenerEnlaceDeInsercion(this.value);
            frame.classList.remove("disable");
        }
    })

    document.getElementById('index-Video').addEventListener('change', () => {
        document.getElementById('video-Link').value = obtenerEnlaceDeInsercion(document.getElementById('video-Link').value);
        update_text('video-Link', 'longText.nextToVideoLink')
    })

    document.getElementById('change-background').addEventListener('submit', async (e) => {

        const imgField = document.querySelector('#bacground-Img');
        const session = sessionStorage.getItem('sessionId');

        if (!session) {
            console.error('No hay sesión iniciada.');
            return;
        }

        const formData = new FormData();

        const backgroundField = 'bg001' // Nuevo campo para especificar qué background cambiar
        const prevBackgroundImg = document.getElementById('prev-bacground-img').src;

        formData.append("session", session);
        formData.append("nombreArchivo", "data");
        formData.append("campo", `backgrounds.${backgroundField}`);
        formData.append("valor", JSON.stringify({ [backgroundField]: prevBackgroundImg }));

        if (imgField.files.length > 0) {
            formData.append("imagen", imgField.files[0]);
        } else {
            console.error('No se seleccionó ningún archivo de imagen.');
            return;
        }

        updateFormData('archivo/modificar-imagen', formData);
    });

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
        const upButton = document.querySelector('#update-b');
        const creB = document.querySelector('#create-button');
        const delB = document.querySelector('#delete-button');

        const cardSelect = document.querySelector('#card-to-midify');
        const cardInfo = document.getElementById('cardInfo');
        const NeCardNa = document.getElementById('new-card-name');


        switch (this.value) {
            case 'update-card':
                upButton.classList.remove('disable');
                creB.classList.add('disable');
                delB.classList.add('disable');
                cardSelect.classList.remove('disable');
                NeCardNa.classList.add('disable');
                document.querySelector('#cards-text').readOnly = false;
                document.querySelector('#card-Img').disabled = false;

                cardSelect.value === "" ? cardInfo.classList.add('disable') : cardInfo.classList.remove('disable');

                break;
            case 'create-card':
                upButton.classList.add('disable');
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
                upButton.classList.add('disable');
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

    document.getElementById('update-b').addEventListener('click', (e) => {
        //e.preventDefault();
        // Obtener el elemento select
        const select = document.querySelector('#card-to-midify');

        // Obtener el índice de la opción seleccionada
        const selectedIndex = select.selectedIndex;

        // Obtener el texto de la opción seleccionada
        const selectedText = select.options[selectedIndex].text;
        update_text_image(selectedText, document.querySelector('#cards-text'), document.querySelector('#card-Img'));
    })

    document.querySelector('#create-button').addEventListener('click', (e) => {
        //e.preventDefault();

        const selectedText = document.querySelector('#new-card-name').value;
        update_text_image(selectedText, document.querySelector('#cards-text'), document.querySelector('#card-Img'));
    })

    document.querySelector('#delete-button').addEventListener('click', (e) => {
        //e.preventDefault();
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

}

const servicesForm = (services, backgrounds) => {
    let servicesOptions = '';
    for (let key in services) {
        servicesOptions += `
            <option value="${key}">${key}</option>
            `;
    }
    const html = `
    <div class="container">
        <form class="admin-form update-index-form"
        id="change-background">
        <label for="bacground-Img">Imagen de fondo</label>
            <div class="row disable">
                <input type="file" name="bacground-Img" id="bacground-Img" class="disable" accept="image/*">
                <img id="prev-bacground-img" src="${backgrounds.bg002}" alt="Haz clic para subir una imagen">
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

    document.getElementById('change-background').addEventListener('submit', async (e) => {

        const imgField = document.querySelector('#bacground-Img');
        const session = sessionStorage.getItem('sessionId');

        if (!session) {
            console.error('No hay sesión iniciada.');
            return;
        }

        const formData = new FormData();

        const backgroundField = 'bg002' // Nuevo campo para especificar qué background cambiar
        const prevBackgroundImg = document.getElementById('prev-bacground-img').src;

        formData.append("session", session);
        formData.append("nombreArchivo", "data");
        formData.append("campo", `backgrounds.${backgroundField}`);
        formData.append("valor", JSON.stringify({ [backgroundField]: prevBackgroundImg }));

        if (imgField.files.length > 0) {
            formData.append("imagen", imgField.files[0]);
        } else {
            console.error('No se seleccionó ningún archivo de imagen.');
            return;
        }

        updateFormData('archivo/modificar-imagen', formData);
    });

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

const usForm = (us, backgrounds) => {
    const html = `
    <div class="container">
        <form class="admin-form update-index-form"
        id="change-background">
        <label for="bacground-Img">Imagen de fondo</label>
            <div class="row disable">
                <input type="file" name="bacground-Img" id="bacground-Img" class="disable" accept="image/*">
                <img id="prev-bacground-img" src="${backgrounds.bg003}" alt="Haz clic para subir una imagen">
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

    document.getElementById('change-background').addEventListener('submit', async (e) => {

        const imgField = document.querySelector('#bacground-Img');
        const session = sessionStorage.getItem('sessionId');

        if (!session) {
            console.error('No hay sesión iniciada.');
            return;
        }

        const formData = new FormData();

        const backgroundField = 'bg003' // Nuevo campo para especificar qué background cambiar
        const prevBackgroundImg = document.getElementById('prev-bacground-img').src;

        formData.append("session", session);
        formData.append("nombreArchivo", "data");
        formData.append("campo", `backgrounds.${backgroundField}`);
        formData.append("valor", JSON.stringify({ [backgroundField]: prevBackgroundImg }));

        if (imgField.files.length > 0) {
            formData.append("imagen", imgField.files[0]);
        } else {
            console.error('No se seleccionó ningún archivo de imagen.');
            return;
        }

        updateFormData('archivo/modificar-imagen', formData);
    });

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

const testimoniesForm = (testimonies, services, backgrounds) => {
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
            id="change-background">
            <label for="bacground-Img">Imagen de fondo</label>
                <div class="row disable">
                    <input type="file" name="bacground-Img" id="bacground-Img" class="disable" accept="image/*">
                    <img id="prev-bacground-img" src="${backgrounds.bg004}" alt="Haz clic para subir una imagen">
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

    document.getElementById('change-background').addEventListener('submit', async (e) => {

        const imgField = document.querySelector('#bacground-Img');
        const session = sessionStorage.getItem('sessionId');

        if (!session) {
            console.error('No hay sesión iniciada.');
            return;
        }

        const formData = new FormData();

        const backgroundField = 'bg004' // Nuevo campo para especificar qué background cambiar
        const prevBackgroundImg = document.getElementById('prev-bacground-img').src;

        formData.append("session", session);
        formData.append("nombreArchivo", "data");
        formData.append("campo", `backgrounds.${backgroundField}`);
        formData.append("valor", JSON.stringify({ [backgroundField]: prevBackgroundImg }));

        if (imgField.files.length > 0) {
            formData.append("imagen", imgField.files[0]);
        } else {
            console.error('No se seleccionó ningún archivo de imagen.');
            return;
        }

        updateFormData('archivo/modificar-imagen', formData);
    });

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

                <input type="text" name="facebook-text"
                id="facebook-text-update"
                placeholder="Horario" value="${contact.Facebook}"></input>

                <input type="text" name="instagram-text"
                id="instagram-text-update"
                placeholder="Horario" value="${contact.Instagram}"></input>

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
        const fa = document.getElementById('hours-text-update').value !== "" ? document.getElementById('facebook-text-update').value : contact.Facebook;
        const ins = document.getElementById('hours-text-update').value !== "" ? document.getElementById('instagram-text-update').value : contact.Instagram;


        const formData = new FormData();

        formData.append("session", `${sessionStorage.sessionId}`);
        formData.append("nombreArchivo", "data");
        formData.append("campo", "contact");
        formData.append("valor", JSON.stringify({
            "address": ad,
            "Phone": parseInt(ph),
            "Email": em,
            "Facebook": fa,
            "Instagram": ins,
            "Hours": ho
        }));

        updateFormData('archivo/modificar-card-imagen', formData);
    };

}

export { getAdmin, insertform };