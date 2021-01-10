module.exports = {
    module: {
        rules: [
            {
                test: /\.svg$/i,
                use: "raw-loader",
            },
        ],
    },
};
