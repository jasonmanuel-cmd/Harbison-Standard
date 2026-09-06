"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin session exists
    const session = localStorage.getItem("admin_session");
    if (session === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/admin");
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    localStorage.removeItem("admin_login_time");
    router.push("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy via-navy/95 to-navy/90 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <div className="bg-white border-b border-navy/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 border-2 border-brass rounded-full flex items-center justify-center bg-white">
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-brass -translate-x-1/2"></div>
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-brass -translate-y-1/2"></div>
              <span className="font-serif text-lg text-brass font-bold relative z-10">H</span>
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-navy">Admin Dashboard</h1>
              <p className="text-xs text-navy/60 uppercase tracking-wider">CRM Management</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-navy/70 hover:text-navy font-semibold text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Stats Cards */}
          {[
            { label: "Hot Leads", value: "12", color: "brass" },
            { label: "Warm Leads", value: "28", color: "blue" },
            { label: "Nurture", value: "45", color: "navy" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg border border-navy/10 p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-navy/60 font-semibold text-sm uppercase tracking-wider mb-2">{stat.label}</p>
              <p className={`font-serif text-4xl font-bold text-${stat.color} mb-2`}>{stat.value}</p>
              <p className="text-navy/60 text-xs">Active opportunities</p>
            </div>
          ))}
        </div>

        {/* Lead Board */}
        <div className="bg-white rounded-lg border border-navy/10 shadow-sm overflow-hidden">
          <div className="border-b border-navy/10 p-6">
            <h2 className="font-serif text-2xl text-navy font-bold">Lead Pipeline</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy/10 bg-navy/5">
                  <th className="px-6 py-4 text-left font-semibold text-navy/70 text-sm uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-navy/70 text-sm uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-navy/70 text-sm uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-navy/70 text-sm uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-navy/70 text-sm uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "John Martinez", property: "2574 Crestline Dr", status: "Hot", score: 85 },
                  { name: "Sarah Johnson", property: "21213 Windsong St", status: "Warm", score: 72 },
                  { name: "Mike Chen", property: "10618 Sheridan St", status: "Warm", score: 68 },
                  { name: "Lisa Davis", property: "9664 Mendiburu Rd", status: "Hot", score: 92 },
                  { name: "Robert Wilson", property: "17400 Alsab Pl", status: "Nurture", score: 45 },
                ].map((lead, idx) => (
                  <tr key={idx} className="border-b border-navy/5 hover:bg-navy/2 transition-colors">
                    <td className="px-6 py-4 text-navy font-medium">{lead.name}</td>
                    <td className="px-6 py-4 text-navy/70 text-sm">{lead.property}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded text-white ${
                          lead.status === "Hot"
                            ? "bg-red-500"
                            : lead.status === "Warm"
                              ? "bg-orange-500"
                              : "bg-blue-500"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-navy/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brass"
                            style={{ width: `${lead.score}%` }}
                          ></div>
                        </div>
                        <span className="text-navy font-bold text-sm">{lead.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-brass hover:text-brass/80 font-semibold text-sm transition-colors">
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-navy/10 p-6 shadow-sm">
            <h3 className="font-serif text-lg text-navy font-bold mb-4">Monthly Performance</h3>
            <div className="space-y-3">
              {[
                { metric: "Offers Made", value: "18" },
                { metric: "Accepted", value: "14" },
                { metric: "Closed", value: "11" },
                { metric: "Avg. Close Time", value: "16 days" },
              ].map((item) => (
                <div key={item.metric} className="flex justify-between items-center border-b border-navy/10 pb-3 last:border-0">
                  <span className="text-navy/70">{item.metric}</span>
                  <span className="font-bold text-navy">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-navy/10 p-6 shadow-sm">
            <h3 className="font-serif text-lg text-navy font-bold mb-4">Portfolio Summary</h3>
            <div className="space-y-3">
              {[
                { metric: "Total Acquisition Volume", value: "$3.2M" },
                { metric: "Average Offer Price", value: "$285K" },
                { metric: "Days in Pipeline", value: "22" },
                { metric: "Success Rate", value: "77%" },
              ].map((item) => (
                <div key={item.metric} className="flex justify-between items-center border-b border-navy/10 pb-3 last:border-0">
                  <span className="text-navy/70">{item.metric}</span>
                  <span className="font-bold text-brass">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
