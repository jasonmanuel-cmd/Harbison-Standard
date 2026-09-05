import { redirect } from "next/navigation";

export const dynamic = "force-static";

export default function SellPage() {
  // Redirect to the new /offer page for sellers
  redirect("/offer");
}
