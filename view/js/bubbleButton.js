const contactBubleFunction = () => {

    console.log("contactBubleFunction")

    const bub = document.getElementById('contact-buble-view');
    const opt = document.getElementById('buble-icons-container');
    bub.classList.replace(bub.classList.contains('contact-buble-view-hide') ? 'contact-buble-view-hide' : 'contact-buble-view-unhide', bub.classList.contains('contact-buble-view-hide') ? 'contact-buble-view-unhide' : 'contact-buble-view-hide')
    opt.classList.replace(opt.classList.contains('buble-icons-container-hide') ? 'buble-icons-container-hide' : 'buble-icons-container-unhide', opt.classList.contains('buble-icons-container-hide') ? 'buble-icons-container-unhide' : 'buble-icons-container-hide')

    document.body.style.overflowY = bub.classList.contains('contact-buble-view-unhide') ? 'hidden' : 'auto';
}

document.querySelectorAll(".contact-button").forEach(button => {
    button.addEventListener("click", contactBubleFunction);
});