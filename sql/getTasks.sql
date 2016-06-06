SELECT
  "process",
  "options",
  "frequency",
  "last_sync",
  (SELECT row_to_json("_") FROM (
      SELECT
        *
      FROM
        "sync_sources"
      WHERE
        "sync_sources"."source_name" = "sync_tasks"."master"
    ) AS "_"
  )::text AS "master",
  (SELECT row_to_json("_") FROM (
      SELECT
        *
      FROM
        "sync_sources"
      WHERE
        "sync_sources"."source_name" = "sync_tasks"."source"
    ) AS "_"
  )::text AS "source",
  (SELECT row_to_json("_") FROM (
      SELECT
        *
      FROM
        "sync_sources"
      WHERE
        "sync_sources"."source_name" = "sync_tasks"."destination"
    ) AS "_"
  )::text AS "destination"
FROM
  "sync_tasks"
WHERE
  (EXTRACT(EPOCH FROM NOW()-"last_sync")/3600 > "frequency" OR "last_sync" is null) AND
  "enabled" = true;
