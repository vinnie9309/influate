-- Influate schema: profiles, private contacts, connections, partnerships and logged results.
-- Access is enforced with row-level security; see the policies at the end of each table.

create type public.role as enum ('creator', 'brand');
create type public.connection_status as enum ('pending', 'accepted', 'declined');
create type public.partnership_status as enum ('active', 'ended');

create function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- Profiles: public, one per account ------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  role public.role not null,
  display_name text not null check (char_length(display_name) between 1 and 80),
  headline text not null default '' check (char_length(headline) <= 80),
  bio text not null default '' check (char_length(bio) <= 600),
  city text not null default '' check (char_length(city) <= 80),
  categories text[] not null default '{}',
  platforms text[] not null default '{}',
  audience_age text not null default '',
  followers text not null default '',
  target_audience text not null default '' check (char_length(target_audience) <= 160),
  website text not null default '' check (website = '' or website ~ '^https?://'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);
create index profiles_categories_idx on public.profiles using gin (categories);

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;

-- Public profiles are visible to everyone, signed in or not.
create policy "profiles are public" on public.profiles
  for select to anon, authenticated using (true);

create policy "users update their own profile" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- The role and id can never change; only these columns are writable.
revoke update on public.profiles from authenticated;
grant update (display_name, headline, bio, city, categories, platforms, audience_age, followers, target_audience, website)
  on public.profiles to authenticated;

-- Contacts: private, unlocked by an accepted connection ------------------------------------

create table public.contacts (
  id uuid primary key references public.profiles on delete cascade,
  email text not null default '' check (char_length(email) <= 254),
  phone text not null default '' check (char_length(phone) <= 40),
  links text not null default '' check (char_length(links) <= 300)
);

alter table public.contacts enable row level security;

-- Connections ------------------------------------------------------------------------------

create table public.connections (
  id uuid primary key default gen_random_uuid(),
  from_id uuid not null references public.profiles on delete cascade,
  to_id uuid not null references public.profiles on delete cascade,
  note text not null default '' check (char_length(note) <= 400),
  status public.connection_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (from_id <> to_id)
);

-- One connection per pair of users, whoever asked first.
create unique index connections_pair_idx on public.connections (least(from_id, to_id), greatest(from_id, to_id));
create index connections_to_idx on public.connections (to_id);

create trigger connections_touch before update on public.connections
  for each row execute function public.touch_updated_at();

-- Security definer helpers read across RLS without exposing the underlying rows.
create function public.is_connected(other uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.connections c
    where c.status = 'accepted'
      and ((c.from_id = auth.uid() and c.to_id = other) or (c.to_id = auth.uid() and c.from_id = other))
  )
$$;

create function public.role_of(uid uuid) returns public.role
language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = uid
$$;

create policy "owners and connections read contacts" on public.contacts
  for select to authenticated using (id = auth.uid() or public.is_connected(id));

create policy "users write their own contacts" on public.contacts
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

alter table public.connections enable row level security;

create policy "participants read connections" on public.connections
  for select to authenticated using (auth.uid() in (from_id, to_id));

create policy "users send requests to the other side" on public.connections
  for insert to authenticated with check (
    from_id = auth.uid()
    and status = 'pending'
    and public.role_of(from_id) <> public.role_of(to_id)
  );

-- Only the recipient answers, and only while the request is pending.
create policy "recipients answer requests" on public.connections
  for update to authenticated
  using (to_id = auth.uid() and status = 'pending')
  with check (to_id = auth.uid() and status in ('accepted', 'declined'));

revoke update on public.connections from authenticated;
grant update (status) on public.connections to authenticated;

create policy "participants remove connections" on public.connections
  for delete to authenticated using (auth.uid() in (from_id, to_id));

-- Partnerships -----------------------------------------------------------------------------
-- When an account is deleted its side becomes null, so the other party keeps an anonymised record.

create table public.partnerships (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.profiles on delete set null,
  brand_id uuid references public.profiles on delete set null,
  created_by uuid references public.profiles on delete set null,
  title text not null check (char_length(title) between 1 and 80),
  code text not null check (code ~ '^[A-Z0-9_-]{2,24}$'),
  terms text not null default '' check (char_length(terms) <= 200),
  status public.partnership_status not null default 'active',
  created_at timestamptz not null default now()
);

create index partnerships_creator_idx on public.partnerships (creator_id);
create index partnerships_brand_idx on public.partnerships (brand_id);

