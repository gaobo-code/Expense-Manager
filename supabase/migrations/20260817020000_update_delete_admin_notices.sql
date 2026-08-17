create or replace function public.admin_update_notice(
  session_token_hash text,
  notice_id bigint,
  notice_title text,
  notice_content text,
  thumbnail_base64 text default null,
  thumbnail_content_type text default null
)
returns void language plpgsql security definer set search_path = public as $$
declare
  thumbnail_bytes bytea;
begin
  if public.verify_admin_session(session_token_hash) is null then raise exception 'unauthorized'; end if;
  if not exists (select 1 from public.notices where id = notice_id) then raise exception 'notice not found'; end if;

  if thumbnail_base64 is not null then
    if thumbnail_content_type not in ('image/jpeg', 'image/png', 'image/webp', 'image/gif') then raise exception 'invalid image type'; end if;
    thumbnail_bytes := decode(thumbnail_base64, 'base64');
    if octet_length(thumbnail_bytes) < 1 or octet_length(thumbnail_bytes) > 2097152 then raise exception 'invalid image size'; end if;
  end if;

  update public.notices
  set title = trim(notice_title),
      content = trim(notice_content),
      thumbnail = coalesce(thumbnail_bytes, thumbnail),
      thumbnail_mime = case when thumbnail_bytes is null then thumbnail_mime else thumbnail_content_type end
  where id = notice_id;
end;
$$;

create or replace function public.admin_delete_notice(session_token_hash text, notice_id bigint)
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.verify_admin_session(session_token_hash) is null then raise exception 'unauthorized'; end if;
  delete from public.notices where id = notice_id;
end;
$$;

grant execute on function public.admin_update_notice(text,bigint,text,text,text,text), public.admin_delete_notice(text,bigint) to anon, authenticated;
