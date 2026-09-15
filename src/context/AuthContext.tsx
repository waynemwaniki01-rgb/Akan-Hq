"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { currentUser, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">
          You need to sign in to continue
        </p>
        <Button onClick={() => signInWithGoogle()} size="lg">
          Sign in with Google
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}