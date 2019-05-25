function triggerSearchFunc(payload) {
    app.query.query = payload;
    app.doSearch();
}

function getLatestSearch() {
    return app.$store._modules.root._children.transient.state.searches[0];
}

class Client {

    websiteUrl = 'https://www.pathofexile.com/trade/search'

    constructor(browserWindow) {
        this.browserWindow = browserWindow;
    }

    initialize() {
        this.browserWindow.loadURL(this.websiteUrl);
    }

    
    createInjector(func, funcArgs) {
        return `(function () { var executePayload = ${func.toString()}; executePayload(${JSON.stringify(funcArgs)}); })();`;
    }

    doSearch(searchQuery) {
        return this.injectJS(triggerSearchFunc, searchQuery)
    }

    getLatestSearch() {
        return this.injectJS(getLatestSearch, {});
    }

    injectJS(code, args) {
        return this.browserWindow.webContents.executeJavaScript(this.createInjector(code, args), true)
    }

}

module.exports = Client;

