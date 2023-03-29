
# PostGIS
Most geo-data occurs in such large quantities, that we have to analyse them in postgis.
 - Vector data: postgis
 - Raster data: gdal (Qgis is a nice gui for gdal)
Still, when doing a first, exploratory analysis, you should focus on a very small, but representative subset of the data.


## Installation and setup 

`sudo apt-get install postgis -y`
`service postgresql status`

Or with one docker-container: 
```bash
docker image pull postgis/postgis:11-3.3
docker container run -e POSTGRES_PASSWORD=mysecretpassword -d --name=mypostgis postgis/postgis
docker exec -it mypostgis psql -U postgres
```

Or with pg-admin:
```yml
version: "3.8"
services:
  db:
    image: postgis/postgis
    restart: always
    ports:
      - "54320:5432"
    networks:
      - pg
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: admin
    volumes:
      - /some/local/dir:/var/lib/postgresql/data  # mount to bring in your own data
      - local_pgdata:/var/lib/postgresql/data     # volume to maintain state
  pgadmin:
    image: dpage/pgadmin4
    restart: always
    ports:
      - "5050:80"
    networks:
      - pg
    environment:
      PGADMIN_DEFAULT_EMAIL: raj@nola.com
      PGADMIN_DEFAULT_PASSWORD: admin
    volumes:
    - pgadmin-data:/var/lib/pgadmin    # volume to remember configuration

networks:
  pg:

volumes:
  pgadmin-data:
  local_pgdata:
```
Note: the above setup can connect to the database in the connection-window with the hostname `db`, not `http://db`.


Fist steps: create user as in https://wiki.postgresql.org/wiki/First_steps 

Log in to admin db
`psql template1`

Good admin tool: pgAdmin3


## Most common commands
- `\l`: list databases
- `\c <db-name>`: use database
- `\dt`: list tables
- `\d <table-name>`: describe table
- `\dn`: list schemes
- `\df`: list functions
- `\dv`: list views
- `\i <file-name>`: execute psql commands from a file
- `\copy`


## Performance-settings


## Schemes, databases, user-rights



## Example analysis
Importing data, creating summary statistics, performance optimization.

### Creating OCO2 table and importing data

```sql
create database climate;
\c climate;
create extension postgis;

create table oco2 (
 id serial PRIMARY KEY,
 lon float,
 lat float,
 mu float,
 sd float,
 date date,
 geom geometry(point, 4326)
);
create index idx_oco2_geom on oco2 using gist(geom);
create index idx_oco2_date on oco2 using btree(date);

\copy oco2(lon, lat, mu, sd, date) from '/home/michael/Desktop/code/python/oco2/data/l3/2015-01/2015-01-01.csv' delimiters ',' csv header;
```

```sh
for dir in */; do 
    for f in `ls $dir`; do
        fileName=`pwd`/$dir$f;
        echo "Now importing $fileName ...";
        psql climate -c "\copy oco2(lon, lat, mu, sd, date) from '$fileName' delimiters ',' csv header;"
    done
done
```

```sql
-- For geodetic coordinates, X is longitude and Y is latitude
UPDATE oco2 SET geom = ST_SetSRID(ST_MakePoint(lon, lat), 4326);
```




### Importing administrative borders, filtering data

```sh
ogr2ogr -f PostgreSQL PG:"dbname=climate user=michael host=localhost port=5432 password=XXXXX" "/home/michael/Desktop/code/python/oco2/data/geometries/bundeslaender.json" -nln bundeslaender -append
ogr2ogr -f PostgreSQL PG:"dbname=climate user=michael host=localhost port=5432 password=XXXXX" "/home/michael/Desktop/code/python/oco2/data/geometries/countries.json" -nln countries -append
```

```sql
create table oco2_bavaria (
    like oco2
    including defaults
    including constraints
    including indexes
);


insert into oco2_bavaria 
select
  oco2.*
from oco2
join bundeslaender
on ST_Contains(bundeslaender.wkb_geometry, oco2.geom)
where bundeslaender.ogc_fid = 2;


create table join_oco_countries (
    cid integer,
    oid integer
);
create index idx_joc_cid on join_oco_countries using btree(cid);
create index idx_joc_oid on join_oco_countries using btree(oid);

insert into join_oco_countries 
    select c.ogc_fid as cid, o.id as oid 
    from oco2 as o 
    join countries as c 
    on st_contains(c.wkb_geometry, o.geom);

```

### Analysis 
```sql
\copy (select date, avg(mu) from oco2_bavaria group by date) to '/home/michael/Desktop/code/python/oco2/out.csv' with csv;
```


This gets the daily average XCO2 per Bundesland per day.
```sql
\copy (
select j.id, j.date, avg(j.mu)
from (
    select oco2.mu, oco2.date, bundeslaender.id from oco2
    join bundeslaender
    on ST_Contains(bundeslaender.wkb_geometry, oco2.geom) 
) as j
group by j.id, j.date

) to '/home/michael/Desktop/code/python/oco2/meansPerBLPerDate.csv' with csv;
```



