-- Table: public.parks_line
CREATE TABLE parks_line_v2
(
  unit_id integer NOT NULL,
  pt_render boolean DEFAULT true,
  geom_line geometry,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by text NOT NULL
);
CDB_CartodbfyTable(parks_line_v2);


CREATE TRIGGER
  "update_updated_at_trigger"
BEFORE UPDATE ON
  "parks_line_v2"
FOR EACH ROW EXECUTE PROCEDURE
  _update_updated_at();

-- Table: public.parks_point
CREATE TABLE parks_point_v2
(
  unit_id integer NOT NULL,
  pt_render boolean DEFAULT true,
  geom_point geometry,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by text NOT NULL
);
select * from CDB_CartodbfyTable('nps','parks_point_v2');


CREATE TRIGGER
  "update_updated_at_trigger"
BEFORE UPDATE ON
  "parks_point_v2"
FOR EACH ROW EXECUTE PROCEDURE
  _update_updated_at();

-- Table: public.parks_poly
CREATE TABLE parks_poly_v2
(
  unit_id integer NOT NULL,
  min_zoom_poly integer,
  min_zoom_border integer,
  min_zoom_tintband integer,
  simp_type text DEFAULT 'point'::text,
  pt_render boolean DEFAULT true,
  pt_fill boolean DEFAULT true,
  data_source text,
  geom_poly geometry,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by text NOT NULL
);
select * from CDB_CartodbfyTable('nps','parks_poly_v2');


CREATE TRIGGER
  "update_updated_at_trigger"
BEFORE UPDATE ON
  "parks_poly_v2"
FOR EACH ROW EXECUTE PROCEDURE
  _update_updated_at();

CREATE VIEW
  parks_v1 AS
SELECT 
  parks_v2."cartodb_id" as "cartodb_id",
  parks_poly_v2."the_geom" as "the_geom",
  parks_v2."unit_area" AS "area",
  parks_v2."unit_desig_full" AS "designation", 
  parks_v2."unit_name_short" AS "display_name", 
  parks_v2."unit_name_long" AS "full_name", 
  ST_Y(parks_point_v2."the_geom") AS "latitude", 
  ST_X(parks_point_v2."the_geom") AS "longitude",
  parks_poly_v2."min_zoom_poly" AS "minzoompoly", 
  parks_v2."unit_region" AS "region",
  parks_v2."unit_region" AS "state", 
  parks_v2."subunit_of" AS "subunit_of", 
  parks_v2."unit_code" AS "unit_code", 
  parks_v2."unit_id" AS "unit_id", 
  null AS "url", 
  parks_v2."created_at" AS "created_at",
  CASE
    WHEN parks_v2."updated_at" > parks_poly_v2."updated_at"
      THEN parks_v2."updated_at"
    ELSE parks_poly_v2."updated_at"
  END AS "updated_at"
FROM
  parks_v2 JOIN parks_poly_v2
    ON parks_v2."unit_id" = parks_poly_v2."unit_id"
   JOIN parks_point_v2
    ON parks_v2."unit_id" = parks_point_v2."unit_id";
