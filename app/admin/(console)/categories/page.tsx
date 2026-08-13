import { AdminCategoryCreateDialog } from "@/components/admin-category-create-dialog";
import { requireAdmin } from "@/lib/admin";
import type { Category } from "@/lib/categories";
import { Folder, FolderTree } from "lucide-react";

export const instant = false;
export const metadata = { title: "类别 | 管理员控制台" };

export default async function AdminCategoriesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ supabase, tokenHash }, query] = await Promise.all([requireAdmin(), searchParams]);
  const { data, error } = await supabase.rpc("admin_list_categories", { session_token_hash: tokenHash });
  const categories = (data ?? []) as Category[];
  const roots = categories.filter((item) => item.parent_id === null);
  const children = new Map<number, Category[]>();
  for (const item of categories) if (item.parent_id !== null) children.set(item.parent_id, [...(children.get(item.parent_id) ?? []), item]);

  return <section className="space-y-5 sm:space-y-7">
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0"><p className="mb-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 sm:text-sm">Money Manager</p><h1 className="text-2xl font-bold tracking-tight sm:text-4xl">类别管理</h1><p className="mt-2 hidden text-sm text-slate-500 sm:block">维护所有用户共享的一级与二级类别</p></div>
      <AdminCategoryCreateDialog roots={roots}/>
    </div>

    {query.error ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">添加失败，请检查名称和上级类别后重试。</p> : null}

    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6"><div><h2 className="font-semibold">通用类别列表</h2><p className="mt-1 text-xs text-slate-500 sm:text-sm">一级类别 {roots.length} 个，二级类别 {categories.length - roots.length} 个</p></div><span className="text-sm text-slate-500">共 {categories.length} 项</span></div>

      <div className="hidden grid-cols-[minmax(220px,1fr)_minmax(180px,1fr)_100px] border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid"><span>中文名称</span><span>英文名称</span><span className="text-right">层级</span></div>

      {error ? <p className="p-6 text-sm text-red-600">无法读取类别，请先应用最新的 Supabase 迁移。</p> : roots.length === 0 ? <div className="grid min-h-64 place-items-center p-6 text-center"><div><FolderTree className="mx-auto text-slate-300" size={36}/><p className="mt-4 font-semibold">还没有通用类别</p><p className="mt-1 text-sm text-slate-500">点击“添加类别”创建第一个一级类别</p></div></div> :
      <div className="divide-y divide-slate-200">{roots.map((root) => {
        const items = children.get(root.id) ?? [];
        return <div key={root.id}>
          <div className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-l-4 border-emerald-500 bg-emerald-50/50 px-4 py-3 sm:grid-cols-[minmax(220px,1fr)_minmax(180px,1fr)_100px] sm:px-6">
            <div className="flex min-w-0 items-center gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-100"><Folder size={18} className="fill-emerald-100 text-emerald-700"/></span><span className="truncate font-bold text-slate-900">{root.name_zh}</span><span className="truncate text-sm text-slate-500 sm:hidden">{root.name_en}</span></div>
            <span className="hidden truncate text-sm text-slate-500 sm:block">{root.name_en}</span>
            <span className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white sm:justify-self-end">一级</span>
          </div>
          {items.length ? <div className="border-t border-emerald-100 bg-slate-50">{items.map((child, index) => <div key={child.id} className={`relative grid min-h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 pl-14 sm:grid-cols-[minmax(220px,1fr)_minmax(180px,1fr)_100px] sm:px-6 sm:pl-16 ${index ? "border-t border-slate-200/70" : ""}`}>
            <span className="absolute left-7 top-0 h-1/2 w-5 border-b-2 border-l-2 border-emerald-200 sm:left-9"/>
            <div className="flex min-w-0 items-center gap-2"><span className="truncate text-sm font-medium text-slate-700">{child.name_zh}</span><span className="truncate text-xs text-slate-400 sm:hidden">{child.name_en}</span></div>
            <span className="hidden truncate text-sm text-slate-500 sm:block">{child.name_en}</span>
            <span className="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-600 sm:justify-self-end">二级</span>
          </div>)}</div> : <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 pl-12 text-xs text-slate-400 sm:pl-14">暂无二级类别</div>}
        </div>;
      })}</div>}
    </div>
  </section>;
}
