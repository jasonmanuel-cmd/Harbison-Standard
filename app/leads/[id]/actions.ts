"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const STATUS_VALUES = ["new", "contacted", "appointment", "offer_out", "dead", "closed"];

export async function updateLeadStatus(leadId: string, status: string) {
  if (!STATUS_VALUES.includes(status)) return;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);
  if (error) console.error("[leads/[id]] status update failed", error);

  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/dashboard");
}

export async function updateLeadNotes(leadId: string, agentNotes: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return;

  const { data: existing } = await supabase.from("leads").select("notes").eq("id", leadId).maybeSingle();
  const notes = { ...(existing?.notes as Record<string, unknown> | undefined), agent_notes: agentNotes };

  const { error } = await supabase.from("leads").update({ notes }).eq("id", leadId);
  if (error) console.error("[leads/[id]] notes update failed", error);

  revalidatePath(`/leads/${leadId}`);
}
