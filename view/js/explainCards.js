

let istiping = false;

const typeUnique = (elementId, text, typingSpeed) => {
    let index = 0;
    if (document.getElementById(elementId).innerHTML != text && !istiping) {

        istiping = true;
        document.getElementById(elementId).innerHTML = '';

        function typeUniqueAnimation() {
            if (index < text.length) {
                document.getElementById(elementId).innerHTML += text.charAt(index);
                index++;
                setTimeout(typeUniqueAnimation, typingSpeed);
            } else {
                istiping = false;
            }
        }

        typeUniqueAnimation();
    }
}

const type = (elementId, text, typingSpeed, readTime, resetDelay) => {
    let index = 0;
    document.getElementById(elementId).innerHTML = '';

    function typeAnimation() {
        if (index < text.length) {
            document.getElementById(elementId).innerHTML += text.charAt(index);
            index++;
            setTimeout(typeAnimation, typingSpeed);
        } else {
            setTimeout(() => {
                document.getElementById(elementId).innerHTML = '';
                index = 0;
                setTimeout(typeAnimation, resetDelay);
            }, readTime);
        }
    }

    typeAnimation();
}

setTimeout(() => {
    type('welcome-text', document.querySelector("#welcome-text").textContent, 100, 50000, 1000);

    const cards = document.querySelectorAll(".explain-card ");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            typeUnique('explain-why-card', card.querySelector(".explain-card-text").textContent, 50);
        });
    });
}, 1500);

setInterval(ShowOptions, 5000);