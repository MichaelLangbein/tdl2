# MapReduce

## Concepts

- **HDFS**: Hadoop distributed file storage
  - shared nothing
  - blocks of data stored on different nodes
- **Workflow**: a DAG of jobs ... not part of hadoop; requires a *workflow-scheduler* like airflow, spark or dask.
  - **Job**: a pair of map- and reduce-instructions.
    - **Task**: a part of a job located on one machine, near its input-data.
- **Map**:
  - Called once for every input
  - For each input, creates $n$ output key-value pairs.
  - Hadoop automatically sorts those outputs within every key:
    - fist sorted on mapper's machine.
    - then each reducer collects data with its key and merge-sorts.
- **Reduce**:
  - One reduce-task for each key
    - The phase where the reducers get the data for their keys is called the **shuffle**.
- **YARN-Scheduler** attempts to places steps on the same machine where the data is located.
  - Mappers are placed on the machines where their input is.
    - Number of map-tasks: == number of input-file-blocks
  - Reducers are placed on the machines where their output will go.
    - Number of reduce-tasks: == configured by user.

## Coding

## Setup
```yml
version: "3"

services:

  # keeps track of which file-blocks are stored on which node
  namenode:  
    image: bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8
    ports:
      - 9870:9870
      - 9000:9000
    volumes:
      - hadoop_namenode:/hadoop/dfs/name  # a volume, not a mount; serves to store state.
    env_file: 
      - ./hadoop.env

  # one of the nodes that store the actual HDFS data
  datanode:   
    image: bde2020/hadoop-datanode:2.0.0-hadoop3.2.1-java8
    volumes:
      - hadoop_datanode:/hadoop/dfs/data
    environment:
      SERVICE_PRECONDITION: "namenode:9870"
    env_file:
      - ./hadoop.env

  resourcemanager:
    image: bde2020/hadoop-resourcemanager:2.0.0-hadoop3.2.1-java8
    environment:
      SERVICE_PRECONDITION: "namenode:9000 namenode:9870 datanode:9864"
    env_file:
      - ./hadoop.env

  nodemanager:
    image: bde2020/hadoop-nodemanager:2.0.0-hadoop3.2.1-java8
    environment:
      SERVICE_PRECONDITION: "namenode:9000 namenode:9870 datanode:9864 resourcemanager:8088"
    env_file:
      - ./hadoop.env
  
  historyserver:
    image: bde2020/hadoop-historyserver:2.0.0-hadoop3.2.1-java8
    environment:
      SERVICE_PRECONDITION: "namenode:9000 namenode:9870 datanode:9864 resourcemanager:8088"
    volumes:
      - hadoop_historyserver:/hadoop/yarn/timeline
    env_file:
      - ./hadoop.env
  
volumes:
  hadoop_namenode:
  hadoop_datanode:
  hadoop_historyserver:
```


# Spark

Spark lets you create DAG's of many map/reduce-steps distributed over many nodes.
Note the slash: a spark-operation may be a map only, or a reduce only, or a combination of multiple.


## Versus MapReduce
- MapReduce saves all its results in HDFS after computation. Spark keeps data in memory (in so called RDDs). As long as a single node's data fits into its memory, this is a lot faster.
  - In fact, spark does not come with a data-storage method at all. If you want HDFS, you need to set it up separately.
- Spark has workflows (as in MapReduce-lingo): instead of sending each map-reduce pair separately, it creates a DAG of all required map/reduce operations.
- There is no longer a default-sorting step between every map- and reduce-task.
- The DAG optimizes out all unneccessary map-operations.

## Concepts

Grand concepts:
- **Job**: Code which reads input from HDFS or local and writes some output.
  - **Stages**: Jobs are divided into stages. Stages are classified as map- or reduce-stages.
    - **Tasks**: Each stage has some tasks, one task per partition. One task is executed on one partition by one executor (=process).
- **Master**: The machine on which the driver-program runs.
    - **Driver**: a program that creates a `SparkContext` which it uses to schedule jobs through the cluster-manager.
- **Slave**: A machine on which an executor-program runs.
    - Has a local cache 
    - Interacts wth storage-system
- **Cluster-manager**: Connects the driver-program to the nodes with their executors.
    - Mesos
    - YARN
    - Spark Standalone


In order, the following steps occur:
- On master, the driver-program is executed
- It creates a SparkContext to connect to the cluster-manager.
- The **dag-scheduler** computes a DAG of **stages** for each job and submits it to the task-scheduler
    - The DAG is optimized: many map-operations can be put together in a single stage.
- The task-scheduler finds which nodes are the preferred locations for a task.
    - The schedule is optimized: tasks occur where the data is located (if possible).
    - If an error occurs, the task-scheduler will have a node (or another one) try again.
    - There are different plugins for the scheduling (=scheduler-backends): local, standalone, yarn, mesos.
- The **task-scheduler** passes the **tasks** to the cluster-manager.
- The results of computations are saved in various stores by the **block-manager** on the executors.



More details:
- **RDD**: Resilient distributed dataset.
    - Immutable, distributed, split into multiple partitions.
