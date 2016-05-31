UPDATE
  "sync_tasks"
SET
  "last_sync" = NOW()
WHERE
  "process" = {{processName}};
