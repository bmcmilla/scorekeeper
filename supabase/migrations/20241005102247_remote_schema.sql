drop policy "Users can access their own players" on "public"."players";

revoke delete on table "public"."players" from "anon";

revoke insert on table "public"."players" from "anon";

revoke references on table "public"."players" from "anon";

revoke select on table "public"."players" from "anon";

revoke trigger on table "public"."players" from "anon";

revoke truncate on table "public"."players" from "anon";

revoke update on table "public"."players" from "anon";

revoke delete on table "public"."players" from "authenticated";

revoke insert on table "public"."players" from "authenticated";

revoke references on table "public"."players" from "authenticated";

revoke select on table "public"."players" from "authenticated";

revoke trigger on table "public"."players" from "authenticated";

revoke truncate on table "public"."players" from "authenticated";

revoke update on table "public"."players" from "authenticated";

revoke delete on table "public"."players" from "service_role";

revoke insert on table "public"."players" from "service_role";

revoke references on table "public"."players" from "service_role";

revoke select on table "public"."players" from "service_role";

revoke trigger on table "public"."players" from "service_role";

revoke truncate on table "public"."players" from "service_role";

revoke update on table "public"."players" from "service_role";

alter table "public"."players" drop constraint "players_game_id_fkey";

alter table "public"."players" drop constraint "players_seat_num_check";

alter table "public"."scores" drop constraint "scores_player_id_fkey";

alter table "public"."players" drop constraint "players_pkey";

drop index if exists "public"."players_game_id_idx";

drop index if exists "public"."players_pkey";

drop index if exists "public"."scores_player_id_idx";

drop table "public"."players";

alter table "public"."games" add column "players" text[] not null default '{}'::text[];

alter table "public"."scores" drop column "player_id";

alter table "public"."scores" add column "game_id" bigint not null;

alter table "public"."scores" add column "player_index" bigint not null;

alter table "public"."scores" add column "round_num" bigint;

CREATE INDEX scores_game_id_idx ON public.scores USING btree (game_id);

CREATE UNIQUE INDEX scores_score_id_key ON public.scores USING btree (score_id);

alter table "public"."scores" add constraint "scores_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(game_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."scores" validate constraint "scores_game_id_fkey";

alter table "public"."scores" add constraint "scores_score_id_key" UNIQUE using index "scores_score_id_key";