- **HDFS**: Hadoop distributed file-storage
    - An RDD written to disk(s).
    - You *can* chose to set up HDFS as your data-storage - spark can read such files. But you don't have to, and spark does not come with a data-storage solution included.



# Coding

Note: some operations require you to download additional jars, like for example the postgres-driver-jar.

## Concepts
- API available under `spark`
    ```python
    from pyspark.sql import SparkSession
    spark = SparkSession.builder.appName("Testing data-storage").getOrCreate()
    ```
- `spark.sparkContext` is your access point to the cluster-manager and the nodes.

## Creating an RDD

Create RDD by loading an external dataset:
```python
df = spark.read.format('com.databricks.spark.csv').options(header=True, inferschema=True).load("/home/michael/data.csv", header=True)
df.show(5)
df.printSchema()
```

Create RDD by distribution a collection of objects:
```python
df = sparkContext.parallelize([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12]
]).toDF('col1', 'col2', 'col3')
df.show()
# col1 col2 col3  
# 1    2    3
# 4    5    6
# 7    8    9
# 10   11   12
# <= distributed per round-robin
```

```python
df = spark.createDataFrame(
    [
        ['Michael', 36],
        ['Andreas', 33]
    ],
    ['Name', 'Age']
)
```

## Operations on RDDs: transformations and actions:
- Transformations create a new RDD from an old one.
    - `map, reduceByIndex, filter, mapPartitions, groupBy, pipe, repartition, ...`
- Actions compute some result based on an RDD and ...
    - ... either return it to the driver
    - ... or save it to an external storage (eg HDFS)
    - `reduce, collect, first, treeAggregate, histogram, stdev, saveAsTextFile, ...`

## Distributing large data across cluster
This depends on what your storage solution is.
Common solutions are HDFS, S3, or ...
```python
```

## Getting results back to master
```python
myDf = spark.createDataFrame([ ['Michael', 36], ['Andreas', 33]], ['Name', 'Age'])
myDf.write.format('csv').option("header", "true").save("relative/to/execpath/on/master")
# <-- will save to target-path on master one csv-file per worker
```
On master:
```bash
root@ef5e9026bf46:/opt/spark/relative/to/execpath/on/master# cat part-00000-db13f36f-a92a-4a8c-a1f9-9954fd3056dc-c000.csv 
Name,Age
root@ef5e9026bf46:/opt/spark/relative/to/execpath/on/master# cat part-00007-db13f36f-a92a-4a8c-a1f9-9954fd3056dc-c000.csv 
Name,Age
Michael,36
root@ef5e9026bf46:/opt/spark/relative/to/execpath/on/master# cat part-00015-db13f36f-a92a-4a8c-a1f9-9954fd3056dc-c000.csv 
Name,Age
Andreas,33
```

## Caching
- Workers manage their own cache.
- You can manually trigger caching with `df.cache()`
- **Checkpointing** can be used to truncate DAGs. The results of checkpointing are commited to disk.

# Example application: calculating damage in Lima

## Store exposure data in cluster
By loading it from the webservice

## Store intensity data in cluster
By uploading the file

## Calculate damage
Operations on rdds

## Return location of largest damage
Save back results to master

## Create graphic




# Deployment
Amazon, google-cloud etc. already come with pre-configured spark-clusters.

## Manual setup:
- On master:
    - Go to SPARK_HOME/conf/
    - Copy spark-env.sh.template to spark-env.sh
    - Set SPARK_MASTER_HOST ip-adress
    - Execute `sbin/start-master.sh`
    - Make sure that the ip and the web-ui's port are available through your webserver
- On all slaves:
    - Go to SPARK_HOME/conf/
    - Copy spark-env.sh.template to spark-env.sh
    - Set SPARK_MASTER_HOST ip-adress
    - Execute `sbin/start-slave.sh spark://<master-ip>:7077`


## Docker compose

A single docker-file which can be used for both master and slaves
```yml
# STAGE 1: building

FROM openjdk:11.0.11-jre-slim-buster as builder

RUN apt-get update \
    && apt-get install -y \
    curl vim wget software-properties-common \
    ssh net-tools ca-certificates python3 \
    python3-pip python3-numpy python3-matplotlib \
    python3-scipy python3-pandas python3-simpy 

RUN update-alternatives --install "/usr/bin/python" "python" "$(which python3)" 1

ENV SPARK_VERSION=3.3.1 \
    HADOOP_VERSION=3 \
    SPARK_HOME=/opt/spark \
    PYTHONHASHSEED=1

RUN wget --no-verbose -O apache-spark.tgz "https://archive.apache.org/dist/spark/spark-${SPARK_VERSION}/spark-${SPARK_VERSION}-bin-hadoop${HADOOP_VERSION}.tgz" \
    && mkdir -p /opt/spark \
    && tar -xf apache-spark.tgz -C /opt/spark --strip-components=1 \
    && rm apache-spark.tgz

# STAGE 2: running

FROM builder as apache-spark

WORKDIR /opt/spark

ENV SPARK_MASTER_PORT=7077 \
    SPARK_MASTER_WEBUI_PORT=8080 \
    SPARK_LOG_DIR=/opt/spark/logs \
    SPARK_MASTER_LOG=/opt/spark/logs/spark-master.out \
    SPARK_WORKER_LOG=/opt/spark/logs/spark-worker.out \
    SPARK_WORKER_WEBUI_PORT=8080 \
    SPARK_WORKER_PORT=7000 \
    SPARK_MASTER="spark://spark-master:7077" \
    SPARK_WORKLOAD="master"

EXPOSE 8080 7077 6066

RUN mkdir -p $SPARK_LOG_DIR && \
touch $SPARK_MASTER_LOG && \
touch $SPARK_WORKER_LOG && \
ln -sf /dev/stdout $SPARK_MASTER_LOG && \
ln -sf /dev/stdout $SPARK_WORKER_LOG

COPY start-spark.sh /

CMD ["/bin/bash", "/start-spark.sh"]

```

