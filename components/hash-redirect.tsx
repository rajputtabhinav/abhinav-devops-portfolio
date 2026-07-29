"use client";

import { useEffect } from "react";
import { LegacyShell } from "@/components/legacy-site";

/** Client redirect to `/#anchor` for old multi-page URLs. */
export function RedirectToLandingSection({ anchor }: { anchor: string }) {
  useEffect(() => {
    const clean = anchor.replace(/^#/, "");
    window.location.replace(`/#${clean}`);
  }, [anchor]);

  return (
    <div className="redirect-fallback py-5 px-3 text-center">
      <p className="mb-0" style={{ fontFamily: "system-ui, sans-serif" }}>
        Redirecting to the main page…
      </p>
    </div>
  );
}

/** Full chrome (header/footer) while hash redirect runs — avoids blank intermediate screen. */
export function LandingSectionRedirectPage({
  anchor,
  bodyClassName,
}: {
  anchor: string;
  bodyClassName?: string;
}) {
  return (
    <LegacyShell bodyClassName={bodyClassName}>
      <main className="main">
        <RedirectToLandingSection anchor={anchor} />
      </main>
    </LegacyShell>
  );
}
