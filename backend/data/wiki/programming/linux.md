# Linux

# Basics

- Hardware:

  - CPU
    - x86 (most Desktops)
    - ARM (mobile phones and IMacs)
    - RISC-V (Open-source)
  - GPU
    - SIMD (many variants)
    - RISK-V (under construction)
  - Controllers
    - CPU is connected to controllers
    - The controllers talk to devices
    - CPU talks to controllers by reading and setting values to their registers
    - These registers are mapped to a separate section of memory (MMIO)
    - Often, CPU doesn't actually talk to a device-specific controller, but to a bus-controller, which then talks to a device-controller at a rate that fits the device (this way the CPU needs not slow down to the device-speed)

- Firmware:
  - BIOS (low-level, Assembly)
  - UEFI
- Bootloaders:
  - grub (heavy)
  - syslinux (light)
  - systemd-boot
- Kernel: linux (pid=0)
- Init process: Starts background services (pid=1).
  - initd
  - upstart (simple, synchronous)
  - systemd (systemctl, today default. lazy. lots of extra features).
- Window managers:
  - x11 (server-client model)
  - wayland (modern, less cruft, still unstable)
- GUI libs:
  - GTK (c)
  - Qt (C++, cross-platform for x11, wayland, win32 or cocoa)
- Desktops:
  - KDE (based on Qt). Expl: Kubuntu, Plasma
  - gnome2 (based on GTK). Forks: Mate
  - gnome3 (based on GTK). Forks: Cinnamon
  - xfce (based on GTK).
  - unity (based on GTK, deprecated).
  - pantheon (based on GTK, borrows a lot from gnome3, used in elementaryOS)

# Disks and mounts

- `lsblk`: lists disk devices

  - stands for _block-devices_, which is a very general term for storage devices. Opposed to _character_-devices, which have you enter one bit and have the device receive that bit immediately, block devices receive data in chunks, called blocks.
  - all device-names listed with `lsblk` are made available as files under `/dev/<name>`

- `fdisk`: for partitioning disks

  - `sudo fdisk -l`: shows device infos: start-bit, end-bit, size, ...
  - Before modifying disk, unmount it! `sudo umount </dev/filename or mountpath>`
  - `sudo fdisk /dev/<filename> ` -> interactive prompt
    - none of your changes will be flushed to disk before you finalize at the end.
    - `m`: help
    - `p`: show partitions
    - `g`: create new GPT partition table
    - `n`: create new partition
    - `w`: write to disk - finalizes all changes.
  - This creates a partition-table and a partition ... but doesn't format the partition yet. For that there is `mkfs`

- `mkfs`: creates a file-system on some device

  - `sudo mkfs.ext4 /dev/sdb1 -n <some-nice-name>` : creates the linux-standard file-system, ext4, on the partition that's represented by the file `/dev/sdb1`
  - `sudo mkfs.exfat /dev/sdb1 -n <some-nice-name>` : creates the windows-standard file-system, exfat, on the partition that's represented by the file `/dev/sdb1`

- `mount`: cli to mount devices

  - `mount`: list all mounted devices: file-location, mount-point, file-system-type, parameters.
  - `sudo mount /dev/sdb1 /mnt/targetdir` : doesn't have to be /mount, but considered standard.
  - `sudo mount -v -t nfs servername.de:/serverdir/home /mnt/localname -o rw,soft,retrans=8,sloppy,nfsvers=3`
    - `-v`: verbose
    - `-t nfs`: type nfs
    - `-o`: nfs-specific options

- `/etc/fstab`: config-file to mount devices ... just like `mount`, but run on every boot.

  - source-device: either device-file in /dev/<name> or servername:/serverdir
  - target-path: path where source should be mounted
  - file-system-type: nfs, cifs, ...
  - file-system-specific options: as a comma-separated list without spaces
  - dump: 0 == this file-system needs not be backed up
  - pass: 0 == this file-system needs not be checked on reboot

- `df -h`: show disk usage
- `sudo ncdu`: like df, but much better
- `du . -h`: show file size in this folder
  - `du -a /<some-dir>/ | sort -n -r | head -n 20`

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

# apt

- `apt-cache policy <package-name>`: get the version of a candidate before installing it
- `dpkg -l |grep <package-name>`: check if a package is already installed

# Repo's

Aka. PPA: personal package archive.
PPA's worth knowing:

- Main: from Canonical
- Universe: from community
- Multiverse: legally restricted software
- Restricted: Proprietary drivers

- repos:
  - update repo-content: `apt update`
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

