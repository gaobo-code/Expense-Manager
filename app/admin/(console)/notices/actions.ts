"use server";

import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxThumbnailSize = 2 * 1024 * 1024;

function readNoticeId(formData: FormData) {
  const noticeId = Number(String(formData.get("noticeId") ?? ""));
  return Number.isSafeInteger(noticeId) && noticeId > 0 ? noticeId : null;
}

export async function createNotice(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const thumbnail = formData.get("thumbnail");

  if (!title || title.length > 120 || !content || content.length > 5000) redirect("/admin/notices?error=invalid");
  if (!(thumbnail instanceof File) || thumbnail.size < 1 || thumbnail.size > maxThumbnailSize || !acceptedImageTypes.has(thumbnail.type)) {
    redirect("/admin/notices?error=image");
  }

  const thumbnailBase64 = Buffer.from(await thumbnail.arrayBuffer()).toString("base64");
  const { supabase, tokenHash } = await requireAdmin();
  const { error } = await supabase.rpc("admin_create_notice", {
    session_token_hash: tokenHash,
    notice_title: title,
    notice_content: content,
    thumbnail_base64: thumbnailBase64,
    thumbnail_content_type: thumbnail.type,
  });

  if (error) redirect("/admin/notices?error=create");
  revalidatePath("/admin/notices");
  redirect("/admin/notices?created=1");
}

export async function updateNotice(formData: FormData) {
  const noticeId = readNoticeId(formData);
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const thumbnail = formData.get("thumbnail");

  if (noticeId === null || !title || title.length > 120 || !content || content.length > 5000) redirect("/admin/notices?error=invalid");
  const hasNewThumbnail = thumbnail instanceof File && thumbnail.size > 0;
  if (hasNewThumbnail && (thumbnail.size > maxThumbnailSize || !acceptedImageTypes.has(thumbnail.type))) redirect("/admin/notices?error=image");

  const thumbnailBase64 = hasNewThumbnail ? Buffer.from(await thumbnail.arrayBuffer()).toString("base64") : null;
  const { supabase, tokenHash } = await requireAdmin();
  const { error } = await supabase.rpc("admin_update_notice", {
    session_token_hash: tokenHash,
    notice_id: noticeId,
    notice_title: title,
    notice_content: content,
    thumbnail_base64: thumbnailBase64,
    thumbnail_content_type: hasNewThumbnail ? thumbnail.type : null,
  });

  if (error) redirect("/admin/notices?error=update");
  revalidatePath("/admin/notices");
  redirect("/admin/notices?updated=1");
}

export async function deleteNotice(formData: FormData) {
  const noticeId = readNoticeId(formData);
  if (noticeId === null) redirect("/admin/notices?error=delete");

  const { supabase, tokenHash } = await requireAdmin();
  const { error } = await supabase.rpc("admin_delete_notice", { session_token_hash: tokenHash, notice_id: noticeId });
  if (error) redirect("/admin/notices?error=delete");
  revalidatePath("/admin/notices");
  redirect("/admin/notices");
}
