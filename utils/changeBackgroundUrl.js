function changeBackgroundUrl(newUrl, bgN) {
    const bgC = '.' + bgN;
    const element = document.querySelector(bgC);
    const currentBackground = getComputedStyle(element).backgroundImage;
    const newBackground = currentBackground.replace(/url\(".*?"\)/, `url("${newUrl[bgN]}")`);
    element.style.backgroundImage = newBackground;
}

export { changeBackgroundUrl };