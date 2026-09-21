# SupportSpark client

The client owns public home, authentication and demo routes plus protected dashboard, supporter and conversation views. Wouter uses hash routing; React Query supplies the shared query client (ref: `client/src/App.tsx`, `client/src/lib/queryClient.ts`).

The product supports sharing journey updates with trusted supporters (ref: `README.md`, `.documentation/domain/product-overview.md`). UI code lives under `client/src`; page and hook tests exercise the actual page components and pass (ref: `client/src/pages/Dashboard.test.tsx`, `client/src/hooks/use-auth.test.tsx`).
