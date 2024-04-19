
const startIndexCarousel = () => {
    const option_boxes = document.querySelectorAll(".option-box");
    let last_box = 0;
    let current_box = 0;

    const ShowOptions = () => {
        current_box = (current_box + 1) % option_boxes.length;

        option_boxes[last_box].classList.replace("unhide", "hide");
        option_boxes[current_box].classList.replace("hide", "unhide");

        last_box = current_box;
    }
    setInterval(ShowOptions, 5000);
}

const startUsCarousel = () => {
    const carousels = document.querySelectorAll(".carousel");

    const Car_1_items = carousels[0].querySelectorAll(".carousel-item");
    const Car_2_items = carousels[1].querySelectorAll(".carousel-item");

    let last_Car_1_item = 0;
    let current_Car_1_item = 0;
    let last_Car_2_item = 0;
    let current_Car_2_item = 0;

    const MoveItems = () => {
        current_Car_1_item = (current_Car_1_item + 1) % Car_1_items.length;
        current_Car_2_item = (current_Car_2_item + 1) % Car_2_items.length;

        Car_1_items[last_Car_1_item].classList.replace("unhide", "hide");
        Car_1_items[current_Car_1_item].classList.replace("hide", "unhide");

        Car_2_items[last_Car_2_item].classList.replace("unhide", "hide");
        Car_2_items[current_Car_2_item].classList.replace("hide", "unhide");

        last_Car_1_item = current_Car_1_item;
        last_Car_2_item = current_Car_2_item;
    }
    setInterval(MoveItems, 5000);
}

setTimeout(startIndexCarousel, 1500)
setTimeout(startUsCarousel, 1500)