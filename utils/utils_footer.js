const insertFooter = async () => {
    try {
        const response = await fetch('/view/components/footer.html');
        if (!response.ok) {
            throw new Error('Error al cargar el archivo HTML');
        }

        let htmlContent = await response.text();
        document.querySelector('body').insertAdjacentHTML('beforeend', htmlContent);

        document.querySelectorAll(".linkTo").forEach(element => {
            element.addEventListener("click", () => {
                let url = element.id === "inicio" ? "/index.html" : `/view/${pageTitlesToIds[element.id]}`
                window.location.hash = url;
            });
        });
    } catch (error) {
        document.querySelector('body').insertAdjacentHTML('beforeend', `<footer>Error al cargar el footer</footer>`);
    }
}

export { insertFooter }
