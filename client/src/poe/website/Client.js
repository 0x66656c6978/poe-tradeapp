function triggerSearchFunc(payload) {
    app.query.query = payload;
    app.doSearch();
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
        this.browserWindow.webContents.executeJavaScript(
            this.createInjector(triggerSearchFunc, searchQuery),
            true
        )
        .then(this.onSearchSucceed.bind(this))
        .catch(this.onSearchFail.bind(this))
    }
    
    onSearchSucceed (args) {
        if (this.app.debug) {
            console.info('JS executed successfully', args)
        }
    }

    onSearchFail (reason) {
        console.info('Executing search failed')
        console.error(reason)
    }

}

module.exports = Client;

