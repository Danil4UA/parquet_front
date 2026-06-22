"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import productsServices from "@/services/productsServices";
import { categoryOptions } from "@/Utils/productsUtils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { categoryRecommendationsKey } from "@/constants/queryKey";

interface CategoryRecommendation {
  fromCategory: string;
  recommends: string[];
}

export default function AdminRecommendationsPage() {
  const { data: session } = useSession();

  const { data, isPending } = useQuery({
    queryKey: [categoryRecommendationsKey],
    queryFn: () => productsServices.getRecommendations(session),
    enabled: !!session?.accessToken
  });

  const [map, setMap] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (Array.isArray(data)) {
      const next: Record<string, string[]> = {};
      (data as CategoryRecommendation[]).forEach((r) => {
        next[r.fromCategory] = r.recommends || [];
      });
      setMap(next);
    }
  }, [data]);

  const toggle = (from: string, to: string, checked: boolean) => {
    setMap((prev) => {
      const current = new Set(prev[from] || []);
      if (checked) {
        current.add(to);
      } else {
        current.delete(to);
      }
      return { ...prev, [from]: Array.from(current) };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const recommendations = categoryOptions.map((c) => ({
        fromCategory: c.id,
        recommends: map[c.id] || []
      }));
      await productsServices.saveRecommendations(session, recommendations);
      toast.success("Recommendations saved");
    } catch {
      toast.error("Failed to save recommendations");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-58px)] w-full">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Category recommendations</h1>
        <p className="text-sm text-gray-500 mt-1">
          For each category, choose which categories to recommend on the product page
          (&quot;Specials for you&quot;). If a category has none, products from the same
          category are shown.
        </p>
      </div>

      {isPending ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {categoryOptions.map((from) => (
            <div key={from.id} className="border border-gray-200 rounded-xl p-4 bg-white">
              <h3 className="font-semibold text-gray-800 mb-3">{from.name}</h3>
              <div className="flex flex-wrap gap-4">
                {categoryOptions
                  .filter((to) => to.id !== from.id)
                  .map((to) => {
                    const checked = (map[from.id] || []).includes(to.id);
                    return (
                      <label
                        key={to.id}
                        className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(c) => toggle(from.id, to.id, c as boolean)}
                        />
                        {to.name}
                      </label>
                    );
                  })}
              </div>
            </div>
          ))}

          <Button onClick={handleSave} disabled={saving} className="bg-gray-900 hover:bg-black text-white">
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
}