create function public.is_partner(partnership uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.partnerships p
    where p.id = partnership and auth.uid() in (p.creator_id, p.brand_id)
  )
$$;

alter table public.partnerships enable row level security;

create policy "participants read partnerships" on public.partnerships
  for select to authenticated using (auth.uid() in (creator_id, brand_id));

create policy "connected pairs start partnerships" on public.partnerships
  for insert to authenticated with check (
    created_by = auth.uid()
    and auth.uid() in (creator_id, brand_id)
    and public.role_of(creator_id) = 'creator'
    and public.role_of(brand_id) = 'brand'
    and public.is_connected(case when auth.uid() = creator_id then brand_id else creator_id end)
    and status = 'active'
  );

create policy "participants end or reactivate" on public.partnerships
  for update to authenticated
  using (auth.uid() in (creator_id, brand_id))
  with check (auth.uid() in (creator_id, brand_id));

revoke update on public.partnerships from authenticated;
grant update (status) on public.partnerships to authenticated;

-- Results ----------------------------------------------------------------------------------

create table public.results (
  id uuid primary key default gen_random_uuid(),
  partnership_id uuid not null references public.partnerships on delete cascade,
  created_by uuid references public.profiles on delete set null,
  date date not null,
  sales integer not null check (sales >= 0),
  revenue numeric(12, 2) not null check (revenue >= 0),
  earnings numeric(12, 2) not null check (earnings >= 0),
  note text not null default '' check (char_length(note) <= 140),
  created_at timestamptz not null default now()
);

create index results_partnership_idx on public.results (partnership_id);

alter table public.results enable row level security;

create policy "participants read results" on public.results
  for select to authenticated using (public.is_partner(partnership_id));

create policy "participants log results on active partnerships" on public.results
  for insert to authenticated with check (
    created_by = auth.uid()
    and public.is_partner(partnership_id)
    and exists (select 1 from public.partnerships p where p.id = partnership_id and p.status = 'active')
  );

create policy "authors delete their results" on public.results
  for delete to authenticated using (created_by = auth.uid());

-- Account lifecycle ------------------------------------------------------------------------

-- Email sign-ups carry their role and name in the user metadata; create the profile right away.
-- Sign-ins without a role (e.g. Google) create theirs later with create_my_profile().
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.raw_user_meta_data ? 'role' then
    insert into public.profiles (id, role, display_name)
    values (new.id, (new.raw_user_meta_data ->> 'role')::public.role, coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1)));
    insert into public.contacts (id, email) values (new.id, coalesce(new.email, ''));
  end if;
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.create_my_profile(p_role public.role, p_display_name text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, role, display_name) values (auth.uid(), p_role, p_display_name);
  insert into public.contacts (id, email) values (auth.uid(), coalesce(auth.email(), ''));
end $$;

-- Deletes the caller's account. Profiles, contacts and connections go with it; partnerships and
-- results stay for the other party with this side set to null, and are removed once both sides are gone.
create function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not signed in';
  end if;
  delete from auth.users where id = uid;
  delete from public.partnerships where creator_id is null and brand_id is null;
end $$;

-- Everything stored about the caller, as one JSON document (GDPR access and portability).
create function public.export_my_data() returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'exportedAt', now(),
    'account', (
      select jsonb_build_object('id', u.id, 'email', u.email, 'createdAt', u.created_at, 'lastSignInAt', u.last_sign_in_at,
                                'providers', u.raw_app_meta_data -> 'providers')
      from auth.users u where u.id = auth.uid()
    ),
    'profile', (select to_jsonb(p) from public.profiles p where p.id = auth.uid()),
    'contacts', (select to_jsonb(c) from public.contacts c where c.id = auth.uid()),
    'connections', coalesce((select jsonb_agg(to_jsonb(c)) from public.connections c where auth.uid() in (c.from_id, c.to_id)), '[]'),
    'partnerships', coalesce((select jsonb_agg(to_jsonb(p)) from public.partnerships p where auth.uid() in (p.creator_id, p.brand_id)), '[]'),
    'results', coalesce((
      select jsonb_agg(to_jsonb(r))
      from public.results r join public.partnerships p on p.id = r.partnership_id
      where auth.uid() in (p.creator_id, p.brand_id)
    ), '[]')
  )
$$;

revoke execute on function public.create_my_profile, public.delete_my_account, public.export_my_data from public, anon;
grant execute on function public.create_my_profile, public.delete_my_account, public.export_my_data to authenticated;