A script which will configure the container to act as a master or a slave, depending on env-variables set in docker-compose.
```bash
#!/bin/bash

. "/opt/spark/bin/load-spark-env.sh"
if [ "$SPARK_WORKLOAD" == "master" ];
then
    # When the spark work_load is master run class org.apache.spark.deploy.master.Master
    export SPARK_MASTER_HOST=`hostname`
    cd /opt/spark/bin && ./spark-class org.apache.spark.deploy.master.Master --ip $SPARK_MASTER_HOST --port $SPARK_MASTER_PORT --webui-port $SPARK_MASTER_WEBUI_PORT >> $SPARK_MASTER_LOG

elif [ "$SPARK_WORKLOAD" == "worker" ];
then
    # When the spark work_load is worker run class org.apache.spark.deploy.master.Worker
    cd /opt/spark/bin && ./spark-class org.apache.spark.deploy.worker.Worker --webui-port $SPARK_WORKER_WEBUI_PORT $SPARK_MASTER >> $SPARK_WORKER_LOG

elif [ "$SPARK_WORKLOAD" == "submit" ];
then
    echo "SPARK SUBMIT"
else
    echo "Undefined Workload Type $SPARK_WORKLOAD, must specify: master, worker, submit"
fi
```

A docker-compose-file
```yml
version: "3.3"
services:
  
  spark-master:
    image: mysparkimage
    ports: 
      - "9090:8080"
      - "7077:7077"
    volumes:
      - ./apps:/opt/spark-apps
      - ./data:/opt/spark-data
    environment:
      - SPARK_LOCAL_IP=spark-master
      - SPARK_WORKLOAD=master
    
  spark-worker-a:
    image: mysparkimage
    ports: 
      - "9091:8080"
      - "7000:7000"
    depends-on:
      spark-master
    volumes:
      - ./apps:/opt/spark-apps
      - ./data:/opt/spark-data
    environment:
      - SPARK_MASTER=spark://spark-master:7077
      - SPARK_WORKER_CORES=1
      - SPARK_WORKER_MEMORY=1G
      - SPARK_DRIVER_MEMORY=1G
      - SPARK_EXECUTOR_MEMORY=1G
      - SPARK_LOCAL_IP=spark-worker-a
      - SPARK_WORKLOAD=worker
        
  spark-worker-b:
    image: mysparkimage
    ports: 
      - "9092:8080"
      - "7001:7000"
    depends-on:
      spark-master
    volumes:
      - ./apps:/opt/spark-apps
      - ./data:/opt/spark-data
    environment:
      - SPARK_MASTER=spark://spark-master:7077
      - SPARK_WORKER_CORES=1
      - SPARK_WORKER_MEMORY=1G
      - SPARK_DRIVER_MEMORY=1G
      - SPARK_EXECUTOR_MEMORY=1G
      - SPARK_LOCAL_IP=spark-worker-b
      - SPARK_WORKLOAD=worker

  demo-database:
    image: postgres:11.7-alpine
    ports: 
      - "5432:5432"
    environment: 
      - POSTGRES_PASSWORD=casa1234
```


## Submitting a job to the cluster:

- Save your code `main.py` in your local `apps` directory.
- Save any additionally required jars there, too.
- Connect to any node (master or slaves) and run: 
    ```bash
    /opt/spark/bin/spark-submit \
        --master spark://spark-master:7077 \
        --jars /opt/spark-apps/postgresql-42.2.22.jar \
        --driver-memory 1G \
        --executor-memory 1G \
        /opt/spark-apps/main.py
    ```


# Dask
Like spark, dask takes your code and creates a DAG of map-reduce steps to be distributed over many nodes.
Contrary to spark, 
- Its written in python
- It supports numpy (ie. multi-dimensional arrays; RDD's are basically one-dimensional)

However, it has a lot less issues so far: https://insights.stackoverflow.com/trends?tags=apache-spark%2Cpyspark%2Cdask%2Chadoop%2Cairflow
On the other hand, the numpy and pandas maintainers are also working on dask.
 