// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      credits: number;
      name?: string | null;
      email?: string | null;
    };
  }

  interface User {
    id: string;
    credits: number;
    name?: string | null;
    email?: string | null;
    password?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    credits: number;
  }
}
