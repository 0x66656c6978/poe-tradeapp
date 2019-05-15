function triggerSearchFunc(payload) {
    app.query.query = payload;
    app.doSearch();
}

module.exports = triggerSearchFunc