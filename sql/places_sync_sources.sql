-- Database: CartoDB

CREATE TABLE
  "sync_sources" (
    "source_name" text NOT NULL,
    "connection" text NOT NULL,
    "field_primary_key" text NOT NULL,
    "field_last_updated" text NOT NULL,
    "field_removed" text,
    "field_removed_value" text,
    "field_forced" text,
    "field_mapped" text,
    "field_hash" text,
    "field_data" text,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY( "source_name" )
);

COMMENT ON TABLE "sync_sources" IS 'Stores the source information for the sync database connections';
COMMENT ON COLUMN "sync_sources"."source_name" IS 'The name of the source that this is describing';
COMMENT ON COLUMN "sync_sources"."connection" IS 'A text string that MUST BE VALID JSON that is a connection string, it is stored as a string to make it easier to use in CartoDB';
COMMENT ON COLUMN "sync_sources"."field_primary_key" IS 'The primary key column name in the source';
COMMENT ON COLUMN "sync_sources"."field_last_updated" IS 'The last_updated column name in the source';
COMMENT ON COLUMN "sync_sources"."field_removed" IS 'The removed column name in the source';
COMMENT ON COLUMN "sync_sources"."field_removed_value" IS 'The removed_value column name in the source';
COMMENT ON COLUMN "sync_sources"."field_forced" IS 'The forced column name in the source';
COMMENT ON COLUMN "sync_sources"."field_mapped" IS 'This column MUST BE VALUE JSON that describes the fields that need to be mapped (null is acceptable)';
COMMENT ON COLUMN "sync_sources"."field_hash" IS 'The hash column name in the source (not common)';
COMMENT ON COLUMN "sync_sources"."field_data" IS 'The data column name in the source (not common)';

CREATE TRIGGER update_updated_at_trigger BEFORE UPDATE ON "sync_sources" FOR EACH ROW EXECUTE PROCEDURE _update_updated_at();

SELECT cdb_cartodbfytable('nps','sync_sources');

ALTER TABLE "sync_sources"
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" SET DEFAULT now();


