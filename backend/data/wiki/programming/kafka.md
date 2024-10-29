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
    -   **bootstrap**: the first broker a client connects to. Passes to the client a list of metadata, including all other brokers
        -   LISTENERS: list of brokers, as resolvable from this bootstrap-broker. <ARBITRARY_NAME>://<domain>:<port>
        -   ADVERTISED_LISTENERS: list of brokers, as resolvable from client. <ARBITRARY_NAME>://<domain>:<port>
-   **cluster**: multiple machines
-   **producer**:
    -   writes events
-   **consumer**:
    -   reads events

# Configuration

-   Properly configuring kafka in docker: https://www.confluent.io/blog/kafka-client-cannot-connect-to-broker-on-aws-on-docker-etc/
-   Basic setup kafka + clickhouse: https://hackernoon.com/setting-up-kafka-on-docker-for-local-development

# REST API

-   `http://localhost:8082/topics/`

# Additional tools

-   **kcat**
    -   `kcat -b localhost:9093 -P -t test-topic`
        -   send lines with `CTRL-D`
    -   `kcat -b localhost:9093 -C -t test-topic`
