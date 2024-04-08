import { insertHeader } from "/utils/utils_header.js";
import { getData } from "/utils/utils_api.js";


const getIndex = (document) => {
    window.location.hash = "";
    getData()
        .then(data => {
            if (!data.error) {
                insertHeader(document);
                document.querySelector("#welcome-text").textContent = data.data.longText.welcomeText;
                document.querySelectorAll('.explain-card').forEach(element => {
                    let title = element.querySelector(".card-title").textContent;
                    console.log(title + "\n" + data.data.longText.cardText[title])
                    element.querySelector(".explain-card-text").textContent = data.data.longText.cardText[title];

                    document.querySelector("#nextToVideo").textContent = data.data.longText.nextToVideo;
                    document.querySelector("#whyUs").textContent = data.data.longText.whyUs;
                });
            } else {
                console.error(data.message);
                document.querySelector("#welcome-text").textContent = data.message;
            }
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            document.querySelector("#welcome-text").textContent = 'Error al obtener datos:' + error;
        });
}

export { getIndex }