# Other package-mechanisms

- apt
  - Distribution-dependent
  - A package shares it's requirements with other packages
- Snap
  - For many (debian-like) distros, including IOT
  - Packages all requirements
- Flatpack
  - Sandboxed, no root privileges
- AppImage
  - One guy
  - Like exes on Windows
  - All bundled together in one file; so deletion is also just `rm <appimage-filename>`
  - No standardized way of updating
  - https://appimage.github.io/apps/

# directories

- `/bin`: system-wide executables
- `/sbin`: system-wide executables for admin
- `/etc`: system-wide config
- `/var`: system-log-files
- `/dev`: device-files
- `/proc`: process-files
- `/lib`: kernel-modules and shared libraries
- `/usr`
  - `/bin`: user-executables
  - `/lib`: object-files and libraries
  - `/local`:
    - `/bin`: user-executables
    - `/lib`: object-files and libraries

# user-management, ownership

- `whoami`
- `groups <username>`: list groups
- `groupadd <new-group-name>`
- `usermod -a -G <group-to-add-user-to> <user-to-add-to-group>`
- `chown -R <new-owner-name> <file-name>`
- `chgrp -R <new-owner-group> <file-name>`
- `chmod -R g+rw <target>`

# daemons (systemd)

Just named, controllable processes.

- daemons are marked by a `d` at the end (eg. `sshd`)
- `ps -aux | grep <yourprocessname>`
- `systemd` aka `init`: the master-daemon
  - controls all other daemons (aka. units in systemd-lingo)
  - first service to start, pid=1
  - inits all other daemons (`pstree` to see forking-hierarchy)
  - `systemctl stop|start|status|reload <yourdaemon>`
  - `systemctl disable|enable|is-active|is-enabled <yourdaemon>` <- make daemon (not) start on boot
  - `systemctl list-units` <- show all active daemons
  - `systemctl list-unit-files` <- even show non-loaded daemons
  - `systemctl daemon-reload` <-- make systemctl aware of all unit-files
  - `journalctl <yourdaemon>`

Units and unit-files:

- `/lib/systemd/system/` <-- your distro maintainers
- `/usr/lib/systemd/system/` <-- from apt-get packages
- `/run/systemd/system/` <-- transient unit files
- `/etc/systemd/system/` <-- your custom unit files

Example file:

```yml
# /etc/systemd/system/myservice.service
[Unit]
Description=Some text
# Start once network is online
After=network-up.target

[Service]
WorkingDirectory=/home/someuser
ExecStart=/home/someuser/bin/myprogram --my-arg  # still requires full path, even though we have WorkingDir specified (https://askubuntu.com/questions/1063153/systemd-service-working-directory-not-change-the-directory)
Environment=NODE_ENV=production PORT=1494

[Install]
# multi-user state is not finished booting unless our service runs
WantedBy=multi-user.target
```

Some theory:

- there are different types of daemons:
  - service
  - device
  - mount
  - socket
  - target
  - timer
  - partition
- when a process is orphaned because its parent has died, it gets re-assigned to init
- old style: sysv (still common in unix other than linux)
- systemd has replaced sysv

# SE-linux

Additional security layer made by NSA. Common in RHEL and Centos.
It adds _labels_ to your files and processes. For that, your file-system gets periodically _re-labeled_.

There are multiple labels: user*u, role_r, type_t. Together they are called a \_context*.
There is a source-context `scontext` and a target-context `tcontext`.

You can modify both the labels as well as the rules applied to the labels.

## Finding permission problems

- `getenforce`: check if SE-linux is active
- `setenforce 0/1`: deactivate/activate SE-linux
- `cat /var/log/audit/audit.log | grep <processid>`: Check SE-linux log to see if it has interfered with your process
  - `cat /var/log/audit/audit.log | grep <processid> | audit2why`: Clear-text explanation of why an operation was not permitted (nice!)
- `ls -ahltZ`: Check SE-linux labels on your file
- `ps -auxZ`: Check SE-linux labels on your process
- `sesearch`: search rules for keword

## Solving permission problems

- `semanage`:
- `setsebool`:
- `chcon`: Change the labels (=the context) for a file.
  - Example: Making all files in dir accessible by nginx: `chcon -R -v --type=httpd_sys_content_t riesgos/frontend`
- `restorecon`:

# network

