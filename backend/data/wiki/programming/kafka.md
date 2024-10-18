# Kafka

# Uses

https://news.ycombinator.com/item?id=35160555

# Lingo

-   events aka records aka messages
    -   key
        -   not required, but useful
        -   determines what partition a log ends up on
    -   value
    -   timestamp
    -   meta-data
-   **log**: ordered, append only, list of events
-   **topics**: thematically grouped logs
-   **partitions**
    -   one topic is split into several partitions
    -   kafka can guarantee ordering of all events in a single partition
-   **broker**: a machine
    -   each broker has some, but not always all, partitions of a topic
    -   for each partition, one broker is made the leader
    -   reads and writes (almost) always go to the leader
-   **cluster**: multiple machines
-   **producer**:
    -   writes events
-   **consumer**:
    -   reads events

# REST API

-   `http://localhost:8082/topics/`

# Python API: produce, transform, consume

-   https://www.youtube.com/@QuixStreams

Producer:
`pip install requests quixstreams`

```python
import requests
import json
from quixstreams import Application

response = requests.get(
    "https://api.open-meteo.com/v1/forecast",
    params={
        "latitude": 51.5,
        "longitude": -0.11,
        "current": "temperature_2m"
    }
)
data = response.json()

app = Application(
    broker_address="localhost:9092",
    loglevel="DEBUG"
)

with app.get_producer() as producer:
    producer.produce(
        topic="weather_data_demo",
        key="London",
        value=json.dumps(data)
    )
```

Consumer:

```python
import json
from quixstreams import Application

app = Application(
    broker_address="localhost:9092",
    loglevel="DEBUG",
    consumer_group="weather_reader",
    # auto_offset_reset="latest" | "earliest"
)

with app.get_consumer() as consumer:
    consumer.subscribe(["weather_data_demo"])

    while True:
        msg = consumer.poll(1)
        if msg is None:
            print("Waiting ...")
        elif msg.error() is not None:
            raise Exception(msg.error())
        else:
            topic = msg.topic().decode("utf8")
            key = msg.key().decode("utf8")
            value = json.load(msg.value())
            offset = msg.offset()
            print((topic, key, value, offset))
            # consumer.store_offset(msg)

```

Stream processing:

```python
import logging
from quixstreams import Application

app = Application(
    broker_address="localhost:9092",
    loglevel="DEBUG",
    auto_offset_reset="earliest",
    consumer_group="weather_processor",
)

input_topic = app.topic("weather_data_demo")
output_topic = app.topic("weather_i18n")

def weather_i18n(msg):
    celsius = msg["current"]["temperature_2m"]
    farenheit = (celsius * 9 / 5) + 32
    kelvin = celsius + 273.15
    new_msg = {
        "celsius": celsius,
        "farenheit": farenheit,
        "kelvin": kelvin
    }
    return new_msg

# streaming data frame, kind of like pandas frame

sdf = app.dataframe(input_topic)
sdf = sdf.apply(weather_i18n)
sdf = sdf.to_topic(output_topic)
app.run(sdf)
```

# Additional tools

-   **kcat**
    -   allows you to inspect kafka streams from the cli
-   **red panda**
    -   ui, analogous to kcat
-   **confluent control center**:
    -   like red panda
-   **schema registry**:
    -   tells producers how to marshal data to bytes for events
    -   tells consumers how to unmarshal data from bytes from events
-   **kafka connect**
    -   connectors for common dbs, services, file-systems
-   **ksqlDB**:
    -   access streams using SQL
