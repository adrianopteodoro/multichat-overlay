let settingsContainer = document.getElementById('settings-container');

const { settingsParentUrl, rootUrl } = getParentUrls();

// Define the base URL for the widget customizer
const widgetCustomizerBaseUrl = 'https://adrianopteodoro.github.io/widget-customizer';
const settingsJsonUrl = `${settingsParentUrl}settings.json`;
const languagesJsonUrl = `${settingsParentUrl}languages.json`; // URL for the local languages.json file

// Set the settingsContainer.src to load the widget customizer with the settings JSON and extraLanguageJson
settingsContainer.src = `${widgetCustomizerBaseUrl}?settingsJson=${encodeURIComponent(settingsJsonUrl)}&extraLanguageJson=${encodeURIComponent(languagesJsonUrl)}`;
console.log('Settings Container URL:', settingsContainer.src);

function reloadWidget(data) {
    let widget = document.getElementById("widget");

    // Dynamically set the widget.src with the provided data
    widget.src = `${rootUrl}?${data}`;
    console.log('Widget URL:', widget.src);
}

function getParentUrls() {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');

    // Remove the last part of the URL (the current page/file)
    urlParts.pop();

    // Get the settings parent URL
    const settingsParentUrl = urlParts.join('/');

    // Remove the last part again to get the root URL
    urlParts.pop();
    const rootUrl = urlParts.join('/');

    // Ensure both URLs have a trailing slash
    const formattedSettingsParentUrl = settingsParentUrl.endsWith('/') ? settingsParentUrl : settingsParentUrl + '/';
    const formattedRootUrl = rootUrl.endsWith('/') ? rootUrl : rootUrl + '/';

    return {
        settingsParentUrl: formattedSettingsParentUrl,
        rootUrl: formattedRootUrl,
    };
}