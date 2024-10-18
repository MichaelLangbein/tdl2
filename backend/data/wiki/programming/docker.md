# Docker

Containers and virtual machines.

-   A container runs natively on Linux and shares the kernel of the host machine with other containers. It runs a discrete process, taking no more memory than any other executable, making it lightweight.
-   By contrast, a virtual machine (VM) runs a full-blown “guest” operating system with virtual access to host resources through a hypervisor. In general, VMs provide an environment with more resources than most applications need.

Images are described by *Dockerfile*s that list all the contents of an image. These image files can be downloaded from a central repository called _docker hub_.
Usually, you write your own dockerfile that specifies as a dependency a more general dockerfile as your base.

-   an _image_ is an executable package that includes everything needed to run an application - the code, a runtime, libraries, environment variables, and configuration files. Includes execution of all `RUN` statements
-   a _container_ is a runtime instance of an image - what the image becomes in memory when executed (that is, an image with state, or a user process). On startup, the `CMD` directive is executed.

## Command overview

-   `docker`

    -   `image`
        -   `pull`
        -   `rm <imagename>`
        -   `build --tag=<nameofappalllowercase> .`: package your app and send it to `/var/lib/docker/images`
            -   `--file=<path/to>/Dockerfile`
        -   `save -o <path-to-tar-file> <name-of-image>`
        -   `load -i <path-to-tar-file>/ `
        -   `prune -a`: removes un-used, dangling images
    -   `container`

        -   `run -p 4000:80 -d --name=<nameofyourcontaineralllowercase> <nameofyourappalllowercase>` execute that package. `run` is actually a shorthand for `create` and `start`.
            -   `run -it ...` creates a new container from an image and makes it interactive - `start -i ...` starts up an existing container
            -   `--rm` removes the container again after it has been executed.
        -   `logs --tail 100 --since <minutes> --timestamps --follow <containerid>`: All `stdout` and `stderr` (?) goes to this log
        -   `cp /path/to/local/file.html my-nginx:/var/www/html`
        -   `exec`
            -   `-it my-nginx /bin/bash`: starts an interactive session
            -   `my-nginx cat /etc/resolv.conf`: runs a one-off command on `my-nginx`
        -   `inspect --format={{.LogPath}} <containerid>`: Hardware-info
            -   `| grep IP`: get container's local IP
        -   `rm <containername>`

    -   `volume`

        -   `ls`
        -   `rm`
        -   `create --name <volumename>`
        -   To be used with `docker container run -v <volumename>:/container/fs/path <imagename>`

    -   `network`

        -   `ls`
        -   `rm`
        -   `create`

    -   `system`
        -   `df`: shows how much space is being used by docker-daemon

...

-   `docker compose`
    -   `up <optional-container-name>`: builds containers if not already there, starts if not already started
        -   `--build`: force rebuild
            -   `--no-cache`: ignore cached layers; re-build from scratch
        -   `--no-deps`: don't (re-)start linked containers
    -   `build <optional-container-name>`: only builds, doesn't start containers.
        -   `--no-cache`: ignore cached layers; re-build from scratch
    -   `start`: starts a `stop`'ed set of containers.
    -   `stop`: stops the containers.
    -   `down`: stops the containers and deletes them (but leaves the images intact).
        -   `-v`: also removes volumes

To stop, rebuild and restart a single container:
`sudo docker-compose stop router && sudo docker-compose build router && sudo docker-compose start -d router`
Or better (_should_ work):
`sudo docker compose up --build --no-deps -d router`

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

-   `build`: path to a docker-file, or an object containing the sub-instructions:
    -   `context`: path from which to run `docker build`
    -   `dockerfile`: path to Dockerfile relative form `context`
    -   `args`: object containing arg-names and values
-   `image`: id of an image on docker-hub
    -   or, if build is also specified: `tag`name under which the built image is to be saved

docker-compose.yml

