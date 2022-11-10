# Docker


Containers and virtual machines.

- A container runs natively on Linux and shares the kernel of the host machine with other containers. It runs a discrete process, taking no more memory than any other executable, making it lightweight.
- By contrast, a virtual machine (VM) runs a full-blown “guest” operating system with virtual access to host resources through a hypervisor. In general, VMs provide an environment with more resources than most applications need.


Images are described by *Dockerfile*s that list all the contents of an image. These image files can be downloaded from a central repository called *docker hub*.
Usually, you write your own dockerfile that specifies as a dependency a more general dockerfile as your base. 

- an *image* is an executable package that includes everything needed to run an application - the code, a runtime, libraries, environment variables, and configuration files. Includes execution of all `RUN` statements
- a *container* is a runtime instance of an image - what the image becomes in memory when executed (that is, an image with state, or a user process). On startup, the `CMD` directive is executed.



## Command overview


- `docker`
    - `image` 
        - `pull`
        - `rm <imagename>`
        - `build --tag=<nameofappalllowercase> .`: package your app and send it to `/var/lib/docker/images`
          - `--file=<path/to>/Dockerfile`
        - `save -o <path-to-tar-file> <name-of-image>`
        - `load -i <path-to-tar-file>/ `
        - `prune -a`: removes un-used, dangling images
            
  - `container`
      - `run -p 4000:80 -d --name=<nameofyourcontaineralllowercase> <nameofyourappalllowercase>` execute that package (where `-p 4000:80` means *map the containers port 80 to the systems port 4000* and `-d` stands for *detached*, i.e. get back control of your command-line after starting the container). `run` is actually a shorthand for `create` and `start`. 
          - *--expose*: makes a port available inside of a docker-network.
          - *--publish*: is the long-form of *-p*. It makes the port available outside of a docker-network.        
              - `run -it ...` creates a new container from an image
              - `start -i ...` starts up an existing container
      - `logs --tail 100 --since <minutes> --timestamps --follow <containerid>`: All `stdout` and `stderr` (?) goes to this log
      - `cp /path/to/local/file.html my-nginx:/var/www/html`
      - `exec`
          - `-it my-nginx /bin/bash`: starts an interactive session
          - `my-nginx cat /etc/resolv.conf`: runs a one-off command on `my-nginx`
      - `inspect --format={{.LogPath}} <containerid>`: Hardware-info
          - `| grep IP`: get container's local IP
      - `rm <containername>`

  - `volume` 
      - `ls`
      - `rm`
      - `create --name <volumename>`
      - To be used with `docker container run -v <volumename>:/container/fs/path <imagename>`

  - `network`
      - `ls`
      - `rm`
      - `create`

  - `system`
    - `df`: shows how much space is being used by docker-daemon
            
    
...

- `docker compose` 
    - `up <optional-container-name>`: builds containers if not already there, starts if not already started
        - `--build`: force rebuild
        - `--no-deps`:  don't (re-)start linked containers
    - `build <optional-container-name>`: only builds, doesn't start containers.
        -  `--no-cache`: ignore cached layers; re-build from scratch
    - `start`: starts a `stop`'ed set of containers.
    - `stop`: stops the containers.
    - `down`: stops the containers and deletes them (but leaves the images intact).
      - `-v`: also removes volumes
        

To stop, rebuild and restart a single container:
`sudo docker-compose stop router && sudo docker-compose build router && sudo docker-compose start -d router`
Or better (*should* work): 
`sudo docker compose build --no-deps router`


## Dockerfile syntax
Dockerfile
```Dockerfile
    # Parent image
    FROM python:2.7-slim
    # All subsequent commands are executed here. May be called mutliple times.
    WORKDIR /app
    # Copy the current directory contents into the container at /app
    COPY . /app
    # Every run command creates another layer
    RUN pip install --trusted-host pypi.python.org -r requirements.txt
    # Make port 80 available to the world outside this container
    EXPOSE 80
    # Define environment variable
    ENV NAME World
    # Cmd is called when the container launches. This command's stout goes directly into the docker logs.
    CMD ["python", "app.py"]
```


