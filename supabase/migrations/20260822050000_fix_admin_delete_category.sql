create or replace function public.admin_delete_category(session_token_hash text, category_id bigint)
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.verify_admin_session($1) is null then
    raise exception 'unauthorized';
  end if;

  if not exists (select 1 from public.categories c where c.id = $2 and c.user_id is null) then
    raise exception 'category_not_found';
  end if;

  if exists (
    select 1
    from public.transactions t
    join public.categories c on c.id = t.category_id
    where c.id = $2 or c.parent_id = $2
  ) then
    raise exception using errcode = '23503', message = 'category_in_use';
  end if;

  delete from public.categories c where c.id = $2 and c.user_id is null;
end; $$;

grant execute on function public.admin_delete_category(text,bigint) to anon, authenticated;
