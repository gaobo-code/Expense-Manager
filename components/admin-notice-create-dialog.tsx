"use client";

import { createNotice } from "@/app/admin/(console)/notices/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function AdminNoticeCreateDialog() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function close() {
    setOpen(false);
    setPreview((current) => { if (current) URL.revokeObjectURL(current); return null; });
  }

  function selectThumbnail(file?: File) {
    setPreview((current) => { if (current) URL.revokeObjectURL(current); return file ? URL.createObjectURL(file) : null; });
  }

  return <>
    <Button onClick={() => setOpen(true)} className="h-11 rounded-xl bg-emerald-600 px-5 shadow-sm hover:bg-emerald-700"><Plus />添加提示</Button>
    {open ? <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label="关闭添加提示窗口" onClick={close} className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" />
      <div role="dialog" aria-modal="true" aria-labelledby="notice-dialog-title" className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-xl sm:rounded-2xl sm:p-7">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />
        <div className="mb-6 flex items-start justify-between gap-4">
          <div><h2 id="notice-dialog-title" className="text-xl font-bold">添加提示</h2><p className="mt-1 text-sm text-slate-500">填写标题、内容并上传一张缩略图。</p></div>
          <button type="button" aria-label="关闭" onClick={close} className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"><X size={18}/></button>
        </div>
        <form action={createNotice} className="space-y-5">
          <div className="space-y-2"><Label htmlFor="notice-title">提示标题</Label><Input id="notice-title" name="title" required maxLength={120} autoFocus className="h-11 rounded-xl" placeholder="请输入提示标题" /></div>
          <div className="space-y-2"><Label htmlFor="notice-content">提示内容</Label><textarea id="notice-content" name="content" required maxLength={5000} rows={6} className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/30" placeholder="请输入提示内容" /></div>
          <div className="space-y-2">
            <Label htmlFor="notice-thumbnail">提示缩略图</Label>
            <input ref={inputRef} id="notice-thumbnail" name="thumbnail" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required className="sr-only" onChange={(event) => selectThumbnail(event.target.files?.[0])} />
            <button type="button" onClick={() => inputRef.current?.click()} className="relative grid aspect-[16/7] w-full place-items-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500 transition hover:border-emerald-300 hover:bg-emerald-50/50">
              {preview ? <Image src={preview} alt="缩略图预览" fill unoptimized className="object-cover" /> : <span className="flex flex-col items-center gap-2 text-sm"><ImagePlus size={28}/><span>点击选择图片</span><span className="text-xs text-slate-400">JPG、PNG、WebP 或 GIF，最大 2MB</span></span>}
            </button>
          </div>
          <div className="flex gap-3 pt-1"><Button type="button" variant="outline" onClick={close} className="h-11 flex-1 rounded-xl">取消</Button><Button type="submit" className="h-11 flex-[1.5] rounded-xl bg-emerald-600 hover:bg-emerald-700">确认添加</Button></div>
        </form>
      </div>
    </div> : null}
  </>;
}
