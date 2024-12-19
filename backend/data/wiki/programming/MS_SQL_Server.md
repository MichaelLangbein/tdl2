# MS SQL Server

## Syntax

### top:
`select TOP(10) * from yourtable`

### cast:
`cast(table.column as varchar(10))`


Try cast:
```sql
    select 
    p.Name, isnull(try_cast(p.[Size] as Integer), 0)
    from SalesLT.Product as p;
```

### Case:
```sql
    select 
    p.ProductID, p.Name, p.ListPrice,
    case
        when p.ListPrice > 100 then N'High'
        else N'Normal'
    end as PriceType
    from SalesLT.Product as p;
```

### Joins
Note that when you join multiple tables, after an outer join has been specified in the join sequence, all subsequent outer joins must be of the same direction (LEFT or RIGHT).


### Where vs Having
`WHERE` vs `HAVING`: where is evaluated on all rows, having is evaluated after grouping (= GROUP BY)


### Foreign keys: 
```sql
create table SalesLT.CallLog
(
    CallID int identity primary key not NULL,
    CallTime datetime not null default getdate(),
    SalesPerson NVARCHAR(256) not null,
    CustomerID int not null REFERENCES SalesLT.Customer(CustomerID)
);
```

### Views
A view is a predefined query that you can query like a table
```sql
-- step 2: making it a view:
create view SalesLT.vProductsRoadBikes as
-- step 1: normal query:
select
p.ProductID, p.Name, p.ListPrice
from SalesLT.Product as p
where p.ProductCategoryID = 6;
```

### Derived tables

```sql
-- step 2: using results from first query
select DerivedTable.ProductId
from 
(
    -- step 1: first query
    select 
    p.ProductID, p.Name, p.ListPrice,
    case 
        when p.ListPrice > 1000 then N'High'
        else N'Normal'
    end as PriceType
    from SalesLT.Product as p
) as DerivedTable
where DerivedTable.PriceType = N'High'
```

### Union and Intersect

https://microsoftlearning.github.io/dp-080-Transact-SQL/Instructions/Labs/07-combine-query-results.html

### Procedural programming
https://microsoftlearning.github.io/dp-080-Transact-SQL/Instructions/Labs/10-program-with-tsql.html 

declaring variables:
```sql
DECLARE
    @productID int,
    @productPrice money;

SET @productID = 680;
PRINT @productID;

SELECT @productPrice = ListPrice FROM SalesLT.Product WHERE ProductID = @productID;
PRINT @ProductPrice;
```


`GO` sends all previous code to processing. 
All variables declared so far are lost afterwards. 


Table variables:
```sql
declare @productId int, @productPrice money;

declare @priceData table(
    ProductID int,
    Price money
);

set @productId = 680;

select 
@productPrice = p.ListPrice
            from SalesLT.Product as p
            where p.ProductID = @productId;

insert into @priceData values
(@productId, @productPrice);

select * from @priceData;
```

Conditional logic:
```sql
declare 
    @productId int, 
    @productPrice money,
    @averagePrice money,
    @priceLevel NVARCHAR(20);


set @productId = 680;

select 
@productPrice = p.ListPrice
            from SalesLT.Product as p
            where p.ProductID = @productId;

select 
@averagePrice = avg(p.ListPrice)
            from SalesLT.Product as p;


if @productPrice < @averagePrice
    set @priceLevel = N'Below average'
else if @productPrice > @averagePrice
    set @priceLevel = N'Average'
else
    set @priceLevel = N'Average';
```


#### Loops
...

### Stored procedures and functions

- Stored procedures vs views:
    - Effects: stored procedures can change tables, views cannot
    - Data Storage: neither stores any data. Views are re-run every time you query the view
    - Execution: Views are used in SELECT statements to retrieve data. Stored procedures are executed using the EXEC command.
- Functions vs stored procedures:
    - Functions are similar to stored procedures, but can be used in SELECT statements like built in functions.


```sql
 CREATE FUNCTION SalesLT.fn_ApplyDiscount (@productID int, @percentage decimal)
 RETURNS money
 AS
 BEGIN
     DECLARE @discountedPrice money;
     SELECT @discountedPrice = ListPrice - (ListPrice * (@percentage/100))
     FROM SalesLT.Product
     WHERE ProductID = @productID;
     RETURN @discountedPrice
 END;
```


### Pivots
https://microsoftlearning.github.io/dp-080-Transact-SQL/Instructions/Labs/09-transform-data.html 


### Transactions
https://microsoftlearning.github.io/dp-080-Transact-SQL/Instructions/Labs/13-implement-transitions-in-tsql.html 

```sql
 BEGIN TRANSACTION;
    
     INSERT INTO SalesLT.Customer (NameStyle, FirstName, LastName, EmailAddress, PasswordHash, PasswordSalt,    rowguid, ModifiedDate) 
     VALUES (0,  'Norman','Newcustomer','norman0@adventure-works.com','U1/CrPqSzwLTtwgBehfpIl7f1LHSFpZw1qnG1sMzFjo=','QhHP+y8=', NEWID(), GETDATE());
    
     INSERT INTO SalesLT.Address (AddressLine1, City, StateProvince, CountryRegion, PostalCode, rowguid,    ModifiedDate) 
     VALUES ('6388 Lake City Way', 'Burnaby','British Columbia','Canada','V5A 3A6', NEWID(), GETDATE());
    
     INSERT INTO SalesLT.CustomerAddress (CustomerID, AddressID, AddressType, rowguid, ModifiedDate)
     VALUES (IDENT_CURRENT('SalesLT.Customer'), IDENT_CURRENT('SalesLT.Address'), 'Home', NEWID(), '12-1-20212');
    
 COMMIT TRANSACTION;
```


## Query planning

https://www.youtube.com/watch?v=VcA92fe1Erw

```sql
set showplan_all on;
go

-- some statement
go

set showplan_all off;
go
```

Rules of thumb:
- where, join, order on indexed columns
- but too many indices slow down inserts, updates and deletes
- prefer joins over subqueries
- prefer set-based operations over loops
- transactions are blocking, so only use them where required