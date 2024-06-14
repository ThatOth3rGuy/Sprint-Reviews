The actual source files of a software project are usually stored inside the src folder. Alternatively, you can put them into the lib (if you're developing a library), or into the app folder (if your application's source files are not supposed to be compiled).

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server (make sure your working directory is ... /team-3-sprint-runners/app):

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Google o-Auth details
* The system is already set and throws back a JWT saved in the constant `decoded`. This you can find on the index.tsx. But here is the code for ease of use
```tsx
<GoogleLogin
  onSuccess={credentialResponse => {
    if (credentialResponse?.credential) {
      const decoded = jwtDecode(credentialResponse.credential); // decoded is a JWT and is decoded
      console.log(decoded); // Do something with the decoded credential here this is to be used to confirm Login or registration
    }
  }}
  onError={() => {
    console.log('Login Failed');
  }}
  useOneTap
/>
```
### Obtain email
If the user's email is included in the JWT, it will typically be under a property named `email`.
Here's how you can access the email from the decoded JWT:

```tsx
<GoogleLogin
  onSuccess={credentialResponse => {
    if (credentialResponse?.credential) {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log(decoded); // This will log the entire decoded JWT

      // Access the email from the decoded JWT
      const email = decoded.email; //Needs to be added for signup/login 
      console.log(email); // This will log the email
    }
  }}
  onError={() => {
    console.log('Login Failed');
  }}
  useOneTap
/>
```


Here are the steps to meet the prerequisites:

1. Install the `jwt-decode` package using npm or yarn:

   ```bash
   npm install jwt-decode
   # or
   yarn add jwt-decode
   ```

2. Import `jwtDecode` in your file:

   ```tsx
   import jwtDecode from 'jwt-decode';
   ```

3. Use `jwtDecode` to decode the JWT from the Google OAuth response:

   ```tsx
   const decoded = jwtDecode(credentialResponse.credential);
   ```

4. Access the email from the decoded JWT:

   ```tsx
   const email = decoded.email;
   ```


