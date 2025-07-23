- Tailwind CSS (for styling)
- Responsive on all devices

🔹 Folder Structure:

- Use `app/` directory (no `src/` folder)
- `app/` must contain individual folders for each route (e.g. `home`, `about`, `shop`, etc.)
- Each route folder should include a `page.tsx` and `widget/` folder to store extracted subcomponents
- Create a `components/` folder at the root for fully reusable components (e.g., Button, Navbar, Footer, Card)
- Create a `lib/` folder for Supabase & Clerk client, utils, constants
- Use `styles/` for global styles and custom Tailwind extensions
- Use `types/` folder for TypeScript types if needed

🔹 Design & UX:

- Aesthetic, minimalist layout like andsons.co.uk
- Smooth transitions and animations (Framer Motion if needed)
- Liquid glass or soft blur effect on sections
- Hero section with full bleed image/video background
- Beautiful typography, spacing, and contrast

🔹 Coding Rules:

- Clean, well-commented code
- Extract reusable UI into `components/`
- Extract nested elements into `widget/` inside route folders
- Avoid repetition
- Use `metadata` in route for SEO
- Use server components where possible for better performance
- Use Suspense and loading.tsx for route-based loading states

🔹 Pages to include:

- Home
- About
- Shop/Product page
- Gallery/Collection
- Contact
- Login/Register (using Clerk)
- Dashboard (if user logged in)

🔐 Auth:

- Use Clerk for user login/register/session
- Protect dashboard route using Clerk middleware

🛠 Backend:

- Supabase for fetching and storing product and contact data
- Admin dashboard access to update products (optional)

Responsive, scalable, production-ready layout, with no duplicate code.
