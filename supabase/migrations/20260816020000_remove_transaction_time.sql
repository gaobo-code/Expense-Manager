drop index if exists public.transactions_user_date_idx;
alter table public.transactions drop column if exists transaction_time;
create index if not exists transactions_user_date_idx
  on public.transactions(user_id, transaction_date desc);
