import { getData } from "../utils/utils_api.js";
import { insertHeader } from "../utils/utils_header.js";

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
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            document.querySelector("#welcome-text").textContent = 'Error al obtener datos: ' + error;
        });
}

export { getUs };