```yml
version: "3"
services:
    mysql:
        build: ./mysql
        env_file:
            - ./mysql/resources/mysql.env
        ports:
            - "127.0.0.1:3306:3306"
        volumes:
            - ./mysql/resources/init:/docker-entrypoint-initdb.d # note how this is a relative path to the local machine == bind-mount
            - mysql-data:/var/lib/mysql # note how this is a named volume, referenced again further down in the volume-section
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

volumes: # all entries here create a new docker-managed volume (as opposed to a bind-mount)
    html: # this is intentionally left blank! Required to be blank for this to be a volume
    mysql-data: # this is intentionally left blank! Required to be blank for this to be a volume
```

## Docker-compose and networking:

Consider this docker-compose.yml:

```yml
version: "3"
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

## Volumes: volumes, bind-mounts, drivers

-   `--mount`
    -   `type`
        -   `type=bind`
            -   immediately reads in data from a local directory
            -   if the `dst` already contains data, it will be overwritten by the content of `src`, even if `src` doesn't exist yet
        -   `type=volume`
            -   if the `dst` already contains data, that data will be written to the `src`-volume
            -   `volume-driver=local` (default)
                -   Local driver. All options are like in linux's `mount(8)`. In particular, `type` and `bind` mean something different than the equally named docker concepts.
                -   `volume-opt=type=none`
                -   `volume-opt=o=bind`
                -   `volume-opt=device=/your/local/path`
        -   `type=tempfs`
    -   `src`
        -   `src=/some/local/path` if this is `type=bind`
        -   `src=volumeName` if this is `type=volume`
    -   `dst`

Equivalent in a compose-file:

```yml
version: "3"
services:
    geoserver:
        image: docker.osgeo.org/geoserver:2.23.1
        ports:
            - 8080:8080
        environment:
            - SKIP_DEMO_DATA=true
        volumes:
            - type: volume # other options: bind, tempfs
              source: containerData
              target: /opt/geoserver_data/
            - type: volume # other options: bind, tempfs
              source: containerConfig
              target: /opt/apache-tomcat-9.0.74/webapps/geoserver/

volumes:
    containerData:
        driver: local
        driver_opts: # local driver, therefore all driver_options are as in linux' `mount(8)`. Particularly, `type` and `bind` mean not the same thing as they do for docker.
            type: none
            o: bind
            device: /localhome/lang_m13/Desktop/code/dlr-riesgos-frontend/cache/container/data
    containerConfig:
        driver: local
        driver_opts: # local driver, therefore all driver_options are as in linux' `mount(8)`. Particularly, `type` and `bind` mean not the same thing as they do for docker.
            type: none
            o: bind
            device: /localhome/lang_m13/Desktop/code/dlr-riesgos-frontend/cache/container/config
```

## Layers and continuing failed builds

Each directive in a dockerfile creates a new _layer_ (aka. _intermediate image_), which is cached in the engine to speed up the build of other dockerfiles.
If your build breaks at a certain point in the execution.

For this, however, we must know the hash of the last, failed layer. The reason we cannot see them anymore, is because nowadays docker uses a new build-engine which doesn't log that information. But we can instruct docker to use the old engine:

```bash
  sudo DOCKER_BUILDKIT=0 docker image build --tag deleteme .
```

This prints out:

```bash
...
...
Successfully installed Fiona-1.8.20 Shapely-1.8.0 attrs-21.4.0 certifi-2021.10.8 cftime-1.5.1.1 click-8.0.3 click-plugins-1.1.1 cligj-0.7.2 geopandas-0.10.2 h5py-2.10.0 munch-2.5.0 netCDF4-1.5.8 numpy-1.22.0 pandas-1.3.5 python-dateutil-2.8.2 pytz-2021.3 scipy-1.7.3 six-1.16.0
Removing intermediate container 8bcabbe6bca3
 ---> 045e231b5aec
Step 7/9 : COPY . .
 ---> d726aa79c351
