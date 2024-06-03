function convertirMarkdownAHTML(text) {
    let newText = text;
    const simbolo_X_Etiqueta = [
        { pattern: /\*(.*?)\*/g, replacement: '<strong>$1</strong>' },
        { pattern: /\n/g, replacement: '<br>' },
        { pattern: /\+(.*?)\+/g, replacement: '<p>$1</p>' }
    ];

    simbolo_X_Etiqueta.forEach(pair => {
        newText = newText.replace(pair.pattern, pair.replacement);
    });

    return newText;
}

export { convertirMarkdownAHTML }