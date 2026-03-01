import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Download, LogIn } from "lucide-react";
import { toast } from "sonner";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [bandFilter, setBandFilter] = useState("all");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setAuthed(true);
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange((_, session) => {
      if (session) setAuthed(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setAuthed(true);
    });
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchLeads();
  }, [authed]);

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

  if (!authed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-sm py-20">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h1 className="text-xl font-semibold text-foreground text-center">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Leads Dashboard</h1>
            <p className="text-sm text-muted-foreground">{filteredLeads.length} leads</p>
          </div>
          <div className="flex gap-3">
            <Select value={bandFilter} onValueChange={setBandFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by band" />
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
          </div>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Brokerage</TableHead>
                  <TableHead>Agents</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Band</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                      No leads yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium">{[l.first_name, l.last_name].filter(Boolean).join(" ") || "—"}</TableCell>
                      <TableCell>{l.email}</TableCell>
                      <TableCell>{l.brokerage_name || "—"}</TableCell>
                      <TableCell>{l.agent_count || "—"}</TableCell>
                      <TableCell>{l.top_priority || "—"}</TableCell>
                      <TableCell>{l.assessments?.[0]?.total_score ?? "—"}</TableCell>
                      <TableCell>
                        {l.assessments?.[0]?.band ? (
                          <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                            l.assessments[0].band === "Transformation-Ready" ? "bg-success/10 text-success" :
                            l.assessments[0].band === "Operational but Fragmented" ? "bg-warning/10 text-warning" :
                            "bg-destructive/10 text-destructive"
                          }`}>
                            {l.assessments[0].band}
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</TableCell>
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
