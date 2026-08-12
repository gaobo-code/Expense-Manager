alter table public.user_settings
  alter column language drop default,
  alter column language drop not null;

comment on column public.user_settings.language is
  'Explicit language selected in Settings. NULL means use the visitor language selected before login.';
