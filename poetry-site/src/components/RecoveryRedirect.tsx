"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RecoveryRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash && (hash.includes("type=recovery") || hash.includes("access_token="))) {
        // Redirect to /reset-password page, passing the hash fragment along
        router.replace(`/reset-password${hash}`);
      }
    }
  }, [router]);

  return null;
}
