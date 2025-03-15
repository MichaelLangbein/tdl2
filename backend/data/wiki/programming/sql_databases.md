# SQLite

## Dates

```sql
SELECT DATETIME('now', 'start of day'); -- string representation
SELECT datetime(1678900000, 'unixepoch'); -- unix to string
select strftime('%s', '2025-03-13'); -- string to unix
```

# MS SQL Server

## User permissions and schemas

<https://www.youtube.com/watch?v=rwbJhaYt85k>

### Find users by criteria

```sql
-- Check for users with CREATE VIEW permission
SELECT dp.name AS UserName
FROM sys.database_permissions dp
JOIN sys.database_principals dp2 ON dp.grantee_principal_id = dp2.principal_id   -- principal = {role, user}
WHERE dp.permission_name = 'CREATE VIEW';

-- Check for users with SELECT permission on tables in schemaA and schemaB
SELECT dp.name AS UserName
FROM sys.database_permissions dp
JOIN sys.database_principals dp2 ON dp.grantee_principal_id = dp2.principal_id
JOIN sys.objects o ON dp.major_id = o.object_id
JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE dp.permission_name = 'SELECT'
AND s.name IN ('schemaA', 'schemaB');
```

## Stored procedures and triggers

First, create the stored procedure that you want to run.

```sql
CREATE PROCEDURE MySchema.MyProcedure
AS
BEGIN
    -- Your procedure logic here
    PRINT 'Stored procedure executed';
END;
```

Next, create the trigger on the table. This trigger will call the stored procedure after each insert.

```sql
CREATE TRIGGER MySchema.MyTrigger
ON MySchema.MyTable
AFTER INSERT
AS
BEGIN
    EXEC MySchema.MyProcedure;
END;
```

## Transactions

```sql
BEGIN TRANSACTION;

BEGIN TRY
    -- Insert into the first table
    INSERT INTO SchemaA.Table1 (Column1, Column2)
    VALUES ('Value1', 'Value2');

    -- Insert into the second table
    INSERT INTO SchemaB.Table2 (Column1, Column2)
    VALUES ('Value3', 'Value4');

    -- If both inserts succeed, commit the transaction
    COMMIT;
END TRY
BEGIN CATCH
    -- If an error occurs, roll back the transaction
    ROLLBACK;

    -- Optionally, handle the error
    DECLARE @ErrorMessage NVARCHAR(4000);
    SET @ErrorMessage = ERROR_MESSAGE();
    PRINT @ErrorMessage;
END CATCH;
```

## Functions

```sql

-- declare function (this function will persist for future queries)
CREATE FUNCTION translateIntToString (@input INT)
RETURNS VARCHAR(10)
AS
BEGIN
    DECLARE @result VARCHAR(10);

    IF @input = 1
        SET @result = 'ready';
    ELSE IF @input = 2
        SET @result = 'set';
    ELSE IF @input = 3
        SET @result = 'go';
    ELSE
        SET @result = 'Invalid input';

    RETURN @result;
END;


-- use function
SELECT 
    ID,
    StatusCode,
    dbo.translateIntToString(StatusCode) AS StatusDescription
FROM 
    StatusTable;

```