### Analysis for a very large amount of data
```sql
\copy ( 
    select j.admin, j.date, avg(j.mu) from ( 
        select oco2.mu, oco2.date, countries.admin, countries.iso_a3 
        from oco2 
        join countries on ST_Contains(countries.wkb_geometry, oco2.geom) 
    ) as j group by j.admin, j.date 
) to '/home/michael/Desktop/code/python/oco2/meansPerCountryPerDate.csv' with csv;



                                        QUERY PLAN                                        
------------------------------------------------------------------------------------------
 HashAggregate  (cost=528236393.59..528241206.72 rows=385050 width=23)
   Group Key: countries.admin, oco2.date
   ->  Nested Loop  (cost=3224.60..524005816.86 rows=564076897 width=23)
         ->  Seq Scan on countries  (cost=0.00..52.55 rows=255 width=34738)
         ->  Bitmap Heap Scan on oco2  (cost=3224.60..2054849.67 rows=7490 width=44)
               Filter: st_contains(countries.wkb_geometry, geom)
               ->  Bitmap Index Scan on idx_oco2  (cost=0.00..3222.73 rows=74903 width=0)
                     Index Cond: (geom @ countries.wkb_geometry)
 JIT:
   Functions: 7
   Options: Inlining true, Optimization true, Expressions true, Deforming true
(11 rows)




explain select j.admin, j.date, avg(j.mu) from ( 
        select oco2.mu, oco2.date, countries.admin, countries.iso_a3 
        from countries
        join oco2 on ST_Contains(countries.wkb_geometry, oco2.geom) 
    ) as j group by j.admin, j.date 

                                        QUERY PLAN                                        
------------------------------------------------------------------------------------------
 HashAggregate  (cost=528236393.59..528241206.72 rows=385050 width=23)
   Group Key: countries.admin, oco2.date
   ->  Nested Loop  (cost=3224.60..524005816.86 rows=564076897 width=23)
         ->  Seq Scan on countries  (cost=0.00..52.55 rows=255 width=34738)
         ->  Bitmap Heap Scan on oco2  (cost=3224.60..2054849.67 rows=7490 width=44)
               Filter: st_contains(countries.wkb_geometry, geom)
               ->  Bitmap Index Scan on idx_oco2  (cost=0.00..3222.73 rows=74903 width=0)
                     Index Cond: (geom @ countries.wkb_geometry)
 JIT:
   Functions: 7
   Options: Inlining true, Optimization true, Expressions true, Deforming true
(11 rows)

```
What postgres does here is:
    It takes every point
        goes through every country to check if the point is inside the country.
Better: for each point, find the nearest country. 
    If that country covers the point, you have a match.
This way, we get early stopping.
I think this page has a good description: https://postgis.net/workshops/postgis-intro/knn.html

Indeed, the following *might be* quite fast:
```sql
insert into join_oco_countries_2
select c.ogc_fid as cid, o.id as oid
from oco2 as o
cross join lateral (
select c.*
from countries as c
order by c.wkb_geometry <-> o.geom
limit 1
) as c;


delete from join_oco_countries_2 as j
join oco2 as o on j.oid = o.id
join countries as c on j.ogc_fid = j.cid
where not st_intersects(c.wkb_geometry, o.geom);
```

Note that order by distance gives *smallest* distances first:
```sql
select c.admin, st_distance(c.wkb_geometry, 'SRID=4326;POINT(-150.5 49.5)') as dist
from countries as c
order by c.wkb_geometry <-> 'SRID=4326;POINT(-150.5 49.5)'::geometry limit 10;
                admin                 |        dist        
--------------------------------------+--------------------
 United States of America             |  7.809353548757471
 Canada                               | 14.390310868570625
 Russia                               | 24.659435755524303
 United States Minor Outlying Islands | 34.246372966862005
```

This is too much data!

Explain-analyzing a smaller query.
We see that indeed the '<->' query is a lot faster.

