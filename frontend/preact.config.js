module.exports = function (config, env) {
    if (env.isProd) {
        config.devtool = false; // disable sourcemaps
    }

    if (process.env.NODE_ENV === "development") {
        config.devServer.proxy = [
            {
                path: "/api",
                target: "http://localhost:8000",
            },
        ];
    }
};
