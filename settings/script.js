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
    let widgetURLBox = document.getElementById("widgetURL");
    let widget = document.getElementById("widget");

    widgetURLBox.innerText = `${getParentUrl()}?${data}`;
    widget.src = `${getParentUrl()}?${data}`;


}

function getParentUrl() {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');

    // Remove the last part of the URL (the current page/file)
    urlParts.pop();

    // Remove the last part again to go one directory up
    urlParts.pop();

    // Reconstruct the URL
    const parentUrl = urlParts.join('/');

    // Ensure there's a trailing slash if necessary (if it was a directory)
    if (urlParts.length > 2 && !parentUrl.endsWith('/')) {
        return parentUrl + '/';
    }

    return parentUrl;
}