```sql
explain analyze 
    select c.ogc_fid as cid, o.id as oid
    from oco2_bavaria as o
    cross join lateral (
        select c.*
        from countries as c
        order by c.wkb_geometry <-> o.geom
        limit 1
    ) as c;

Nested Loop  (cost=0.14..31686.36 rows=9051 width=8) (actual time=0.518..1190.484 rows=9051 loops=1)
   ->  Seq Scan on oco2_bavaria o  (cost=0.00..211.51 rows=9051 width=36) (actual time=0.012..1.332 rows=9051 loops=1)
   ->  Limit  (cost=0.14..3.46 rows=1 width=140) (actual time=0.131..0.131 rows=1 loops=9051)
         ->  Index Scan using countries_wkb_geometry_geom_idx on countries c  (cost=0.14..846.10 rows=255 width=140) (actual time=0.130..0.130 rows=1 loops=9051)
               Order By: (wkb_geometry <-> o.geom)
 Planning Time: 0.232 ms
 Execution Time: 1191.292 ms

1. go through all points (1.332)
2. for each point, index-scan the countries (0)
3. order by centroid-distance (0.130)
=======> 1.191 ms


explain analyse 
    select c.ogc_fid, o.id 
    from oco2_bavaria as o 
    join countries as c 
    on st_intersects(c.wkb_geometry, o.geom);

Nested Loop  (cost=0.15..7176.81 rows=283555 width=8) (actual time=59.083..32947.648 rows=9051 loops=1)
   ->  Seq Scan on countries c  (cost=0.00..52.55 rows=255 width=34731) (actual time=0.007..0.335 rows=255 loops=1)
   ->  Index Scan using oco2_bavaria_geom_idx on oco2_bavaria o  (cost=0.15..27.93 rows=1 width=36) (actual time=128.592..129.089 rows=35 loops=255)
         Index Cond: (geom && c.wkb_geometry)
         Filter: st_intersects(c.wkb_geometry, geom)
         Rows Removed by Filter: 166
 Planning Time: 1.299 ms
 Execution Time: 32948.450 ms
(8 rows)


1. go through all countries
2. for each country, go through all points
3. check if the point intersects
=============> 32.948 ms



But the fastest thing to do is to ditch polygons and so a bbox-intersect (&&) only:

explain analyze 
    select o.id,  c.ogc_fid 
    from oco2_bavaria as o 
    join countries as c 
    on o.geom && c.wkb_geometry;
                                                                   QUERY PLAN                                                                    
-------------------------------------------------------------------------------------------------------------------------------------------------
 Nested Loop  (cost=0.15..801.81 rows=283555 width=8) (actual time=4.034..38.469 rows=51294 loops=1)
   ->  Seq Scan on countries c  (cost=0.00..52.55 rows=255 width=34731) (actual time=0.011..0.087 rows=255 loops=1)
   ->  Index Scan using oco2_bavaria_geom_idx on oco2_bavaria o  (cost=0.15..2.93 rows=1 width=36) (actual time=0.004..0.057 rows=201 loops=255)
         Index Cond: (geom && c.wkb_geometry)
 Planning Time: 0.296 ms
 Execution Time: 40.165 ms



Running on large table:
40.165ms / 9051 rows * 74903040 rows ==> 5.53 min

insert into join_oco_countries select c.ogc_fid as cid, o.id as oid from oco2 as o join countries as c on o.geom && c.wkb_geometry;
INSERT 0 167519230
Done in 10 minutes

create index idx_join_oco on join_oco_countries using btree(oid);
create index idx_join_ctr on join_oco_countries using btree(cid);






explain select c.admin, o.date, avg(o.mu)                                                                   
from join_oco_countries as j
join oco2 as o on o.id = j.oid
join countries as c on c.ogc_fid = cid
group by o.date, c.admin;
                                                       QUERY PLAN                                                       
------------------------------------------------------------------------------------------------------------------------
 Finalize HashAggregate  (cost=4820867.90..4825681.02 rows=385050 width=23)
   Group Key: o.date, c.admin
   ->  Gather  (cost=4734231.65..4815092.15 rows=770100 width=47)
         Workers Planned: 2
         ->  Partial HashAggregate  (cost=4733231.65..4737082.15 rows=385050 width=47)
               Group Key: o.date, c.admin
               ->  Hash Join  (cost=2401007.74..4209734.05 rows=69799680 width=23)
                     Hash Cond: (j.cid = c.ogc_fid)
                     ->  Parallel Hash Join  (cost=2400952.00..4023408.97 rows=69799680 width=16)
                           Hash Cond: (j.oid = o.id)
                           ->  Parallel Seq Scan on join_oco_countries j  (cost=0.00..1439232.80 rows=69799680 width=8)
                           ->  Parallel Hash  (cost=2010832.00..2010832.00 rows=31209600 width=16)
                                 ->  Parallel Seq Scan on oco2 o  (cost=0.00..2010832.00 rows=31209600 width=16)
                     ->  Hash  (cost=52.55..52.55 rows=255 width=15)
                           ->  Seq Scan on countries c  (cost=0.00..52.55 rows=255 width=15)
 JIT:
   Functions: 23
   Options: Inlining true, Optimization true, Expressions true, Deforming true
(18 rows)


This cost of 4.8 million units is comparable 
to the cost of 5.7 million of the && query earlier,
so it should be done in around 10 minutes.

\copy (
    select c.admin, o.date, avg(o.mu)                                                                   
    from join_oco_countries as j
    join oco2 as o on o.id = j.oid
    join countries as c on c.ogc_fid = cid
    group by o.date, c.admin
) to '/home/michael/Desktop/code/python/oco2/meansPerCountryPerDate.csv' with csv;

Was actually done after ~5 minutes.

```