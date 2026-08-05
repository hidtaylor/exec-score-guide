import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

type OAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

function oauth(): OAuthNamespace {
  return (supabase.auth as unknown as { oauth: OAuthNamespace }).oauth;
}

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error: detailsError } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (detailsError) {
        setError(detailsError.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error: decideError } = approve
      ? await oauth().approveAuthorization(authorizationId)
      : await oauth().denyAuthorization(authorizationId);
    if (decideError) {
      setBusy(false);
      setError(decideError.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "an application";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-md py-20">
        {error ? (
          <div className="space-y-3">
            <h1 className="text-display-sm text-foreground">Authorization failed</h1>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : !details ? (
          <p className="text-sm text-muted-foreground">Loading authorization request…</p>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                Agent integration
              </p>
              <h1 className="text-display-sm text-foreground">Connect {clientName}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {clientName} is requesting access to the AI Brokerage Accelerator on your behalf. It
                will be able to read leads and assessment results that your account can already see.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="hero" disabled={busy} onClick={() => decide(true)}>
                {busy ? "Working…" : "Approve"}
              </Button>
              <Button variant="ghost" disabled={busy} onClick={() => decide(false)}>
                Deny
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