## Composefile syntax

- `build`: path to a docker-file, or an object containing the sub-instructions:
  - `context`: path from which to run `docker build`
  - `dockerfile`: path to Dockerfile relative form `context`
  - `args`: object containing arg-names and values
- `image`: id of an image on docker-hub
  - or, if build is also specified: `tag`name under which the built image is to be saved


docker-compose.yml
```yml
version: '3'
services: 
  mysql:
    build: ./mysql
    env_file:
      - ./mysql/resources/mysql.env
    ports:
      - "127.0.0.1:3306:3306"
    volumes:
      - ./mysql/resources/init:/docker-entrypoint-initdb.d     # note how this is a relative path to the local machine == bind-mount
      - mysql-data:/var/lib/mysql                              # note how this is a named volume, referenced again further down in the volume-section
    # See https://www.drupal.org/project/drupal/issues/2966523
    command: --default-authentication-plugin=mysql_native_password

  drupal:
    build: ./drupal
    env_file:
      - ./mysql/resources/mysql.env
      - ./drupal/resources/drupal.env
    depends_on:
      - mysql
    volumes:
        - html:/var/www/html
        - ./dev:/var/www/html/sites
    expose:
      - 9000

  nginx:
    build: ./nginx
    env_file:
      - ./nginx/resources/nginx.env
    depends_on:
      - mysql
      - drupal
    ports:
      - "127.0.0.1:8080:80"
    volumes:
      - html:/var/www/html
      - ./dev:/var/www/html/sites
      - ./nginx/resources/default.conf:/etc/nginx/conf.d/default.conf:ro

volumes:  # all entries here create a new docker-managed volume (as opposed to a bind-mount)
  html:   # this is intentionally left blank! Required to be blank for this to be a volume
  mysql-data:   # this is intentionally left blank! Required to be blank for this to be a volume
```


## Docker-compose and networking:

Consider this docker-compose.yml:
```yml
version: '3'
services:
  middleware:
    build: ./middleware
    ports:
      - "127.0.0.1:8002:8888"
    volumes:
      - ./data:/app/data
  
  frontend:
    build: ./frontend
    depends_on:
      - middleware
    ports:
      - "127.0.0.1:8001:80"

  router:
    build: ./router
    depends_on:
      - middleware
      - frontend
    ports:
      - "127.0.0.1:8000:80"
```


The resulting network:
```
┌────dn───────────────────────────────────────────────────────────────────────┐
│          resolver: 127.0.0.11 <-- configure in nginx                        │
│                                                                             │
│                      http://middleware:8888                                 │    dn: docker-network
│             ┌────────────────────────────────────────┐                      │    dc: docker-container
│             │                                        │                      │
│             │                                        │                      │
│             │   http://frontend:80                   │                      │
│             │ ┌─────────────────┐                    │                      │
│             │ │                 │                    │                      │
│             │ │                 │                    ▼                      │
│             │ │                 ▼                                           │
│      ┌─dc:┼router──────┐    ┌─dc:┼frontend───┐   ┌─dc:┼middleware─────┐     │
│      │                 │    │                │   │                    │     │
│      │     nginx:80    │    │   nginx:80     │   │   node:8888        │     │
│      │                 │    │                │   │                    │     │
│      └─────expose:┼80──┘    └───expose:80────┘   └───expose:8888──────┘     │
│                │                       │                      │             │
│                │                       │                      │             │
│                │                       │                      │             │
└────────────────┼───────────────────────┼──────────────────────┼─────────────┘
                 │                       │                      │
                 │                       │                      │
                 │                       │                      │
                 │                       │                      │
                 ▼                       ▼                      ▼
         localhost:8000             localhost:8001         localhost:8002
```



## Volumes and bind-mounts

