# Networking

## Commands
See `linux.md`

## Levels

1. Hardware-layer
2. Datalink-layer: ARP / Ethernet
3. Networking-layer: IP
4. Application-layer: UDP / TCP

## Devices

|                 | switch                                                | bridge                                | router                                         |
|-----------------|-------------------------------------------------------|---------------------------------------|------------------------------------------------|
| summary         | receives arp-packages and broadcasts to local network | connects arp of two separate networks | communicates between local network and outside |
| protocol        | arp/ethernet                                          | arp/ethernet                          | ip                                             |
| ip              | no own ip                                             | no own ip                             | own ip                                         |
| default gateway | NA                                                    | has default gateway                   | is default gateway                             |


### Lingo

`ifconfig` and `ip route`:
- `gateway: 172.17.0.0/16`: 
    - mask out the last 16 bits of address -> `172.17.xxx.xxx`. This is part that all local devices have in common
- `default-gateway: 172.17.0.1`
    - it the target-ip doesn't match the local-net mask, forward the package to the default-gateway. It is a router that will pass this package on.

### Router algorithm

1. Source: 
    1. get target IP from DNS
    2. target-ip in local network? 
        1. yes: send directly to target-mac
        2. no: send to default-gateway-mac
2. Gateway
    1. receive package
    2. target-ip in routing-table? (either locally connected or matching a jump-router)
        1. target-mac <- target from ARP-table
        2. source-mac <- own mac

