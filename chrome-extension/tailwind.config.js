/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f5f7ff',
                    100: '#ebefff',
                    200: '#d6deff',
                    300: '#b8c4ff',
                    400: '#9aa6ff',
                    500: '#667eea',
                    600: '#5568d3',
                    700: '#4451b0',
                    800: '#333b8d',
                    900: '#22266a',
                },
                secondary: {
                    500: '#764ba2',
                    600: '#5f3c82',
                    700: '#482d62',
                },
            },
        },
    },
    plugins: [],
}
