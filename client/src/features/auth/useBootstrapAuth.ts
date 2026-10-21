import { useAuth } from "@clerk/react";
import { useAuthStore } from "./store";
import { useEffect } from "react";
import { getMe, syncUser } from "./api";
import { setApiTokenGetter } from "@/lib/api";

export const useBootstrapAuth = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const { setLoading, setError, setUser, clearAuth } = useAuthStore();

  useEffect(() => {
    setApiTokenGetter(async () => {
      const token = await getToken();

      console.log("Clerk token check:", {
        exists: Boolean(token),
        parts: token?.split(".").length,
        prefix: token?.slice(0, 10),
      });

      if (!token) {
        throw new Error("Clerk did not return a session token.");
      }

      return token ?? null;
    });
  }, [getToken]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!isLoaded) return;

      if (!isSignedIn) {
        clearAuth();
        return;
      }

      try {
        setLoading();

        await syncUser();
        const me = await getMe();

        if (!cancelled) {
          setUser(me?.user);
        }
      } catch (error) {
        if (!cancelled) {
          const errMessage =
            error instanceof Error ? error.message : "Failed to load user.";

          setError(errMessage);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, setLoading, setError, setUser, clearAuth]);
};
