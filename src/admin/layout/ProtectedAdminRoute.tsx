
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

import { supabase } from "../../services/supabase";

export default function ProtectedAdminRoute() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let active = true;
    let requestId = 0;

    async function checkAdminAccess() {
      const currentRequest = ++requestId;

      if (active) {
        setLoading(true);
      }

      try {
        const { data, error } = await supabase.auth.getUser();

        if (
          !active ||
          currentRequest !== requestId
        ) return;

        if (error || !data.user) {
          setAllowed(false);
          return;
        }

        const { data: isAdmin, error: roleError } =
          await supabase.rpc("is_innovar_admin");

        if (
          !active ||
          currentRequest !== requestId
        ) return;

        setAllowed(!roleError && isAdmin === true);
      } catch (error) {
        console.error("Admin authorization failed:", error);

        if (active && currentRequest === requestId) {
          setAllowed(false);
        }
      } finally {
        if (active && currentRequest === requestId) {
          setLoading(false);
        }
      }
    }

    void checkAdminAccess();

    const { data: listener } =
      supabase.auth.onAuthStateChange(() => {
        // Run outside the auth callback to avoid
        // awaiting another Supabase call inside it.
        setTimeout(() => {
          if (active) void checkAdminAccess();
        }, 0);
      });

    return () => {
      active = false;
      requestId++;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8F9FE]">
        <LoaderCircle
          size={36}
          className="animate-spin text-[#542080]"
        />

        <p className="text-sm font-medium text-[#101A44]">
          Verifying Innovar administrator access...
        </p>
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

