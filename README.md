# JourneyFinder

**JourneyFinder** is a high-performance, full-stack web application designed for verified college students to publish, discover, and share travel journeys. It connects students heading in the same direction, making travel more affordable, social, and sustainable. 

The platform features an editorial-grade, pixel-perfect UI with cinematic micro-interactions, built on modern React server architecture.

---

## 🚀 Features

- **Secure Authentication:** NextAuth.js integration with Google OAuth and custom OTP-based email verification (Nodemailer) ensuring only verified university students can access the platform.
- **Journey Discovery:** Find rides and companions easily via an interactive, 3D radial carousel with drag-based navigation.
- **Publish & Manage Journeys:** Create new journeys with multiple stops, manage seat availability, and track active vs. closed trips on a personalized dashboard.
- **Cinematic Animations:** Deep integration with Framer Motion powers physics-based spring animations, multi-bounce card drops, and orchestrated reveal sequences (including a branded splash loading screen).
- **Editorial Typography System:** A carefully curated 4-font design system utilizing CSS variables:
  - *Bricolage Grotesque* (Display/Brand)
  - *Space Grotesk* (UI/Body)
  - *Fraunces* (Editorial Serifs)
  - *JetBrains Mono* (Technical Metadata/Timestamps)
- **Robust Database & Real-time:** Powered by Supabase (PostgreSQL) to handle user profiles, journey CRUD operations, and real-time state seamlessly.
- **Scalable Architecture:** Built on Next.js App Router, carefully balancing Server and Client components to prevent hydration edge cases and maximize performance.

---

## 🛠️ Tech Stack

### Core
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Language:** TypeScript (Strict Mode)
- **Runtime:** Node.js (v20+)

### UI & Styling
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui & @base-ui/react
- **Animations:** Framer Motion & tw-animate-css
- **Icons:** Lucide React
- **Theming:** next-themes (with extensive CSS variables implementation)

### Backend & Data
- **Database:** Supabase (PostgreSQL)
- **Auth:** NextAuth.js v5 (Auth.js)
- **Forms & Validation:** React Hook Form + Zod
- **Emails:** Nodemailer (for OTP delivery)

### Deployment
- **Hosting:** Vercel (with optimized font loading and zero-downtime CI/CD)

---

## 💻 Getting Started

### Prerequisites
Make sure you have Node.js (v20 or higher) and npm installed.

### 1. Clone the repository
```bash
git clone https://github.com/mantrakhandelwaljee-lgtm/journey-finder.git
cd journey-finder
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the necessary environment variables for Supabase and NextAuth.

```env
# NextAuth
AUTH_SECRET="your_generated_secret"
AUTH_GOOGLE_ID="your_google_oauth_id"
AUTH_GOOGLE_SECRET="your_google_oauth_secret"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# Email (For OTP verification)
EMAIL_SERVER_USER="your_smtp_user"
EMAIL_SERVER_PASSWORD="your_smtp_password"
EMAIL_SERVER_HOST="your_smtp_host"
EMAIL_SERVER_PORT="587"
EMAIL_FROM="noreply@journeyfinder.com"
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📜 License
This project is for private educational/portfolio use.
