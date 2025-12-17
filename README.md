meet-ai — Tech Stack

This project uses the following technologies and libraries:

- Next.js 15.3.8 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4 (with @tailwindcss/postcss)
- PostCSS
- Turbopack (dev server)
- ESLint (eslint-config-next)
- class-variance-authority
- clsx
- lucide-react
- tailwind-merge

Dev dependencies are managed via npm. Update `package.json` for exact versions.

## UI Pages

### Authentication Pages

#### Sign In Page

![Sign In Page](/public/README/SignIn.png)

**Features:**

- Email and password form fields with validation
- Field-level error messages powered by `react-hook-form` and `zod`
- "Remember me" checkbox
- "Forgot password?" link
- Link to create a new account
- OAuth provider buttons (Google, GitHub)
- Responsive design with branded side panel

**Supported Methods:**

- Email/Password authentication via `authClient.signIn.email()`
- OAuth (Google, GitHub) via `authClient.signIn.social()`

#### Sign Up Page

![Sign Up Page](/public/README/SignUp.png)

**Features:**

- Form fields: Full Name, Email, Password, Confirm Password
- Password confirmation validation (zod refine ensures match)
- Field-level error messages with `FormMessage`
- Form-level error alert display
- OAuth provider buttons (Google, GitHub)
- Link to existing account sign in
- Responsive design with branded side panel

**Supported Methods:**

- Email/Password registration via `authClient.signUp.email()`
- OAuth (Google, GitHub) via `authClient.signIn.social()`

**Form Validation (Zod Schema):**

```typescript
const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, { message: "Password should be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
```

## Implemented Pages

- **Dashboard & Agents:** The Dashboard and Agents pages are implemented (see `src/app/dashboard` and related agents routes). These pages provide an interface for managing agents and viewing dashboard data within the app.

- **Responsive Layout:** A responsive layout pattern is used to adapt the UI for mobile and desktop. The app uses the `useIsMobile` hook to switch UI components (for example, Drawer on mobile and Dialog on desktop) to improve usability across screen sizes.

<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">

![Dashboard_Agents_Desktop](/public/README/Dashboard_Agents_Desktop.png)

![Dashboard_Agents_Mobile](/public/README/Dashboard_Agents_Mobile.png)

</div>
