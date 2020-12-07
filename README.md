# noaa-datacollector

[![GitHub issues](https://img.shields.io/github/issues/entmike/noaa-datacollector.svg)](https://github.com/entmike/noaa-datacollector/issues)
[![Docker Pulls](https://img.shields.io/docker/pulls/entmike/noaa-datacollector.svg)](https://hub.docker.com/r/noaa/hubitat-datacollector/)
[![Automated Build](https://img.shields.io/docker/cloud/automated/entmike/noaa-datacollector.svg)](https://hub.docker.com/r/entmike/noaa-datacollector/)

Pull weather data from NOAA and populate a PostgreSQL DB table

# Try it Now with Docker
If you don't care about local development and just want to run it, see the example below.

## Pre-requisites:

1. Docker Installed
2. PostgreSQL Installed somewhere (physical host, VM, Docker, whatever) with a new DB created (i.e. `hubitat`)
3. `forecast` table created in PostgreSQL DB.  Create statement for your convenience:
```sql
CREATE TABLE forecast (
    number integer PRIMARY KEY,
    name character(255) NOT NULL,
    "startTime" timestamp without time zone,
    "endTime" timestamp without time zone,
    "isDaytime" boolean,
    temperature double precision,
    "temperatureUnit" character(25),
    "temperatureTrend" character varying(255),
    "windSpeed" character varying(255),
    "windDirection" character varying(10),
    icon character varying(1024),
    "shortForecast" character varying(512),
    "detailedForecast" character varying(1024)
);
```

## Example:
```
docker run --rm -ti \
  -e PGHOST=192.168.1.12 -e PGHOST=yourpostgreshost -e PGUSER=postgres -e PGPASSWORD=YourPassword \
  -e PGDATABASE=hubitat -e PGPORT=5432 -e INTERVAL=1800 -e LATITUDE=40.70098574912939 -e LONGITUDE=-73.9837906003035 entmike/noaa-datacollector
```

Environment Variables:
|Variable|Description|Default Value|
|---|---|---|
|`PGHOST`|PostgreSQL Host|Empty|
|`PGPORT`|PostgreSQL Port|`5432`|
|`PGDATABASE`|PostgreSQL Database Name|Empty|
|`PGUSER`|PostgreSQL User|Empty|
|`PGPASSWORD`|PostgreSQL Password|Empty|
|`INTERVAL`|NOAA Refresh Interval (seconds)|`1800`|
|`LATITUDE`|Latitude of where you want forecast|`40.70098574912939`|
|`LONGITUDE`|Longitude of where you want forecast|`-73.9837906003035`|

In `psql` or whatever PostgreSQL client you use, connect to the database and look at the `forecast` table for updates.
