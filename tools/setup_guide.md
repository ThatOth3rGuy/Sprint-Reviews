# Next.js installation guide

1. Make sure you have Node and NPM installed on your device. (You can check by running `node -v` and `npm -v` in the terminal)
2. Open terminal and navigate to root of the repository
3. Delete the current app folder
4. Type `npx create-next-app@latest app --typescript --eslint` Use the following configuration
    * TailwindCSS? - Yes
    * `src/` directory? - Yes
    * App router? - Yes
    * Import alias - No

    This will probably take a few minutes to install everything

5. At this point you may be able to pull from the repository (accept incoming changes for any merge conflicts) and have everything else set up for you. 

If not

6. Step into the app folder `cd app`
7. Run `npm install -D tailwindcss postcss autoprefixer`
8. run `npx tailwindcss init -p`
9. run `npm install @tailwindcss/typography daisyui -D`
10. Open the repository in VSCode
11. IF you have a tailwind.config.js file, open it and change the following 
``` 
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

to

``` 
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui")
  ],
}
```
If there is only a tailwind.config.ts file, you shouldn't have to do anything here

13. Everything is now set up, just make sure the src folder matches the one in the repository
14. To run the app, open a terminal in VSCode, make sure your working directory is set to the `app` folder and run `npm run dev`, to terminate it from running press CTRL+C in the terminal.