Step 8/9 : RUN exit 1
 ---> Running in ba7d11fb0c97
The command '/bin/sh -c exit 1' returned a non-zero code: 1
```

So the build fails in layer "ba7d11fb0c97", thus the last working layer was "d726aa79c351".
So we can use the last working layer interactively:

```bash
docker container run --rm -it d726aa79c351
```

The new engine, `buildkit`, has [another way of achieving the same thing](https://stackoverflow.com/questions/66186620/get-container-id-from-docker-buildkit-for-interactive-debugging):

Take this example. Here I have 4 stages out of which 2 are parallel stages:

```Dockerfile
FROM debian:9.11 AS stage-01
RUN apt update && apt upgrade -y

FROM stage-01 as stage-02
RUN apt install -y build-essential

FROM stage-02 as stage-02a
RUN echo "Build 0.1" > /version.txt

FROM stage-02 as stage-03
RUN apt install -y cmake gcc g++
```

Now you can use the --target option to tell Docker that you want to stop at the stage-02 as follows:

```bash
$ docker build --file ./Dockerfile --tag deleteme --target stage-02


[+] Building 67.5s (7/7) FINISHED
 => [internal] load build definition from test-docker.Dockerfile         0.0s
 => => transferring dockerfile: 348B                                     0.0s
 => [internal] load .dockerignore                                        0.0s
 => => transferring context: 2B                                          0.0s
 => [internal] load metadata for docker.io/library/debian:9.11           0.0s
 => [stage-01 1/2] FROM docker.io/library/debian:9.11                    0.0s
 => CACHED [stage-01 2/2] RUN apt update &&     apt upgrade -y           0.0s
 => [stage-02 1/1] RUN apt install -y build-essential                   64.7s
 => exporting to image                                                   2.6s
 => => exporting layers                                                  2.5s
 => => writing image sha256:ac36b95184b79b6cabeda3e4d7913768f6ed73527b   0.0s
 => => naming to docker.io/library/deleteme                              0.0s
```

Now you have the image with the name `deleteme` and you can spawn a container to troubleshoot.

```bash
docker run -ti --rm --name deletemeContainer deleteme /bin/bash
root@bbdb0d2188c0:/# ls
```

## Networking

### Default network-driver: bridge

-   Docker creates a new network interface `docker0`. This is the interface to the _default bridge_. For more information on bridges, see `networking.md`
-   New containers are by default deployed in the docker0/bridge network.
-   Every new container then has its own interface (visible as `vethXXXX` in ifconfig) which are virtually plugged in to the docker0-bridge
-   They can communicate with each other through their `vethXXX` over the bridge with all other containers
-   They can **not**:
    -   access other containers by their name
        -   because the containers share a DNS with the host, which is some public entity.
        -   **but**: if the containers are in a network (as is default for docker-compose), they get a dedicated dns, which _can_ resolve container names
        -   they can always resolve each other via their ip-addresses, though. only that you only know those addresses after the container is started.
    -   access any container on another host
        -   but they **can** ping google.com. Because: the bridge has a default-gateway for anything it cannot resolve locally, and this default-gateway is the host. The host thus serves as a router for the containers.
    -   be accessed from the outside
        -   except if they have their ports exposed from the bridge-network with `-p hostport:containerport`

### Only other network-driver worth knowing: host

-   all containers run in hosts network stack
-   you can't do `-p hostport:containerport`, because that is a bridge-only option
-   cannot resolve `http://containername`, can only resolve `http://hostip:targetcontainerport`
-   cannot call `localhost`, because that always gets resolved to the host

### Docker and UFW

-   Docker has an option `--iptables` which is in by default
-   This allows docker to modify the iptables ... **without UFW noticing**(!)
-   More yet: when docker connects the host to a container with `ports: <from>:<to>`, then it **also exposes the port `<from>` to the network** through iptables.

I don't know why this is the default behavior, but it is actually pretty dangerous.
This way, even if you have configured your ufw correctly, you can accidentially open a port to the outside that you thought was only going to be used inside the host.

