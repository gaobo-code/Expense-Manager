create or replace function public.admin_update_category(
  session_token_hash text,
  category_id bigint,
  category_name_zh text,
  category_name_en text
)
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.verify_admin_session(session_token_hash) is null then
    raise exception 'unauthorized';
  end if;
  if trim(category_name_zh) = '' or trim(category_name_en) = '' then
    raise exception 'Chinese and English names are required';
  end if;

  update public.categories
  set name_zh = trim(category_name_zh),
      name_en = trim(category_name_en),
      updated_at = now()
  where id = category_id and user_id is null;

  if not found then
    raise exception 'Category does not exist';
  end if;
end; $$;

grant execute on function public.admin_update_category(text,bigint,text,text) to anon, authenticated;
