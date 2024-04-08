const pageTitlesToIds = {
    "AEC - Atencion En Casa - Pagina Principal": "inicio",
    "AEC - Atencion En Casa - Servicios": "servicios",
    "AEC - Atencion En Casa - Nosotros": "nosotros",
    "AEC - Atencion En Casa - Testimonios": "testimonios",

    "inicio": "index.html",
    "servicios": "services.html",
    "nosotros": "us.html",
    "testimonios": "testimonies.html"
};

const insertHeader = (document) => {

    const docTitle = document.title;

    if (docTitle in pageTitlesToIds) {
        const getOptionLi = (docTitle) => {
            return pageTitlesToIds[docTitle] ? `id="${pageTitlesToIds[docTitle]}"` : '';
        };

        const getNewOptionLi = (optionLi) => {
            return optionLi + ' style="color: var(--color-alfa-secundario)"';
        };

        fetch('/view/components/header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar el archivo HTML');
                }
                return response.text();
            })
            .then(htmlContent => {
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
            })
            .catch(error => {
                console.error('Error al cargar el archivo HTML:', error);
                document.querySelector('body').insertAdjacentHTML('afterbegin', 'Error al cargar el archivo HTML: ' + error.message);
            });
    } else {
        const errorMessage = 'Error al cargar el archivo HTML: el título de la página no coincide con los datos estáticos';
        console.error(errorMessage);
        document.querySelector('body').insertAdjacentHTML('afterbegin', errorMessage);
    }
};

const changeLocation = (url) => {
    window.location.href = url;
}

export { pageTitlesToIds, insertHeader, changeLocation }