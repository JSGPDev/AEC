
const startIndexCarousel = () => {
    const option_boxes = document.querySelectorAll(".option-box");
    var last_box = 0;
    var current_box = 0;

    const ShowOptions = () => {
        current_box = (current_box + 1) % option_boxes.length;

        option_boxes[last_box].classList.replace("unhide", "hide");
        option_boxes[current_box].classList.replace("hide", "unhide");

        last_box = current_box;
    }
    setInterval(ShowOptions, 5000);
}

setTimeout(startIndexCarousel, 1500)