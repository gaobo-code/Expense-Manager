create or replace function public.list_notices()
returns table (id bigint, title text, content text, thumbnail_data text, thumbnail_mime text, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'unauthorized';
  end if;

  return query
    select n.id, n.title, n.content, encode(n.thumbnail, 'base64'), n.thumbnail_mime, n.created_at
    from public.notices n
    order by n.created_at desc, n.id desc;
end;
$$;

revoke all on function public.list_notices() from public, anon;
grant execute on function public.list_notices() to authenticated;
