import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { AGENT_COUNT_OPTIONS, TOP_PRIORITY_OPTIONS } from "@/lib/scorecard-config";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function LeadCaptureForm() {
  const navigate = useNavigate();
  const { setLead } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    brokerageName: "",
    agentCount: "",
    topPriority: "",
    consent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) {
      toast.error("Email is required.");
      return;
    }
    if (!form.consent) {
      toast.error("Please agree to the terms to continue.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .insert({
          first_name: form.firstName || null,
          last_name: form.lastName || null,
          email: form.email,
          brokerage_name: form.brokerageName || null,
          agent_count: form.agentCount || null,
          top_priority: form.topPriority || null,
          consent: form.consent,
        })
        .select("id")
        .single();

      if (error) throw error;

      setLead({
        id: data.id,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        brokerageName: form.brokerageName,
        agentCount: form.agentCount,
        topPriority: form.topPriority,
        consent: form.consent,
      });

      toast.success("You're in! Starting your scorecard...");
      navigate("/scorecard");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            placeholder="Jane"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            placeholder="Smith"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="jane@brokerage.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="brokerage">Brokerage Name</Label>
        <Input
          id="brokerage"
          value={form.brokerageName}
          onChange={(e) => setForm({ ...form, brokerageName: e.target.value })}
          placeholder="Acme Realty"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Agent Count</Label>
          <Select value={form.agentCount} onValueChange={(v) => setForm({ ...form, agentCount: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {AGENT_COUNT_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Top AI Priority</Label>
          <Select value={form.topPriority} onValueChange={(v) => setForm({ ...form, topPriority: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {TOP_PRIORITY_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-start gap-3 pt-2">
        <Checkbox
          id="consent"
          checked={form.consent}
          onCheckedChange={(checked) => setForm({ ...form, consent: checked === true })}
        />
        <Label htmlFor="consent" className="text-sm text-muted-foreground leading-snug cursor-pointer">
          I agree to receive communications about AI transformation resources and strategy insights. You can unsubscribe at any time.
        </Label>
      </div>

      <Button type="submit" variant="hero" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Start the 10-Minute Scorecard"}
      </Button>
    </form>
  );
}
