-- Database: CartoDB (nps user)
-- Description: This is the table that will store all of our synchronization tasks

CREATE TABLE
  "sync_tasks" (
  "process" text,
  "source" text,
  "destination" text,
  "frequency" number,
  "two_way" boolean,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "last_sync" TIMESTAMPTZ,
  PRIMARY KEY( process )
);


ALTER TABLE "sync_tasks" 
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" SET DEFAULT now();

CREATE TRIGGER
  "update_updated_at_trigger"
BEFORE UPDATE ON
  "sync_tasks"
FOR EACH ROW EXECUTE PROCEDURE
  _update_updated_at();

SELECT cdb_cartodbfytable('nps','sync_tasks');
