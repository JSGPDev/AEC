import { getAdmin, insertform } from "../model/model_admin.js";

export default class AdminController {

    constructor() {
        getAdmin(document);
        this.checkSession();
        const sideBar = document.querySelector("#side-bar");

        if (sideBar) {
            sideBar.addEventListener("click", () => { this.toggleSidebar(sideBar) });
        }

        this.sideBarOptionsLogic();

    }

    sideBarOptionsLogic() {
        const options = document.querySelectorAll(".option");

        options.forEach(option => {
            option.addEventListener("click", () => {
                insertform(document, option.id);
                this.formSectionsLogic();
            })
        })
    }

    formSectionsLogic() {
        const adminForms = document.querySelectorAll(".admin-form");
        let curForm;

        adminForms.forEach(element => {
            if (element.id !== "submit-all") {
                element.addEventListener("click", () => {
                    element.querySelector("div").classList.replace("disable", "show");
                    curForm = element;
                    adminForms.forEach(element => {
                        if (element !== curForm) {
                            element.querySelector("div").classList.replace("show", "disable");
                        }
                    })
                })
            }
        });
    }

    toggleSidebar = (sideBar) => {
        sideBar.classList.toggle('expanded');
    }

    checkSession = async () => {
        const isLoggedIn = sessionStorage.getItem("logged");
        const backLoggedIn = false;
        const sessionId = sessionStorage.getItem("sessionId") || "NULL"; // aquí debes obtener el sessionId de alguna manera

        if (sessionId === 'NULL') {
            window.location.href = "/view/login.html";
        }

        const response = await fetch(`http://localhost:8080/session/islogged/${sessionId}`);
        if (response.ok) {
            const data = await response.json();
            if (!isLoggedIn || !data.logged) {
                window.location.href = "/view/login.html";
            }
        } else {
            console.error("Error al verificar la sesión");
            window.location.href = "/view/login.html";
        }

    }
}