UPDATE
  "places_sync_tasks"
SET
  "last_sync" = NOW()
WHERE
  "name" = {{processName}};
