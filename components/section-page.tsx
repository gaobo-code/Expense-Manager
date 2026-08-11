import type { LucideIcon } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export function SectionPage({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <PageShell>
      <section>
        <div className="mb-8 flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Icon size={24} />
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1 text-slate-500">{description}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
          Your {title.toLowerCase()} content will appear here.
        </div>
      </section>
    </PageShell>
  );
}
