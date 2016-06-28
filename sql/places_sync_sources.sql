-- Database: CartoDB

CREATE TABLE
  "places_sync_sources" (
    "connection" text NOT NULL,
    "field_data" text,
    "field_forced" text,
    "field_hash" text,
    "field_last_updated" text NOT NULL,
    "field_mapped" text,
    "field_primary_key" text NOT NULL,
    "field_removed" text,
    "field_removed_value" text,
    "filter" text,
    "osm_translation" text,
    "transforms" text,
    "type" text,
    "source_name" text NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY( "source_name" )
);

COMMENT ON TABLE "places_sync_sources" IS 'Stores the source information for the sync database connections';
COMMENT ON COLUMN "places_sync_sources"."connection" IS 'A text string that MUST BE VALID JSON that is a connection string, it is stored as a string to make it easier to use in CartoDB';
COMMENT ON COLUMN "places_sync_sources"."field_data" IS 'The data column name in the source (not common)';
COMMENT ON COLUMN "places_sync_sources"."field_forced" IS 'The forced column name in the source';
COMMENT ON COLUMN "places_sync_sources"."field_hash" IS 'The hash column name in the source (not common)';
COMMENT ON COLUMN "places_sync_sources"."field_last_updated" IS 'The last_updated column name in the source';
COMMENT ON COLUMN "places_sync_sources"."field_mapped" IS 'This column MUST BE VALUE JSON that describes the fields that need to be mapped (null is acceptable)';
COMMENT ON COLUMN "places_sync_sources"."field_primary_key" IS 'The primary key column name in the source';
COMMENT ON COLUMN "places_sync_sources"."field_removed" IS 'The removed column name in the source';
COMMENT ON COLUMN "places_sync_sources"."field_removed_value" IS 'The removed_value column name in the source';
COMMENT ON COLUMN "places_sync_sources"."filter" IS 'To allow a subset of the overall table';
COMMENT ON COLUMN "places_sync_sources"."osm_translation" IS 'The type of translation for OSM';
COMMENT ON COLUMN "places_sync_sources"."transforms" IS 'Rename or remove columns';
COMMENT ON COLUMN "places_sync_sources"."type" IS 'The source database type';
COMMENT ON COLUMN "places_sync_sources"."source_name" IS 'The name of the source that this is describing';

CREATE TRIGGER update_updated_at_trigger BEFORE UPDATE ON "places_sync_sources" FOR EACH ROW EXECUTE PROCEDURE _update_updated_at();

SELECT cdb_cartodbfytable('nps','places_sync_sources');

ALTER TABLE "places_sync_sources"
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" SET DEFAULT now();


