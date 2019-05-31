/**
 * Injects the given search query payload into the runtime of the target-app
 * and then triggers the doSearch method of the target-app
 *
 * @param {Object} payload
 */
function triggerSearchFunc(payload) {
    app.query.query = payload;
    app.doSearch();
}

/**
 * Return the latest search results from the target-app
 */
function getLatestSearch() {
    return app.$store._modules.root._children.transient.state.searches[0];
}

class Client {

    /**
     * @param {BrowserWindow} browserWindow
     */
    constructor(browserWindow) {
        this.browserWindow = browserWindow;
        this.websiteUrl = 'https://www.pathofexile.com/trade/search'
    }

    /**
     * Initialize the client.
     * This loads the actual website and is the space to run initialization logic on
     * the target-app itself
     */
    initialize() {
        this.browserWindow.loadURL(this.websiteUrl);
    }

    /**
     * Run the `triggerSearchFunc` function on the target-app with the given search query
     *
     * @param {Object} searchQuery
     */
    doSearch(searchQuery) {
        return this.injectJS(triggerSearchFunc, searchQuery)
    }

    /**
     * Retrieve the latest search results from the target-app
     */
    getLatestSearch() {
        return this.injectJS(getLatestSearch, {});
    }

    /**
     * Create js code that contains a self-executing function which will execute the given function
     * with the given argument.
     * The given function must not be native code, as this will cause the `Function.toString` method to return garbage.
     *
     * @param {Function} func
     * @param {*} funcArgs
     * @return {String}
     */
    createInjector(func, funcArgs) {
        return `(function () { var executePayload = ${func.toString()}; executePayload(${JSON.stringify(funcArgs)}); })();`;
    }

    /**
     * Create an injector function from the given function and arguments, then execute
     * the resulting payload on the target-app.
     *
     * @param {Function} func
     * @param {*} funcArgs
     */
    injectJS(func, funcArgs) {
        return this.browserWindow.webContents.executeJavaScript(this.createInjector(func, args), true)
    }

}

module.exports = Client;
