let settingsContainer = document.getElementById('settings-container');

// Define the base URL for the widget customizer
const widgetCustomizerBaseUrl = 'https://adrianopteodoro.github.io/widget-customizer';
const settingsJsonUrl = `${getParentUrl()}settings.json`;

// Set the settingsContainer.src to load the widget customizer with the settings JSON
settingsContainer.src = `${widgetCustomizerBaseUrl}?settingsJson=${encodeURIComponent(settingsJsonUrl)}`;
console.log('Settings Container URL:', settingsContainer.src);

function reloadWidget(data) {
    let widget = document.getElementById("widget");

    // Dynamically set the widget.src with the provided data
    widget.src = `${getParentUrl()}?${data}`;
    console.log('Widget URL:', widget.src);
}

function getParentUrl() {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');

    // Remove the last part of the URL (the current page/file)
    urlParts.pop();

    // Reconstruct the URL
    const parentUrl = urlParts.join('/');

    // Ensure there's no double slash
    return parentUrl.endsWith('/') ? parentUrl : parentUrl + '/';
}