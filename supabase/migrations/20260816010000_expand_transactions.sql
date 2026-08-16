alter table public.transactions
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists transaction_time time not null default '12:00',
  add column if not exists category_id bigint references public.categories(id) on delete restrict,
  add column if not exists account_type text not null default 'cash',
  add column if not exists currency text not null default 'CNY',
  add column if not exists customer_id bigint references public.customers(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

alter table public.transactions drop constraint if exists transactions_transaction_date_amount_category_key;
alter table public.transactions drop constraint if exists transactions_account_type_check;
alter table public.transactions add constraint transactions_account_type_check
  check (account_type in ('credit_card', 'cash', 'bank'));
alter table public.transactions drop constraint if exists transactions_currency_check;
alter table public.transactions add constraint transactions_currency_check
  check (currency in ('USD', 'CNY'));

create index if not exists transactions_user_date_idx
  on public.transactions(user_id, transaction_date desc, transaction_time desc);
create index if not exists transactions_category_id_idx on public.transactions(category_id);
create index if not exists transactions_customer_id_idx on public.transactions(customer_id);

drop policy if exists "Transactions are publicly readable" on public.transactions;
drop policy if exists "Users can view own transactions" on public.transactions;
drop policy if exists "Users can create own transactions" on public.transactions;
drop policy if exists "Users can update own transactions" on public.transactions;
drop policy if exists "Users can delete own transactions" on public.transactions;

create policy "Users can view own transactions" on public.transactions for select to authenticated
using (user_id = (select auth.uid()));
create policy "Users can create own transactions" on public.transactions for insert to authenticated
with check (user_id = (select auth.uid()));
create policy "Users can update own transactions" on public.transactions for update to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "Users can delete own transactions" on public.transactions for delete to authenticated
using (user_id = (select auth.uid()));

revoke all on public.transactions from anon;
grant select, insert, update, delete on public.transactions to authenticated;
grant usage, select on sequence public.transactions_id_seq to authenticated;
