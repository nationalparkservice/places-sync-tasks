-- Database: CartoDB (nps user)
-- Description: This isthe table that will store all of the synchronization tasks

CREATE TABLE
"places_sync_tasks" (
  "destination" number,
  "enabled" boolean,
  "frequency_in_minutes" number,
  "last_sync" TIMESTAMPTZ,
  "name" text,
  "options" text,
  "source" number,
  "theme" text,
  "unit_codes" text,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY( name )
);


ALTER TABLE "places_sync_tasks"
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

CREATE TRIGGER
"update_updated_at_trigger"
BEFORE UPDATE ON
"places_sync_tasks"
FOR EACH ROW EXECUTE PROCEDURE
  _update_updated_at();

  SELECT cdb_cartodbfytable('nps','places_sync_tasks');
