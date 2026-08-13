create or replace function public.admin_list_categories(session_token_hash text)
returns setof public.categories
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.verify_admin_session(session_token_hash) is null then
    raise exception 'unauthorized';
  end if;

  return query
    select *
    from public.categories
    where user_id is null
    order by created_at asc, id asc;
end;
$$;