- `/etc/resolv.conf`: specifies nameservers (DNS) in order of search preference.
- `/etc/hosts.conf`: overrides all nameservers by mapping urls/shortnames to IPs.
- `iptables -L`: show firewall rules
- `lsof -i -P -n`: show open files (also includes sockets, so useful for web-ports)
- Setting up a webserver: `nc -l 9090`
- own ip: `hostname -I`

## UFW

Notes from [here](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-20-04-de).
Wrapper around `iptables` and `nftables`

### Standard rules

- `ufw default deny incoming` **Danger**: might cut your ssh connection! (at least, once you call `enable`)
- `ufw default allow outgoing`
- `ufw allow ssh`
- `ufw allow http`
- `ufw allow https`
- `ufw allow 9090`
- `ufw allow 9090/tcp`
- `ufw enable`

# processes and threads

- processes `fork()`: creates a copy of the parent process. Copies all of it's associated memory-pages. (never copies read-only pages; only write pages)
  - copy-on-write fork: an optimization of fork.
    - Like fork, but only copies a writeable pages when they are actually written to.
    - Will always cause at least one actual copy: the stack. Because one of the processes pages is the stack and that will definitely be written to. But perhaps no other page!
    - Done by python-multiprocessing, I think.
- threading `pthread_t`: another thread of execution, but sharing the same memory.
  - Linux has a unique implementation of threads. To the Linux kernel, there is no concept of a thread. Linux implements all threads as standard processes. The Linux kernel does not provide any special scheduling semantics or data structures to represent threads. Instead, a thread is merely a process that shares certain resources with other processes. Each thread has a unique task_struct and appears to the kernel as a normal process (which just happens to share resources, such as an address space, with other processes).

|               | Sub-process                      | Thread                               |
| ------------- | -------------------------------- | ------------------------------------ |
| Creation      | Copy of mother process           |                                      |
| Memory        | Own                              | Shared                               |
| Communication | Communicates with parent through | Can directly call methods of parent, |
|               | syscalls, pipes and files        | no piping required                   |

# My wifi

Provider: M-net
`inxi -Fxz`
Network: Device-1: Realtek RTL8111/8168/8411 PCI Express Gigabit Ethernet
vendor: Gigabyte
driver: r8169 v: kernel port: e000 bus ID: 05:00.0
IF: enp5s0 state: down mac: <filter>
Device-2: Realtek RTL8812AE 802.11ac PCIe Wireless Network Adapter
driver: rtl8821ae v: kernel port: d000 bus ID: 06:00.0
IF: wlp6s0 state: up mac: <filter>

### Performance

|               | _initial_ | _phone_ | _rotated_ | _wo rowm._ | _2.4Ghz_ | _2.4Ghz + rowm._ | _laptop_ |
| ------------- | --------- | ------- | --------- | ---------- | -------- | ---------------- | -------- |
| Ping ms       | 37        | 42      | 36        | 36         | 36       | 37               | 38       |
| Download Mbps | 5.70      | 5.70    | 5.70      | 5.69       | 5.70     | 4.38             | 5.70     |
| Upload Mbps   | 0.94      |         | 0.95      | 0.94       | 0.94     | 0.88             | 0.94     |

=> Conclusion: peak performance is already good. Just need to handle those intermittent disconnects.

- explanation of settings: `sudo modinfo rtl8821ae`
- current settings: `head /sys/module/rtl8821ae/parameters/* `
- adjusting settings: `echo "options rtl8821ae  debug=0 disable_watchdog=N fwlps=N swlps=Y swenc=Y ips=N msi=0" > /etc/modprobe.d/mywifisettings.conf`
- update: `sudo nmcli radio wifi off && sudo nmcli radio wifi on`

| setting-name |                                                               | initial | new |
| ------------ | ------------------------------------------------------------- | ------- | --- |
| parm:        | debug_level:Set debug level (0-5) (default 0) (int)           | 0       | 0   |
| parm:        | disable_watchdog:Set to 1 to disable the watchdog (default 0) | N       | N   |
| parm:        | fwlps:Set to 1 to use FW control power save (default 1)       | Y       | N   |
| parm:        | swlps:Set to 1 to use SW control power save (default 0)       | N       | Y   |
| parm:        | ips:Set to 0 to not use link power save (default 1)           | Y       | N   |
| parm:        | swenc:Set to 1 for software crypto (default 0)                | N       | N   |
| parm:        | msi:Set to 1 to use MSI interrupts mode (default 1)           | Y       | 0   |

=> Basically I have now deactivated firmware-powersafe (fwlps) and powersafe (ips) but actiated software-powersafe (swlps). I'm assuming that swlps is overridden by ips.
