"use client";

import { deleteNotice, updateNotice } from "@/app/admin/(console)/notices/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Notice } from "@/lib/notices";
import { ImagePlus, Pencil, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function AdminNoticeActions({ notice }: { notice: Notice }) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentThumbnail = `data:${notice.thumbnail_mime};base64,${notice.thumbnail_data}`;

  useEffect(() => {
    if (!open && !confirmDelete) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open, confirmDelete]);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function close() {
    setOpen(false);
    setPreview((current) => { if (current) URL.revokeObjectURL(current); return null; });
  }

  function selectThumbnail(file?: File) {
    setPreview((current) => { if (current) URL.revokeObjectURL(current); return file ? URL.createObjectURL(file) : null; });
  }

  return <>
    <div className="flex shrink-0 items-center gap-1">
      <Button type="button" variant="ghost" size="icon" aria-label="修改提示" title="修改提示" onClick={() => setOpen(true)} className="size-8 rounded-lg border border-white/80 bg-white/90 text-slate-600 shadow-md shadow-slate-900/10 backdrop-blur-md hover:bg-emerald-50 hover:text-emerald-700"><Pencil className="size-3.5"/></Button>
      <Button type="button" variant="ghost" size="icon" aria-label="删除提示" title="删除提示" onClick={() => setConfirmDelete(true)} className="size-8 rounded-lg border border-red-100 bg-white/90 text-red-600 shadow-md shadow-slate-900/10 backdrop-blur-md hover:bg-red-50 hover:text-red-700"><Trash2 className="size-3.5"/></Button>
    </div>

    {confirmDelete ? <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <button type="button" aria-label="取消删除" onClick={() => setConfirmDelete(false)} className="absolute inset-0 bg-slate-950/40" />
      <div role="alertdialog" aria-modal="true" aria-labelledby={`delete-notice-${notice.id}`} className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 id={`delete-notice-${notice.id}`} className="text-lg font-bold text-slate-950">删除这条提示？</h2>
        <form action={deleteNotice} className="mt-6 flex justify-end gap-3">
          <input type="hidden" name="noticeId" value={notice.id}/>
          <Button type="button" variant="ghost" onClick={() => setConfirmDelete(false)} className="rounded-lg text-slate-600">取消</Button>
          <Button type="submit" className="rounded-lg bg-red-600 px-5 text-white hover:bg-red-700">删除</Button>
        </form>
      </div>
    </div> : null}

    {open ? <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label="关闭修改提示窗口" onClick={close} className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" />
      <div role="dialog" aria-modal="true" aria-labelledby={`edit-notice-${notice.id}`} className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 text-left shadow-2xl sm:max-w-xl sm:rounded-2xl sm:p-7">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />
        <div className="mb-6 flex items-start justify-between gap-4">
          <div><h2 id={`edit-notice-${notice.id}`} className="text-xl font-bold">修改提示</h2><p className="mt-1 text-sm text-slate-500">不选择新图片时将保留当前缩略图。</p></div>
          <button type="button" aria-label="关闭" onClick={close} className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"><X size={18}/></button>
        </div>
        <form action={updateNotice} className="space-y-5">
          <input type="hidden" name="noticeId" value={notice.id}/>
          <div className="space-y-2"><Label htmlFor={`notice-title-zh-${notice.id}`}>中文标题</Label><Input id={`notice-title-zh-${notice.id}`} name="titleZh" required maxLength={120} autoFocus defaultValue={notice.title_zh} className="h-11 rounded-xl" /></div>
          <div className="space-y-2"><Label htmlFor={`notice-content-zh-${notice.id}`}>中文内容</Label><textarea id={`notice-content-zh-${notice.id}`} name="contentZh" required maxLength={5000} rows={4} defaultValue={notice.content_zh} className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30" /></div>
          <div className="space-y-2"><Label htmlFor={`notice-title-en-${notice.id}`}>英文标题</Label><Input id={`notice-title-en-${notice.id}`} name="titleEn" required maxLength={120} defaultValue={notice.title_en} className="h-11 rounded-xl" /></div>
          <div className="space-y-2"><Label htmlFor={`notice-content-en-${notice.id}`}>英文内容</Label><textarea id={`notice-content-en-${notice.id}`} name="contentEn" required maxLength={5000} rows={4} defaultValue={notice.content_en} className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30" /></div>
          <div className="space-y-2">
            <Label htmlFor={`notice-thumbnail-${notice.id}`}>提示缩略图</Label>
            <input ref={inputRef} id={`notice-thumbnail-${notice.id}`} name="thumbnail" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(event) => selectThumbnail(event.target.files?.[0])}/>
            <button type="button" onClick={() => inputRef.current?.click()} className="relative grid aspect-[16/7] w-full place-items-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500 transition hover:border-emerald-300">
              <Image src={preview ?? currentThumbnail} alt="缩略图预览" fill unoptimized className="object-cover"/>
              <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-slate-950/75 px-3 py-2 text-xs font-medium text-white"><ImagePlus size={15}/>替换图片</span>
            </button>
            <p className="text-xs text-slate-500">JPG、PNG、WebP 或 GIF，最大 2MB</p>
          </div>
          <div className="flex gap-3 pt-1"><Button type="button" variant="outline" onClick={close} className="h-11 flex-1 rounded-xl">取消</Button><Button type="submit" className="h-11 flex-[1.5] rounded-xl bg-emerald-600 hover:bg-emerald-700">保存修改</Button></div>
        </form>
      </div>
    </div> : null}
  </>;
}
