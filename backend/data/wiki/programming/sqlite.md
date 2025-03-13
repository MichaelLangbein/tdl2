# SQLite

## Dates

```sql
SELECT DATETIME('now', 'start of day'); -- string representation
SELECT datetime(1678900000, 'unixepoch'); -- unix to string
select strftime('%s', '2025-03-13'); -- string to unix
```
