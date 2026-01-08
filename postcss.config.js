module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

### File: `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://hwjvaslrgsmvqzarrctt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3anZhc2xyZ3NtdnF6YXJyY3R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4ODk2ODgsImV4cCI6MjA4MzQ2NTY4OH0.tMcaOjBaSkRfFFmkjhcNcjhP-F7kQcJ6clZ_tcMQsDw
```

---

### File: `.gitignore`
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
