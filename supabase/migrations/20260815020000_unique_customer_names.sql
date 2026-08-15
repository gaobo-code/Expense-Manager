create unique index if not exists customers_user_name_unique_idx
on public.customers (user_id, lower(name));
