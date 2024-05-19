import { getData } from "../utils/utils_api.js";
let forms = {}

const getAdmin = (document) => {
    getData().then(data => {
        let cardOptions = '';
        for (let key in data.data.longText.cardText) {
            cardOptions += `
            <option value="${data.data.longText.cardText[key]}">${key}</option>
            `;
        }

        forms.indexForms = `
        <div class="container">
            <form class="admin-form update-index-form"
                id="index-welcome-text"
                method="post">
                <label for="welcome-text">Texto de bienvenida</label>
                <div class="row disable">
                    <textarea name="welcome-text" id="welcome-text-update"
                        placeholder="${data.data.longText.welcomeText}"></textarea>
                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

            <form class="admin-form update-index-form"
                id="index-nextToVideo"
                method="post">
                <label for="nextToVideo">Texto del video</label>
                <div class="row disable">
                    <textarea name="nextToVideo-text"
                        id="nextToVideo-text-update"
                        placeholder="${data.data.longText.nextToVideo}"></textarea>
                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

            <form class="admin-form update-index-form" id="index-whyUs-text"
                method="post">
                <label for="whyUs-text">Texto ¿por que elegirnos?</label>
                <div class="row disable">
                    <textarea name="whyUs-text" id="whyUs-text-update"
                        placeholder="${data.data.longText.whyUs}"></textarea>
                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

            <form class="admin-form update-index-form" id="index-cards-text"
                method="post">
                <label for="cards-text">Texto para cartas de puntos
                    positivos</label>
                <div class="row disable">
                    <textarea name="welcome-text" id="welcome-text-update"
                        placeholder="texto de explicacion de la carta"></textarea>
                    <div class="horizontal-container">
                        <select name="card-action-select"
                            id="card-action-select">
                            <option value="null">actualizar una
                                carta</option>
                            <option value="create-card">crear una
                                carta</option>
                            <option value="delete-card">eliminar una
                                carta</option>
                        </select>

                        <select name="card-to-midify"
                            id="card-to-midify">
                            <option value="null">selecciona una
                                carta</option>
                            ${cardOptions}
                        </select>

                        <input class="disable mini-input" type="text"
                            name="new-card-name"
                            placeholder="titulo para la nueva carta"
                            maxlength="30">
                    </div>

                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button class="disable" type="submit">Crear</button>
                        <button class="disable"
                            type="button">Eliminar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

            <form class="admin-form" id="submit-all" method="post">
                <label>Aplicar todos los cambios</label>
                <div class="buttons-horizontal-container">
                    <button type="submit">Actualizar todo</button>
                    <button type="reset">Resetear todo</button>
                </div>
            </form>
        </div>
    `
        forms.servicesForms = `
        <div class="container">
            <form class="admin-form update-services-form" id="services-text"
                method="post">
                <label for="cards-text">administrar Servicios</label>
                <div class="row disable">
                    <textarea name="services-text" id="services-text-update"
                        placeholder="texto de explicacion de la carta"></textarea>
                    <div class="horizontal-container">
                        <select name="service-action-select"
                            id="service-action-select">
                            <option value="null">actualizar un
                                Servicio</option>
                            <option value="create-card">crear un
                                Servicio</option>
                            <option value="delete-card">eliminar un
                                Servicio</option>
                        </select>

                        <select name="service-to-midify"
                            id="service-to-midify">
                            <option value="null">selecciona un
                                Servicio</option>
                            <option value="null">selecciona un
                                Servicio</option>
                        </select>

                        <input class="disable mini-input" type="text"
                            name="new-service-name"
                            placeholder="titulo para la nueva carta"
                            maxlength="30">
                    </div>

                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button class="disable" type="submit">Crear</button>
                        <button class="disable"
                            type="button">Eliminar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>
            <form class="admin-form" id="submit-all" method="post">
                <label>Aplicar todos los cambios</label>
                <div class="buttons-horizontal-container">
                    <button type="submit">Actualizar todo</button>
                    <button type="reset">Resetear todo</button>
                </div>
            </form>
        </div>
    `
        forms.usForms = `
        <div class="container">
            <form class="admin-form update-us-form"
                id="hoWeAre-text"
                method="post">
                <label for="hoWeAre-text">Texto de Quienes somos</label>
                <div class="row disable">
                    <textarea name="hoWeAre-text" id="hoWeAre-text-update"
                        placeholder="texto de quienes somos"></textarea>
                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

            <form class="admin-form update-us-form"
                id="ourHistory-text"
                method="post">
                <label for="ourHistory-text">Texto de Nuestra
                    historia</label>
                <div class="row disable">
                    <textarea name="ourHistory-text"
                        id="ourHistory-text-update"
                        placeholder="texto de nuestra historia somos"></textarea>
                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

            <form class="admin-form update-us-form"
                id="ourHistory-text"
                method="post">
                <label for="ourHistory-text">Texto de mision</label>
                <div class="row disable">
                    <textarea name="mission-text"
                        id="mission-text-update"
                        placeholder="texto de nuestra mision"></textarea>
                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

            <form class="admin-form update-us-form"
                id="mission-text"
                method="post">
                <label for="mission-text">Texto de mision</label>
                <div class="row disable">
                    <textarea name="mission-text"
                        id="mission-text-update"
                        placeholder="texto de nuestra mision"></textarea>
                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

            <form class="admin-form update-us-form"
                id="vision-text"
                method="post">
                <label for="vision-text">Texto de vision</label>
                <div class="row disable">
                    <textarea name="vision-text"
                        id="vision-text-update"
                        placeholder="texto de nuestra vision"></textarea>
                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

            <form class="admin-form update-us-form"
                id="ourPhilosophy-text"
                method="post">
                <label for="ourPhilosophy-text">Texto de nuestra
                    filosofia</label>
                <div class="row disable">
                    <textarea name="ourPhilosophy-text"
                        id="ourPhilosophy-text-update"
                        placeholder="texto de nuestra filosofia"></textarea>
                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

            <form class="admin-form update-us-form"
                id="ourValues-text"
                method="post">
                <label for="ourValues-text">Texto de nuestros
                    valores</label>
                <div class="row disable">
                    <textarea name="ourValues-text"
                        id="ourValues-text-update"
                        placeholder="texto de nuestros valores"></textarea>
                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

            <form class="admin-form update-us-form"
                id="ourCommitments-text"
                method="post">
                <label for="ourCommitments-text">Texto de nuestros
                    compromisos</label>
                <div class="row disable">
                    <textarea name="ourCommitments-text"
                        id="ourCommitments-text-update"
                        placeholder="texto de nuestros compromisos"></textarea>
                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>
            <form class="admin-form" id="submit-all" method="post">
                <label>Aplicar todos los cambios</label>
                <div class="buttons-horizontal-container">
                    <button type="submit">Actualizar todo</button>
                    <button type="reset">Resetear todo</button>
                </div>
            </form>
        </div>
    `
        forms.testimoniesForm = `
        <div class="container">
            <form class="admin-form update-testimonies-form"
                id="testimonies-text"
                method="post">
                <label for="testimonies-text">Administrar
                    Testimonios</label>
                <div class="row disable">

                    <div class="horizontal-container">
                        <select name="card-action-select"
                            id="card-action-select">
                            <option value="null">actualizar un
                                Testimonio</option>
                            <option value="create-card">crear un
                                Testimonio</option>
                            <option value="delete-card">eliminar un
                                Testimonio</option>
                        </select>

                        <select name="card-to-midify"
                            id="card-to-midify">
                            <option value="null">selecciona un
                                Testimonio</option>
                            <option value="null">selecciona un
                                Testimonio</option>
                        </select>

                        <select class="disable mini-input" type="text"
                            name="new-testimonie-pilar">
                            <option value>pilar del nuevo
                                testimonio</option>
                            <option value>atencion domiciliaria</option>
                        </select>

                        <select class="disable mini-input" type="text"
                            name="new-testimonie-service">
                            <option value>servicio del nuevo
                                testimonio</option>
                            <option value>inyectologia</option>
                        </select>

                        <input class="disable mini-input" type="text"
                            name="new-testimonie-videoLink"
                            placeholder="link del video para el nuevo testimonio">
                    </div>

                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button class="disable" type="submit">Crear</button>
                        <button class="disable"
                            type="button">Eliminar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>

        </div>
    `
        forms.contactForm = `
        <div class="container">
            <form class="admin-form update-us-form"
                id="contact-text"
                method="post">
                <label>Contacto</label>
                <div class="row disable">
                    <input type="text" name="address-text"
                        id="address-text-update"
                        placeholder="Direccion"></input>

                    <input type="text" name="phone-text"
                    id="phone-text-update"
                    placeholder="Telefono"></input>

                    <input type="email" name="email-text"
                    id="email-text-update"
                    placeholder="Correo"></input>

                    <input type="text" name="hours-text"
                    id="hours-text-update"
                    placeholder="Horario"></input>

                    <div class="buttons-horizontal-container">
                        <button type="submit">Actualizar</button>
                        <button type="reset">Resetear</button>
                    </div>
                </div>
            </form>
        </div>
    `
    }).catch(error => {
        console.error('Error al obtener datos:', error);
    });
}

const insertform = (document, form) => {
    const field = document.querySelector('#render-field');
    field.innerHTML = '';
    field.innerHTML = forms[form];
}

export { getAdmin, insertform };