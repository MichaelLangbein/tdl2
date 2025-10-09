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

## Lingo

`ifconfig` and `ip route`:

- `gateway: 172.17.0.0/16`:
  - mask out the last 16 bits of address -> `172.17.xxx.xxx`. This is part that all local devices have in common
- `default-gateway: 172.17.0.1`
  - if the target-ip doesn't match the local-net mask, forward the package to the default-gateway. It is a router that will pass this package on.

## Interfaces and IPs

- Interface: a device connected to your computer
- For each interface you have another IP
- Each interface connects you to another gateway-router

## Router algorithm

1. Source:
    1. get target IP from DNS
    2. target-ip in local network?
        1. yes: send directly to target-mac
        2. no: send to default-gateway-mac
2. Gateway (= your closest router):
    1. receive package
    2. target-IP on own subnet?
       1. Get target-MAC per ARP request
       2. target-mac <- target from ARP-table
       3. source-mac <- own mac
       4. But leave source-IP and destination-IP untouched
    3. Target-IP not on own subnet?
       1. check routing table for another router: best router is the one that matches the largest part of the destination-IP (i.e. 123.456.x.x is a better match than 123.x.x.x)
       2. Forward to that router
3. Router: same as gateway

## VPNs

A vpn does the following two things:

1. It hosts its own DNS and connects you to it.
   1. So that you can also look up urls that aren't available in public
2. It creates a virtual network-device on your machine.
   1. Behind this virtual network-device is a VPN-owned router, redirecting to the routers of the previously hidden network.
