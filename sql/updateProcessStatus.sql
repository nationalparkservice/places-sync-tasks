UPDATE
  "places_sync_tasks"
SET
  "last_sync" = NOW(),
  "error_message" = null
WHERE
  "name" = {{processName}};
