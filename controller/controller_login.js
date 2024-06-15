import { getLogin } from "/model/model_login.js";
import { api_host } from "/utils/utils_api.js";

export default class LoginController {

    constructor(document) {
        getLogin(document);
        this.checkSession();
        this.setButtons();
    }

    checkSession = async () => {
        const isLoggedIn = sessionStorage.getItem("logged");
        if (isLoggedIn) {
            const sessionId = sessionStorage.getItem("sessionId"); // aquí debes obtener el sessionId de alguna manera
            const response = await fetch(`${api_host}/session/islogged/${sessionId}`);
            if (response.ok) {
                const data = await response.json();
                const backLoggedIn = data.logged;
                if (backLoggedIn) {
                    window.location.href = "/view/admin.html";
                }
            }
        }
    }

    setButtons = () => {
        const options = document.querySelectorAll('.option');

        if (options) {
            const renderField = document.querySelector("#render-field");
            options.forEach(option => {
                option.addEventListener("click", () => {
                    renderField.innerHTML = `<h1>${option.textContent}</h1>`
                })
            });
        }
    }
}