https://github.com/chaifeng/ufw-docker

## Common caveats

-   `CMD` vs `ENTRYPOINT`
    -   Usually, `ENTRYPOINT` is the name of the bash in which `CMD` will be executed.
    -   That means `CMD` are the arguments fed to `ENTRYPOINT`
    -
-   `ENV` vs `ARG`
    -   `ARG` will be available only at build time. Use this to update config-files on building.
    -   `ENV` will be available at build time _and_ run time. Use this to set environment-config in running process
        -   You can use `ENV` for updating config-files, too. For this, the `sed` code for updating that config file must be somewhere inside `CMD`.
        -   But this will make `CMD` very long. Better create a `start.sh` script, which is run by `CMD`.

## ENV variables

-   `ARG`: available during build time only
    -   from command-line: `--build-arg`
    -   from compose-file: `service: build: args: ...`
-   `ENV`: available during build time and during run time
    -   big caveat during build time: ENV can be set from an ARG at build time, but it cannot be set from the outside via CLI or compose.
    -   from command-line: `-e`
    -   from compose-file: `service: environment: ...`

The fact that `ENV` is available during build- and run-time can cause confusion.

1. ENV cannot be set from outside during build:

```Dockerfile
FROM busybox
ENV greeting "default greeting"
RUN echo $greeting > ./greeting.txt
CMD cat ./greeting.txt
```

There is no command `docker image build -e greeting="yeehaw" --tag greeter .`, so we can't really set greeting from the outside.

2. ENV inside a deep layer won't be over-written by `environment` at run-time, but in CMD it will:

```Dockerfile
FROM busybox
ENV greeting "default hi"
RUN echo $greeting > ./build_greeting.txt
CMD cat ./build_greeting.txt && echo $greeting
```

```yml
grtr:
    build: ./greeter
    ports:
        - 80:80
    environment:
        greeting: "Yeehaw, partner!"
```

This prints "default hi" and "Yeehaw, partner!".
Reason:

-   the file `build_greeting.txt` has been created during build-time, at which time the environment variable couldn't be set from the outside.
-   `CMD` was beeing called during run-time, during which `$greeting` _has_ been substituted from the docker-compose file.

Hierarchy:

-   `.env`:
    -   is substituted into `docker-compose.yml`'s `${variableName}`
        -   there it may be used in any place, not just in `environment`. It may as well be used for `args` or `ports` etc. So `.env` has nothing to do with `ENV`.
    -   it's **not** substituted into `Dockerfile`'s `ENV`
-   `docker-compose.yml`:
    -   `environment` is substituted into `Dockerfile`'s `ENV`
    -   `args` is substituted into `Dockerfile`'s `ARG`
-   `Dockerfile`

## Troubleshooting

### Out of memory error

#### Symptoms

One or more containers immediately stop with an OOM error:

```txt
library initialization failed - unable to allocate file descriptor table - out of memory
```

#### Possible fix

Often times, this is due to the container trying to use more file-resources than your server allows it to.
We have encountered that error with the service `ades`.
If the number of files (`nofiles`) is indeed the source of the problem, then you can tell your server explicitly to allow more files for a docker container inside the `docker-compose.yml` file like so:

```yml
ades:
    image: 52north/ades:latest
    environment:
        SERVICE_SERVICE_URL: ${SysrelUrl}
        SERVICE_PROVIDER_INDIVIDUAL_NAME: Jane Doe
        SERVICE_PROVIDER_POSITION_NAME: First Line Supporter
        DOCKER_ENVPREFIX: TEST_
        TEST_MY_PROPERTY: custom-value
    # This service needs a lot of resources.
    # Your server might not per default allow such a high nofiles,
    # so we're setting it explicitly here.
    ulimits:
        nofile:
            soft: 65536
            hard: 65536
    volumes:
        - /var/run/docker.sock:/var/run/docker.sock
```
