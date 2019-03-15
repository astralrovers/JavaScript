const config = {
    entry: {
        app: "./index.js"
    },
    output:{
        filename:"bundle.js",
        path:__dirname + "/dist"
    },
    mode: 'production'
};

module.exports = config;
