SELECT
  "name",
  "options",
  "frequency_in_minutes",
  "last_sync",
  (SELECT row_to_json("_") FROM (
      SELECT
        *
      FROM
        "places_sync_sources"
      WHERE
        "places_sync_sources"."cartodb_id" = "places_sync_tasks"."master"
    ) AS "_"
  )::text AS "master",
  (SELECT row_to_json("_") FROM (
      SELECT
        *
      FROM
        "places_sync_sources"
      WHERE
        "places_sync_sources"."cartodb_id" = "places_sync_tasks"."source"
    ) AS "_"
  )::text AS "source",
  (SELECT row_to_json("_") FROM (
      SELECT
        *
      FROM
        "places_sync_sources"
      WHERE
        "places_sync_sources"."cartodb_id" = "places_sync_tasks"."destination"
    ) AS "_"
  )::text AS "destination"
FROM
  "places_sync_tasks"
WHERE
  (EXTRACT(EPOCH FROM NOW()-"last_sync")/60 > "frequency_in_minutes" OR "last_sync" is null) AND
  "enabled" = true;
