alter table public.notices rename column title to title_zh;
alter table public.notices rename column content to content_zh;
alter table public.notices add column title_en text;
alter table public.notices add column content_en text;

update public.notices
set title_en = title_zh,
    content_en = content_zh;

alter table public.notices alter column title_en set not null;
alter table public.notices alter column content_en set not null;
alter table public.notices add constraint notices_title_en_length check (char_length(title_en) between 1 and 120);
alter table public.notices add constraint notices_content_en_length check (char_length(content_en) between 1 and 5000);

drop function if exists public.admin_list_notices(text);
create function public.admin_list_notices(session_token_hash text)
returns table (id bigint, title_zh text, content_zh text, title_en text, content_en text, thumbnail_data text, thumbnail_mime text, created_at timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  if public.verify_admin_session(session_token_hash) is null then raise exception 'unauthorized'; end if;
  return query
    select n.id, n.title_zh, n.content_zh, n.title_en, n.content_en, encode(n.thumbnail, 'base64'), n.thumbnail_mime, n.created_at
    from public.notices n
    order by n.created_at desc, n.id desc;
end;
$$;

drop function if exists public.admin_create_notice(text,text,text,text,text);
create function public.admin_create_notice(
  session_token_hash text,
  notice_title_zh text,
  notice_content_zh text,
  notice_title_en text,
  notice_content_en text,
  thumbnail_base64 text,
  thumbnail_content_type text
)
returns bigint language plpgsql security definer set search_path = public as $$
declare
  notice_id bigint;
  thumbnail_bytes bytea;
begin
  if public.verify_admin_session(session_token_hash) is null then raise exception 'unauthorized'; end if;
  if thumbnail_content_type not in ('image/jpeg', 'image/png', 'image/webp', 'image/gif') then raise exception 'invalid image type'; end if;
  thumbnail_bytes := decode(thumbnail_base64, 'base64');
  if octet_length(thumbnail_bytes) < 1 or octet_length(thumbnail_bytes) > 2097152 then raise exception 'invalid image size'; end if;

  insert into public.notices (title_zh, content_zh, title_en, content_en, thumbnail, thumbnail_mime)
  values (trim(notice_title_zh), trim(notice_content_zh), trim(notice_title_en), trim(notice_content_en), thumbnail_bytes, thumbnail_content_type)
  returning id into notice_id;
  return notice_id;
end;
$$;

drop function if exists public.admin_update_notice(text,bigint,text,text,text,text);
create function public.admin_update_notice(
  session_token_hash text,
  notice_id bigint,
  notice_title_zh text,
  notice_content_zh text,
  notice_title_en text,
  notice_content_en text,
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
  set title_zh = trim(notice_title_zh),
      content_zh = trim(notice_content_zh),
      title_en = trim(notice_title_en),
      content_en = trim(notice_content_en),
      thumbnail = coalesce(thumbnail_bytes, thumbnail),
      thumbnail_mime = case when thumbnail_bytes is null then thumbnail_mime else thumbnail_content_type end
  where id = notice_id;
end;
$$;

drop function if exists public.list_notices();
create function public.list_notices()
returns table (id bigint, title_zh text, content_zh text, title_en text, content_en text, thumbnail_data text, thumbnail_mime text, created_at timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  if (select auth.uid()) is null then raise exception 'unauthorized'; end if;
  return query
    select n.id, n.title_zh, n.content_zh, n.title_en, n.content_en, encode(n.thumbnail, 'base64'), n.thumbnail_mime, n.created_at
    from public.notices n
    order by n.created_at desc, n.id desc;
end;
$$;

revoke all on function public.list_notices() from public, anon;
grant execute on function public.list_notices() to authenticated;
grant execute on function public.admin_list_notices(text), public.admin_create_notice(text,text,text,text,text,text,text), public.admin_update_notice(text,bigint,text,text,text,text,text,text) to anon, authenticated;
