--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Ubuntu 14.13-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.13 (Ubuntu 14.13-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: kontrol_eksik_ceviriler(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.kontrol_eksik_ceviriler() RETURNS TABLE(anahtar character varying, eksik_diller character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dk."anahtar",
        STRING_AGG(d."dil_adi", ', ') AS "eksik_diller"
    FROM 
        "public"."diller" d
    CROSS JOIN 
        (SELECT DISTINCT "anahtar" FROM "public"."dil_kelimeler") dk
    LEFT JOIN 
        "public"."dil_kelimeler" k ON dk."anahtar" = k."anahtar" AND d."kod" = k."kod"
    WHERE 
        k."id" IS NULL
    GROUP BY 
        dk."anahtar";
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration integer NOT NULL
);


--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration integer NOT NULL
);


--
-- Name: dil; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dil (
    dil_id integer NOT NULL,
    dil_baslik character varying(50) NOT NULL,
    dil_resim character varying(255) DEFAULT NULL::character varying,
    dil_kod character varying(5) NOT NULL,
    dil_varsayilan boolean DEFAULT false NOT NULL,
    dil_durum smallint DEFAULT 0 NOT NULL
);


--
-- Name: COLUMN dil.dil_kod; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dil.dil_kod IS '5 karakter';


--
-- Name: dil_dil_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dil_dil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dil_dil_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dil_dil_id_seq OWNED BY public.dil.dil_id;


--
-- Name: dil_kelimeler; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dil_kelimeler (
    id integer NOT NULL,
    adi character varying(255) NOT NULL,
    anahtar character varying(255) NOT NULL,
    deger text NOT NULL,
    kod character(5) NOT NULL
);


--
-- Name: dil_kelimeler_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dil_kelimeler_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dil_kelimeler_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dil_kelimeler_id_seq OWNED BY public.dil_kelimeler.id;


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


--
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- Name: role_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_user (
    user_id bigint NOT NULL,
    role_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


--
-- Name: ticket_attachments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ticket_attachments (
    id bigint NOT NULL,
    ticket_message_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    path character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    size integer NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: ticket_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ticket_attachments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ticket_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ticket_attachments_id_seq OWNED BY public.ticket_attachments.id;


--
-- Name: ticket_histories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ticket_histories (
    id bigint NOT NULL,
    ticket_id bigint NOT NULL,
    user_id bigint NOT NULL,
    action character varying(255) NOT NULL,
    type character varying(255) DEFAULT 'info'::character varying NOT NULL,
    params json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: ticket_histories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ticket_histories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ticket_histories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ticket_histories_id_seq OWNED BY public.ticket_histories.id;


--
-- Name: ticket_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ticket_messages (
    id bigint NOT NULL,
    ticket_id bigint NOT NULL,
    user_id bigint NOT NULL,
    message text NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    quote text,
    is_admin boolean DEFAULT false NOT NULL
);


--
-- Name: ticket_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ticket_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ticket_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ticket_messages_id_seq OWNED BY public.ticket_messages.id;


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tickets (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    subject character varying(255) NOT NULL,
    message text NOT NULL,
    status character varying(255) DEFAULT 'open'::character varying NOT NULL,
    priority character varying(255) DEFAULT 'medium'::character varying NOT NULL,
    category character varying(255) DEFAULT 'general'::character varying NOT NULL,
    last_reply_at timestamp(0) without time zone,
    closed_at timestamp(0) without time zone,
    history json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT tickets_category_check CHECK (((category)::text = ANY (ARRAY[('general'::character varying)::text, ('technical'::character varying)::text, ('billing'::character varying)::text, ('other'::character varying)::text]))),
    CONSTRAINT tickets_priority_check CHECK (((priority)::text = ANY (ARRAY[('low'::character varying)::text, ('medium'::character varying)::text, ('high'::character varying)::text]))),
    CONSTRAINT tickets_status_check CHECK (((status)::text = ANY (ARRAY[('open'::character varying)::text, ('answered'::character varying)::text, ('closed'::character varying)::text])))
);


--
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tickets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tickets_id_seq OWNED BY public.tickets.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    amount numeric(10,2) NOT NULL,
    type character varying(255) NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    description character varying(255),
    bank_account character varying(255),
    reference_id character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    notes text,
    history json,
    CONSTRAINT transactions_status_check CHECK (((status)::text = ANY (ARRAY[('pending'::character varying)::text, ('completed'::character varying)::text, ('cancelled'::character varying)::text]))),
    CONSTRAINT transactions_type_check CHECK (((type)::text = ANY (ARRAY[('withdrawal'::character varying)::text, ('deposit'::character varying)::text, ('transfer'::character varying)::text])))
);


--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: user_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_settings (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    language character varying(255) DEFAULT 'tr'::character varying NOT NULL,
    timezone character varying(255) DEFAULT 'Europe/Istanbul'::character varying NOT NULL,
    notifications_enabled boolean DEFAULT true NOT NULL,
    preferences json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: user_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_settings_id_seq OWNED BY public.user_settings.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    google_id character varying(255),
    avatar character varying(255),
    google_refresh_token text,
    last_login_at timestamp(0) without time zone,
    facebook_id character varying(255),
    github_id character varying(255),
    social_login boolean DEFAULT false NOT NULL,
    last_social_login character varying(255),
    social_registration boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: withdrawals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.withdrawals (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    amount numeric(10,2) NOT NULL,
    bank_account character varying(255) NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    processed_at timestamp(0) without time zone,
    notes text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT withdrawals_status_check CHECK (((status)::text = ANY (ARRAY[('pending'::character varying)::text, ('approved'::character varying)::text, ('rejected'::character varying)::text, ('completed'::character varying)::text])))
);


--
-- Name: withdrawals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.withdrawals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: withdrawals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.withdrawals_id_seq OWNED BY public.withdrawals.id;


--
-- Name: dil dil_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dil ALTER COLUMN dil_id SET DEFAULT nextval('public.dil_dil_id_seq'::regclass);


--
-- Name: dil_kelimeler id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dil_kelimeler ALTER COLUMN id SET DEFAULT nextval('public.dil_kelimeler_id_seq'::regclass);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: ticket_attachments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_attachments ALTER COLUMN id SET DEFAULT nextval('public.ticket_attachments_id_seq'::regclass);


--
-- Name: ticket_histories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_histories ALTER COLUMN id SET DEFAULT nextval('public.ticket_histories_id_seq'::regclass);


--
-- Name: ticket_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_messages ALTER COLUMN id SET DEFAULT nextval('public.ticket_messages_id_seq'::regclass);


--
-- Name: tickets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets ALTER COLUMN id SET DEFAULT nextval('public.tickets_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: user_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_settings ALTER COLUMN id SET DEFAULT nextval('public.user_settings_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: withdrawals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.withdrawals ALTER COLUMN id SET DEFAULT nextval('public.withdrawals_id_seq'::regclass);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: dil_kelimeler dil_kelimeler_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dil_kelimeler
    ADD CONSTRAINT dil_kelimeler_pkey PRIMARY KEY (id);


--
-- Name: dil dil_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dil
    ADD CONSTRAINT dil_pkey PRIMARY KEY (dil_id);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- Name: role_user role_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_user
    ADD CONSTRAINT role_user_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: ticket_attachments ticket_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_attachments
    ADD CONSTRAINT ticket_attachments_pkey PRIMARY KEY (id);


--
-- Name: ticket_histories ticket_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_histories
    ADD CONSTRAINT ticket_histories_pkey PRIMARY KEY (id);


--
-- Name: ticket_messages ticket_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_messages
    ADD CONSTRAINT ticket_messages_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_reference_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_reference_id_unique UNIQUE (reference_id);


--
-- Name: user_settings user_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: withdrawals withdrawals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.withdrawals
    ADD CONSTRAINT withdrawals_pkey PRIMARY KEY (id);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: transactions_user_id_created_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX transactions_user_id_created_at_index ON public.transactions USING btree (user_id, created_at);


--
-- Name: transactions_user_id_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX transactions_user_id_status_index ON public.transactions USING btree (user_id, status);


--
-- Name: users_github_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_github_id_index ON public.users USING btree (github_id);


--
-- Name: users_google_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_google_id_index ON public.users USING btree (google_id);


--
-- Name: role_user role_user_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_user
    ADD CONSTRAINT role_user_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: role_user role_user_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_user
    ADD CONSTRAINT role_user_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: ticket_attachments ticket_attachments_ticket_message_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_attachments
    ADD CONSTRAINT ticket_attachments_ticket_message_id_foreign FOREIGN KEY (ticket_message_id) REFERENCES public.ticket_messages(id) ON DELETE CASCADE;


--
-- Name: ticket_histories ticket_histories_ticket_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_histories
    ADD CONSTRAINT ticket_histories_ticket_id_foreign FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;


--
-- Name: ticket_histories ticket_histories_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_histories
    ADD CONSTRAINT ticket_histories_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: ticket_messages ticket_messages_ticket_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_messages
    ADD CONSTRAINT ticket_messages_ticket_id_foreign FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;


--
-- Name: ticket_messages ticket_messages_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_messages
    ADD CONSTRAINT ticket_messages_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tickets tickets_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_settings user_settings_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: withdrawals withdrawals_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.withdrawals
    ADD CONSTRAINT withdrawals_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Ubuntu 14.13-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.13 (Ubuntu 14.13-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migrations (id, migration, batch) FROM stdin;
15	2024_11_20_183047_update_roles_table	1
16	[timestamp]_update_roles_table	1
17	 2024_03_21_create_transactions_table	2
18	2024_03_21_create_tickets_table	3
19	2024_11_23_011845_add_is_active_to_users_table	4
20	2024_11_23_013321_create_withdrawals_table	5
21	2024_03_xx_add_notes_to_transactions_table	6
22	2024_03_20_create_tickets_table	7
23	2024_03_20_000002_create_ticket_messages_table	8
24	xxxx_xx_xx_create_ticket_attachments_table	9
25	2024_11_26_172945_add_quote_to_ticket_messages_table	10
26	2024_11_26_175936_create_personal_access_tokens_table	11
27	xxxx_xx_xx_create_ticket_histories_table	11
28	2024_03_26_create_add_is_admin_to_ticket_messages	12
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 28, true);


--
-- PostgreSQL database dump complete
--

