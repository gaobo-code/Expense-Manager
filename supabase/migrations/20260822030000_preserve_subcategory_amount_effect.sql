-- Some deployed databases still use the original trigger implementation,
-- which overwrote a subcategory's amount_effect with its parent's value.
create or replace function public.validate_category_parent()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  parent_user_id uuid;
  parent_parent_id bigint;
begin
  if new.parent_id is null then
    return new;
  end if;

  select user_id, parent_id
    into parent_user_id, parent_parent_id
    from public.categories
   where id = new.parent_id;

  if not found then
    raise exception 'Parent category does not exist';
  end if;
  if parent_parent_id is not null then
    raise exception 'Categories support only two levels';
  end if;
  if parent_user_id is not null and parent_user_id is distinct from new.user_id then
    raise exception 'A category cannot use another user''s category as its parent';
  end if;

  return new;
end;
$$;