| Docker Volumes	                                                                   | Bind Mounts                                                                                                  |
|------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| Volumes are created and managed by Docker	                                         | Bind mounts are not managed by Docker.                                                                       |
| Volumes reside in /var/lib/docker/volumes	                                         | Bind mounts can be any location in the host machine                                                          |
| Volume name is enough to mount it. The path is not required. 	                     | Bind mounts must provide path to host machine to be able to mount it.                                        |
| Backup and recovery is easy	                                                       | Back up and recovery is a bit complicated. But not difficult if you know what folders to backup              |
| Volumes can be interacted with Docker CLI and APIs. This is a clear advantage	     | Bind mounts cannot be accessed with CLI commands. You can still work with them on the host machine directly. |
| Can be used with data created and used by container itself. 	                     | Can be used to access data from host machine                                                                 |
| Volumes can be created while creating the container. 	                             | Bind mount folders get created when the folder does not exist in host machine                                |
| Not recommended for huge data	                                                     | Can be used with huge data                                                                                   |

### Volumes
Persist state between container-restarts.

Cli:
    - Anonymous volumes: 
        - `docker run -v /var/lib/mysql/data` <-- docker automatically creates a volume under `var/lib/docker/volumes`
    - Named volumes: 
        - `docker run -v name:/var/lib/mysql/data` <-- just like anonymous, but named.

In docker-compose.yml:
 - In global volume-section, specify a named entry: `mysql-data:   `
 - In container-level volume-section, specify a mapping: `mysql-data:/var/lib/mysql`

### Bind-mounts
Serves as a way for us to edit files while the container is running.

From cli: 
  - `docker run -v /home/michael/data:/var/lib/mysql/data` <-- explicitly naming the local source dir.
In docker-compose.yml: 
  - Don't specify a global volume-section entry.
  - But do specify a container-level volume entry with a local path: `- ./dev:/var/www/html/sites`



## Layers and continuing failed builds

Each directive in a dockerfile creates a new *layer* (aka. *intermediate image*), which is cached in the engine to speed up the build of other dockerfiles. 
If your build breaks at a certain point in the execution, like this: 

```
    Step 16/25 : RUN cd geoserver.src/src
     ---> Running in dff9e492bfc7
    Removing intermediate container dff9e492bfc7
     ---> 16c2728b1c46
    Step 17/25 : RUN mvn clean install -Pwps,wps-remote,importer -DskipTests
    ---> Running in f102f7633b49
   [INFO] Scanning for projects...
   [INFO] BUILD FAILURE
   [WARNING] The requested profile "wps" could not be activated because it does not exist.
   [WARNING] The requested profile "wps-remote" could not be activated because it does not exist.
   [WARNING] The requested profile "importer" could not be activated because it does not exist.
   [ERROR] The goal you specified requires a project to execute but there is no POM in this directory (/). Please verify you invoked Maven from the correct directory. -> [Help 1]
```

You can start the container at the last successful intermediate image like this: 

```
docker image ls 
    REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
    <none>              <none>              16c2728b1c46        About an hour ago   1.1GB
docker history 16c2728b1c46
    IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
    16c2728b1c46        About an hour ago   /bin/sh -c cd geoserver.src/src                 0B
    63bb6b9446f9        About an hour ago   /bin/sh -c source /etc/profile.d/maven.sh       0B
    e236f5e2c9bc        About an hour ago   /bin/sh -c ln -s /opt/apache-maven-3.6.1/ /o... 24B
docker container run --rm -it 16c2728b1c46 (bash)
```

Note the `--rm` argument. This removes a container again once it has stopt running. You can start a very small container for a single instruction and immediately remove it again like this: 

```
docker container run --rm alpine:latest bin/sh -c "whoami"
```




## Networking

### Default bridge
Docker creates a new network interface `docker0`. This is the interface to the *default bridge*.
New containers are by default deployed in the docker0/bridge network.
Every new container then has its own interface (visible as `vethXXXX` in ifconfig) which are virtually plugged in to the docker0-bridge