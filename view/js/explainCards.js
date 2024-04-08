import { type, typeUnique } from "/utils/Util_typing.js";

setTimeout(() => {
    type('welcome-text', document.querySelector("#welcome-text").textContent, 100, 5000, 1000);

    const cards = document.querySelectorAll(".explain-card ");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            typeUnique('explain-why-card', card.querySelector(".explain-card-text").textContent, 50);
        });
    });
}, 1500);


setInterval(ShowOptions, 5000);