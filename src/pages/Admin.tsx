import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Download, LogIn, KeyRound, FileDown } from "lucide-react";
import { toast } from "sonner";
import { generateResultsPDF } from "@/lib/generate-results-pdf";
import { getBand, getRecommendations, CATEGORIES, QUESTIONS } from "@/lib/scorecard-config";
import type { AssessmentResult, LeadData } from "@/context/AppContext";

interface LeadRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  brokerage_name: string | null;
  agent_count: string | null;
  top_priority: string | null;
  created_at: string;
  assessments: {
    total_score: number | null;
    band: string | null;
  }[];
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [bandFilter, setBandFilter] = useState("all");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (error) {
      console.error("Role check failed:", error);
      setIsAdmin(false);
      return false;
    }
    setIsAdmin(!!data);
    return !!data;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setAuthed(true);
      await checkAdminRole(data.user.id);
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session) {
        setAuthed(true);
        await checkAdminRole(session.user.id);
      }
    });
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setAuthed(true);
        await checkAdminRole(session.user.id);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authed || !isAdmin) return;
    fetchLeads();
  }, [authed, isAdmin]);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*, assessments(total_score, band)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load leads");
      return;
    }
    setLeads((data as any) || []);
  };

  const filteredLeads = bandFilter === "all"
    ? leads
    : leads.filter((l) => l.assessments?.[0]?.band === bandFilter);

  const exportCSV = () => {
    const headers = ["First Name", "Last Name", "Email", "Brokerage", "Agent Count", "Top Priority", "Score", "Band", "Created At"];
    const rows = filteredLeads.map((l) => [
      l.first_name || "",
      l.last_name || "",
      l.email,
      l.brokerage_name || "",
      l.agent_count || "",
      l.top_priority || "",
      l.assessments?.[0]?.total_score ?? "",
      l.assessments?.[0]?.band ?? "",
      new Date(l.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setChangingPassword(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-sm py-24">
          <div className="border border-border rounded p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-display-sm text-foreground">Admin Access</h1>
              <p className="text-xs text-muted-foreground mt-1">Sign in to view lead data</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-email" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="admin-password" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-24 text-center text-muted-foreground">Checking access…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-sm py-24 text-center space-y-4">
          <h1 className="text-display-sm text-foreground">Access Denied</h1>
          <p className="text-sm text-muted-foreground">Your account does not have admin privileges.</p>
          <Button variant="outline" onClick={() => { supabase.auth.signOut(); setAuthed(false); setIsAdmin(null); }}>
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">Dashboard</p>
            <h1 className="text-display-sm text-foreground">Lead Management</h1>
            <p className="text-sm text-muted-foreground mt-1">{filteredLeads.length} leads total</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Select value={bandFilter} onValueChange={setBandFilter}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Filter by maturity band" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bands</SelectItem>
                <SelectItem value="Transformation-Ready">Transformation-Ready</SelectItem>
                <SelectItem value="Operational but Fragmented">Operational but Fragmented</SelectItem>
                <SelectItem value="Early Stage">Early Stage</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => setShowPasswordForm(!showPasswordForm)}>
              <KeyRound className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>

        {showPasswordForm && (
          <div className="border border-border rounded p-6 mb-8 max-w-md">
            <h2 className="text-sm font-semibold text-foreground mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="new-password" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">New Password</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Confirm Password</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="hero" disabled={changingPassword}>
                  {changingPassword ? "Updating…" : "Update Password"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowPasswordForm(false); setNewPassword(""); setConfirmPassword(""); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="border border-border rounded overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">Name</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">Email</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">Brokerage</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">Agents</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">Priority</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">Score</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">Band</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-12 text-sm">
                      No leads recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium text-sm">{[l.first_name, l.last_name].filter(Boolean).join(" ") || "—"}</TableCell>
                      <TableCell className="text-sm">{l.email}</TableCell>
                      <TableCell className="text-sm">{l.brokerage_name || "—"}</TableCell>
                      <TableCell className="text-sm">{l.agent_count || "—"}</TableCell>
                      <TableCell className="text-sm">{l.top_priority || "—"}</TableCell>
                      <TableCell className="text-sm font-medium">{l.assessments?.[0]?.total_score ?? "—"}</TableCell>
                      <TableCell>
                        {l.assessments?.[0]?.band ? (
                          <span className={`text-xs font-medium px-2.5 py-1 rounded ${
                            l.assessments[0].band === "Transformation-Ready" ? "bg-success/10 text-success" :
                            l.assessments[0].band === "Operational but Fragmented" ? "bg-warning/10 text-warning" :
                            "bg-destructive/10 text-destructive"
                          }`}>
                            {l.assessments[0].band}
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}