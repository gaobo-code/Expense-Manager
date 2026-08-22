alter table public.categories add column if not exists amount_effect text not null default 'decrease'
  check (amount_effect in ('increase', 'decrease'));

update public.categories set amount_effect = 'increase'
where parent_id is null and (name_zh ~ '收入' or name_en ~* '(^|[[:space:]])income([[:space:]]|$)');
update public.categories child set amount_effect = parent.amount_effect
from public.categories parent where child.parent_id = parent.id;

create or replace function public.validate_category_parent() returns trigger language plpgsql set search_path = public as $$
declare parent_user_id uuid; parent_parent_id bigint; parent_amount_effect text;
begin
  if new.parent_id is null then return new; end if;
  select user_id, parent_id, amount_effect into parent_user_id, parent_parent_id, parent_amount_effect from public.categories where id = new.parent_id;
  if not found then raise exception 'Parent category does not exist'; end if;
  if parent_parent_id is not null then raise exception 'Categories support only two levels'; end if;
  if parent_user_id is not null and parent_user_id is distinct from new.user_id then raise exception 'A category cannot use another user''s category as its parent'; end if;
  new.amount_effect := parent_amount_effect;
  return new;
end; $$;

drop function if exists public.admin_create_category(text,text,text,bigint);
create function public.admin_create_category(session_token_hash text, category_name_zh text, category_name_en text, category_parent_id bigint default null, category_amount_effect text default null)
returns bigint language plpgsql security definer set search_path = public as $$
declare new_id bigint;
begin
  if public.verify_admin_session(session_token_hash) is null then raise exception 'unauthorized'; end if;
  if trim(category_name_zh) = '' or trim(category_name_en) = '' then raise exception 'Chinese and English names are required'; end if;
  if category_parent_id is null and category_amount_effect not in ('increase', 'decrease') then raise exception 'Amount effect is required'; end if;
  insert into public.categories(parent_id,user_id,name_zh,name_en,amount_effect) values (category_parent_id,null,trim(category_name_zh),trim(category_name_en),coalesce(category_amount_effect,'decrease')) returning id into new_id;
  return new_id;
end; $$;
grant execute on function public.admin_create_category(text,text,text,bigint,text) to anon, authenticated;
