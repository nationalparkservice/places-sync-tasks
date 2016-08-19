UPDATE
  "places_sync_tasks"
SET
  "error_message" = {{errorMessage}}
WHERE
  "name" = {{processName}};
