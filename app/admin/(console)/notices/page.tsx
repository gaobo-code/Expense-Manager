import { AdminNoticeCreateDialog } from "@/components/admin-notice-create-dialog";
import { AdminNoticeActions } from "@/components/admin-notice-actions";
import { AdminNoticeContent, AdminNoticeTitle } from "@/components/admin-notice-copy";
import { requireAdmin } from "@/lib/admin";
import type { Notice } from "@/lib/notices";
import { BellRing, ImageIcon } from "lucide-react";

export const instant = false;
export const metadata = { title: "提示管理 | 管理员控制台" };

export default async function AdminNoticesPage({ searchParams }: { searchParams: Promise<{ error?: string; created?: string; updated?: string }> }) {
  const [{ supabase, tokenHash }, query] = await Promise.all([requireAdmin(), searchParams]);
  const { data, error } = await supabase.rpc("admin_list_notices", { session_token_hash: tokenHash });
  const notices = (data ?? []) as Notice[];
  const errorMessage = query.error === "image" ? "缩略图格式不支持或超过 2MB，请重新选择。" : query.error ? "操作失败，请检查输入内容后重试。" : null;

  return <section className="space-y-5 sm:space-y-7">
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0"><p className="mb-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 sm:text-sm">Money Manager</p><h1 className="text-2xl font-bold tracking-tight sm:text-4xl">提示管理</h1><p className="mt-2 hidden text-sm text-slate-500 sm:block">创建和管理需要展示给用户的提示内容</p></div>
      <AdminNoticeCreateDialog />
    </div>

    {errorMessage ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
    {query.created ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">提示已添加。</p> : null}
    {query.updated ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">提示已修改。</p> : null}

    <div className="-mx-3 rounded-xl border border-slate-200 bg-white p-1 shadow-sm sm:mx-0 sm:p-6">
      <div className="mb-5 flex items-center justify-between px-1 pt-2 sm:px-0 sm:pt-0"><div><h2 className="font-semibold">提示列表</h2><p className="mt-1 text-xs text-slate-500 sm:text-sm">按创建时间从新到旧排列</p></div><span className="text-sm text-slate-500">共 {notices.length} 项</span></div>
      {error ? <p className="rounded-xl bg-red-50 p-5 text-sm text-red-600">无法读取提示，请先应用最新的 Supabase 迁移。</p> : notices.length === 0 ? <div className="grid min-h-64 place-items-center text-center"><div><BellRing className="mx-auto text-slate-300" size={38}/><p className="mt-4 font-semibold">还没有提示</p><p className="mt-1 text-sm text-slate-500">点击“添加提示”创建第一条内容</p></div></div> :
      <div className="grid gap-2 sm:gap-4 md:grid-cols-2">{notices.map((notice) => <article key={notice.id} className="relative flex h-32 overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md sm:h-auto sm:min-h-44">
        <div className="relative aspect-square h-full w-32 shrink-0 overflow-hidden bg-slate-100 sm:h-44 sm:w-44">
          {notice.thumbnail_data ? <img src={`data:${notice.thumbnail_mime};base64,${notice.thumbnail_data}`} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />}
        </div>
        <div className="min-w-0 flex-1 overflow-hidden p-2 sm:p-5">
          <div className="flex items-center gap-2"><h3 className="min-w-0 flex-1 truncate font-bold text-slate-900"><AdminNoticeTitle zh={notice.title_zh} en={notice.title_en}/></h3><AdminNoticeActions notice={notice}/></div>
          <p className="mt-1 line-clamp-2 overflow-hidden whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-6 text-slate-600 sm:line-clamp-4"><AdminNoticeContent zh={notice.content_zh} en={notice.content_en}/></p>
        </div>
      </article>)}</div>}
    </div>
  </section>;
}
