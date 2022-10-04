# Linux

## Disks and mounts
- `/etc/fstab`: config-file to mount devices
- `mount`: cli to mount devices
- `df -h`: show disk usage
- `du . -h`: show file size in this folder
- `lsblk`: lists disk devices
- `fdisk`: for partitioning disks
- `mkfs`: creates a file-system on some device


File-system types:
 - networked (abstract over local formats `ext, ntfs, fat,` ...):
     - `nfs`: network file system. linux. 
     - `cifs`: common internet file system. microsoft's counter to nfs. a dialect of `smb`
     - `smb`: `server message block`. IBM's file sharing protocol. 80's.
 - local:
     - `ntfs`: new tech file system. local. current microsoft format. Journaling.
     - `fat`: by microsoft. No journaling. but compatible with more OS'es.
     - `xfs`: for extremely large files. journaling.
     - `ext`: pretty standard

It can happen that you define a networked mount using `/etc/fstab` but still have to use the `mount` command to enter credentials.

## apt

 - `apt-cache policy <package-name>`: get the version of a candidate before installing it
 - `dpkg -l |grep <package-name>`: check if a package is already installed


## Repo's
Aka. PPA: personal package archive.
PPA's worth knowing:
 - Main: from Canonical
 - Universe: from community
 - Multiverse: legally restricted software
 - Restricted: Proprietary drivers

- repos:
  - update repo-contend: `apt update`
  - list repos: 
    - `apt-cache policy | awk '/http.*amd64/{print$2}' | sort -u`
    - `cat /etc/apt/sources.list.d/*`
  - add repo: `add-apt-repository ppa:<provider>/<program>`
  - key: ``
  - remove repo: ``
- packages:
  - search: `apt search <keyword>`
  - list currently installed: `apt list --installed`
  - remove package: `apt remove apache2` or `apt purge apache2` (also deletes config files)


## directories

- `/bin`: system-wide executables
- `/sbin`: system-wide executables for admin
- `/etc`: system-wide config
- `/var`: system-log-files
- `/dev`: devices
- `/proc`: process-files
- `/lib`: kernel-modules and shared libraries
- `/usr`
    - `/bin`: user-executables
    - `/lib`: object-files and libraries
    - `/local`:
        - `/bin`: user-executables
        - `/lib`: object-files and libraries


## user-management, ownership

- `whoami`
- `groups <username>`: list groups
- `groupadd <new-group-name>`
- `usermod -a -G <group-to-add-user-to> <user-to-add-to-group>`
- `chown -R <new-owner-name> <file-name>`
- `chgrp -R <new-owner-group> <file-name>`



## network

- `iptables -L`: show firewall rules
- `lsof -i -P -n`: show open files (also includes sockets, so useful for web-ports)


## processes and threads
- processes `fork()`: creates a copy of the parent process. Copies all of it's associated memory-pages. (never copies read-only pages; only write pages)
  - copy-on-write fork: an optimization of fork. 
    - Like fork, but only copies a writeable pages when they are actually written to.
    - Will always cause at least one actual copy: the stack. Because one of the processes pages is the stack and that will definitely be written to. But perhaps no other page!
    - Done by python-multiprocessing, I think. 
- threading `pthread_t`: another thread of execution, but sharing the same memory.
  - Linux has a unique implementation of threads. To the Linux kernel, there is no concept of a thread. Linux implements all threads as standard processes. The Linux kernel does not provide any special scheduling semantics or data structures to represent threads. Instead, a thread is merely a process that shares certain resources with other processes. Each thread has a unique task_struct and appears to the kernel as a normal process (which just happens to share resources, such as an address space, with other processes).

|               | Sub-process                         | Thread                                |
|---------------|-------------------------------------|---------------------------------------|
| Creation      | Copy of mother process              |                                       |                                        
| Memory        | Own                                 | Shared                                |
| Communication | Communicates with parent through    | Can directly call methods of parent,  |
|               | syscalls, pipes and files           | no piping required                    |



## My wifi
Provider: M-net
`inxi -Fxz`
Network:   Device-1: Realtek RTL8111/8168/8411 PCI Express Gigabit Ethernet 
           vendor: Gigabyte 
           driver: r8169 v: kernel port: e000 bus ID: 05:00.0 
           IF: enp5s0 state: down mac: <filter> 
           Device-2: Realtek RTL8812AE 802.11ac PCIe Wireless Network Adapter 
           driver: rtl8821ae v: kernel port: d000 bus ID: 06:00.0 
           IF: wlp6s0 state: up mac: <filter>

### Performance
|               | *initial* | *phone*  | *rotated* | *wo rowm.* | *2.4Ghz* | *2.4Ghz + rowm.*| *laptop*
|---------------|-----------|----------|-----------|------------|----------|-----------------|---------
| Ping ms       | 37        | 42       | 36        | 36         | 36       | 37              | 38
| Download Mbps | 5.70      | 5.70     | 5.70      | 5.69       | 5.70     | 4.38            | 5.70
| Upload Mbps   | 0.94      |          | 0.95      | 0.94       | 0.94     | 0.88            | 0.94
=> Conclusion: peak performance is already good. Just need to handle those intermittent disconnects.


- explanation of settings: `sudo modinfo rtl8821ae`
- current settings: `head /sys/module/rtl8821ae/parameters/* `
- adjusting settings: `echo "options rtl8821ae  debug=0 disable_watchdog=N fwlps=N swlps=Y swenc=Y ips=N msi=0" > /etc/modprobe.d/mywifisettings.conf`
- update: `sudo nmcli radio wifi off && sudo nmcli radio wifi on`

| setting-name  |                                                                 | initial | new
|---------------|-----------------------------------------------------------------|---------|------
| parm:         |  debug_level:Set debug level (0-5) (default 0) (int)            | 0       | 0
| parm:         |  disable_watchdog:Set to 1 to disable the watchdog (default 0)  | N       | N
| parm:         |  fwlps:Set to 1 to use FW control power save (default 1)        | Y       | N
| parm:         |  swlps:Set to 1 to use SW control power save (default 0)        | N       | Y
| parm:         |  ips:Set to 0 to not use link power save (default 1)            | Y       | N
| parm:         |  swenc:Set to 1 for software crypto (default 0)                 | N       | N
| parm:         |  msi:Set to 1 to use MSI interrupts mode (default 1)            | Y       | 0

=> Basically I have now deactivated firmware-powersafe (fwlps) and powersafe (ips) but actiated software-powersafe (swlps). I'm assuming that swlps is overridden by ips.

