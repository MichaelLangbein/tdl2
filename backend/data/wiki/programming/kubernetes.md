# Kubernetes

https://www.youtube.com/watch?v=X48VuDVv0do&t=365s

-   **node**: physical machine with own IP
-   **pod**
    -   usually one container in one pod
    -   integrated virtual network: each pod has own IP
    -   ephemeral: a pod dies easily ... so replacement pod gets other IP
-   **deployment**
    -   abstraction over pods
    -   one or several pods from the same blueprint
    -   each pod inside deployment must be stateless (thus no db's)
-   **stateful set**
    -   a deployment that does allow state
    -   harder to set up, though! Often db's are actually managed services outside of k8s
-   **service**
    -   a static IP
    -   a deployment connected to that IP
    -   even if a pod dies, the service remains, IP attached to replacement
    -   internal service:
        -   only available inside
    -   external service:
        -   available to outside via host-node's IP and a port
    -   serves as load balancer: directs traffic to whichever node is least busy
-   **ingress**:
    -   forwards requests to services

<br/>

-   ConfigMap
    -   configuration data
    -   can be connected to pods
    -   don't put credentials in there! Thats what Secret is there for
-   Secret
    -   same as ConfigMap, but for credentials, certificates, keys, tokens
-

<br/>

-   Volumes
    -   can be node-local or elsewhere (even outside k8s-cluster in cloud)
    -   k8s doesn't do any replication or backups!
