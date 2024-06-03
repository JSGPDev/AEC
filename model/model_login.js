import { login } from "/utils/utils_api.js";

const getLogin = (document) => {
    setFormsLogic(document);
}

const setFormsLogic = (document) => {
    const loginForm = document.querySelector('#login-form');

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            try {
                const response = await login(loginForm);
                if (response.ok) {
                    const data = await response.json();
                    if (data.correct) {
                        // Procesar la respuesta del servidor cuando el inicio de sesión es exitoso
                        console.log("Inicio de sesión exitoso, id: " + data.sessionId);
                        // Establecer una variable de control en la sesión
                        sessionStorage.setItem("sessionId", data.sessionId)
                        sessionStorage.setItem("logged", true);
                        // Redirigir al usuario a otra página, etc.
                        window.location.href = "admin.html";
                    } else {
                        // Procesar la respuesta del servidor cuando el inicio de sesión falla
                        console.error("Error en el inicio de sesión:", data.message);
                        // Mostrar un mensaje de error al usuario, etc.
                    }
                } else {
                    // Procesar la respuesta del servidor cuando hay un error en la solicitud fetch
                    console.error("Error en la solicitud:", response.statusText);
                    // Mostrar un mensaje de error al usuario, etc.
                }
            } catch (error) {
                console.error(error);
                // Manejar errores de solicitud
            }
        });
    }
}

export { getLogin }
