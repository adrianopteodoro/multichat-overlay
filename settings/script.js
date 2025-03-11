// //In the parent webpage
// window.addEventListener("message", function (event) {
//     if (event.origin === "http://127.0.0.1:3002") {
//         console.log("Data received from iframe:", event.data);

//         console.log(`https://nuttylmao.github.io/multichat-overlay?${event.data}`);

//         let widgetContainer = document.getElementById("widget-container");
//         widgetContainer.src = `https://nuttylmao.github.io/multichat-overlay?${event.data}`
//     } else {
//         console.log("message blocked from invalid origin: ", event.origin)
//     }
// });
let settingsContainer = document.getElementById('settings-container');
settingsContainer.src = `https://nuttylmao.github.io/widget-customizer?settingsJson=${window.location.href}/settings.json`
console.log(`https://nuttylmao.github.io/widget-customizer?settingsJson=${window.location.href}/settings.json`);

function reloadWidget(data) {
    let widgetContainer = document.getElementById("widget-container");
    widgetContainer.src = `https://nuttylmao.github.io/multichat-overlay?${data}`
}