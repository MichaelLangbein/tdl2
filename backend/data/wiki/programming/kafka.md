# Kafka

# Disambiguation

https://news.ycombinator.com/item?id=35160555

-   queues vs messaging systems:
    -   direct messaging systems don't store data, they immediately pass it on to clients
        -   this is opposite to kafka, where consumers may also be offline for a while and still catch up later
    -   writes to direct messengers usually are only completed once every target has received a message, whereas in queues writers don't need to wait for delivery at every consumer
-   queues vs databases:
    -   pushes notifications of changes to consumers (instead of db's, where you can only poll, which is expensive)
    -   queue data is deleted once every consumer has received it
    -   no data model
    -   no indexes
    -   no way of querying data except by subscribing to the messages in a topic (which is destructive: data that has been read by all consumers will be deleted)
        -   in kafka (and other log-based queues), reading is _not_ destructive: a log is not destroyed when there are no more consumers, but instead overwritten when a fixed size is reached (its a circular queue)
    -   new consumers only get new data, not old state
-   kafka vs other (non-log-based, aka. JMS/AMQP) queues
    -   contrary to other message queues, kafka replicates logs of data and restores streams when one node fails
    -   if consumers don't process messages fast enough, kafka maintains them (until the log gets too large and gets overwritten)
        -   in other queues, the queue grows until a lagging consumer catches back up ... which might kill the broker by overflowing disk storage
    -   kafka stores logs optimized for large reads (kind of like a column-db does)
    -   producers and consumers are not part of the kafka-core cluster (which consists of zookeeper and brokers)
        -   so producers/consumers have no redundancy
        -   but they don't need it, because kafka will wait for them to come back online, storing all aggregating data

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
        -   LISTENERS: where should this bootstrap-broker listen for incomming connections? <ARBITRARY_NAME>://:<port>
        -   ADVERTISED_LISTENERS: how are the above interfaces resolvable from a client? <ARBITRARY_NAME>://<domain>:<port>
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
