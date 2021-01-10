module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            maxHeight: {
                104: "26rem",
                112: "28rem",
                120: "30rem",
                128: "32rem",
                136: "34rem",
            },
            minHeight: {
                104: "26rem",
                112: "28rem",
                120: "30rem",
                128: "32rem",
                136: "34rem",
            },
            width: {
                104: "26rem",
                112: "28rem",
                120: "30rem",
                128: "32rem",
                136: "34rem",
            },
        },
    },
    variants: {
        extend: {
            backgroundColor: ["odd"],
        },
    },
    plugins: [],
};
