# Spark

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



# Coding

Note: some operations require you to download additional jars, like for example the postgres-driver-jar.

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

