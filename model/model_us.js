import { getData } from "/utils/utils_api.js";
import { insertHeader } from "/utils/utils_header.js";
import { insertFooter } from "/utils/utils_footer.js";


import { changeBackgroundUrl } from "../utils/changeBackgroundUrl.js";

const getUs = (document) => {
    insertHeader(document);

    getData()
        .then(data => {
            const idToText = [
                'hoWeAre',
                'ourHistory',
                'mission',
                'vision',
                'ourPhilosophy',
                'ourValues',
                'ourCommitments',
                'address',
                'Phone',
                'Email',
                'Hours'
            ];

            idToText.forEach(id => {
                document.querySelector(`#${id}`).innerHTML = data.data.longText[id] || data.data.contact[id] || '';
            });
            changeBackgroundUrl(data.data.backgrounds, 'bg003')

            document.querySelector('#us-contact-form').addEventListener('submit', (e) => {
                const aMailTo = document.querySelector('#aMailto');

                const nombre = document.querySelector('#nombre').value;
                const email = document.querySelector('#email').value;
                const asunto = document.querySelector('#asunto').value;
                const mensaje = 'Hola soy ' + nombre + '\n' + document.querySelector('#mensaje').value;

                const mailToLink = `mailto:${data.data.contact.Email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`

                aMailTo.href = mailToLink;

                aMailTo.click();

            });
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            document.querySelector("#welcome-text").textContent = 'Error al obtener datos: ' + error;
        });

    insertFooter();

}

export { getUs };
