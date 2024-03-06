---
title: "Arch Linux Installation Guide"
pubDate: 2021-04-28
description: "In this first part of the Arch Linux installation guide. You will learn how to download and verify the latest version of Arch Linux, and write it to a USB drive. In part two, you'll learn how to boot into a live Arch Linux environment and set yourself up for installation. In part 3, you will learn how to partition, format and mount a drive to install Arch Linux on. In part 4, you will learn how to will be installing essential packages. Configuring the system. And adding a boot loader to the system. In part 5, you will learn how to will be creating a user account, adding access to more programs and setting up a graphical environment."
author: "richard"
tags: ["archlinux", "linux"]
draft: true
---

import image1 from "@assets/blog/arch-linux-installation-guide/image-1.png";
import image2 from "@assets/blog/arch-linux-installation-guide/image-2.png";

In part 1 of this **series**, I will be showing you how to download the latest version of Arch Linux, and write the operating system's image file onto a USB, to be used for installation.

> **\*Notes:** There are a few presumptions being made for this guide. Regarding yourself and your current setup.\*
>
> - _You will be moving from another \*nix system._
>   - _This will help with the initial steps, with the programs being used to download the image and write it to a USB drive._
>   - _If you are coming from Windows, I will try to link to articles explaining this fairly trivial difference._
> - _Have access to this guide on another device._
>
>   - _As once we get to installing Arch Linux, we'll be stuck in a terminal for some major steps._
>
> - _Can handle looking deep into the empty void of the tty._
> - _Make sure not to make any typos - as I try to do the same throughout these guides._

---

## What you'll need:

- **USB drive** to write the ISO file on (making sure it's bigger than the ~700 MB ISO size).
- **dd** a GNU core utility, to do the writing onto the USB (this will overwrite all data on the drive).
  - This should already be installed on all \*nix systems.
  - If you're using Windows, I'd recommend [Rufus](https://rufus.ie/) for this step.
- **gnupg** installed if you're not one for taking risks.

---

# Downloading the latest version of Arch Linux

First we'll head over to the official [Arch downloads page](https://archlinux.org/download/) for the latest image, to be written to our USB drive. Using either BitTorrent or a HTTP mirror.
You can test which mirrors would best perform this task using both the [mirror list generator](https://archlinux.org/mirrorlist/) and check the [mirror status](https://archlinux.org/mirrors/status/).

Once you've downloaded an ISO, it's recommended to verify the image signature, for security purposes. So, make sure to also download the PGP signature file (\*.iso.sig), and enter the following command:

```bash
$ gpg --keyserver-options auto-key-retrieve --verify archlinux-xxxxxxx-x86_64.iso.sig

Output:
gpg: assuming signed data in '/home/user/Downloads/archlinux-2021.02.01-x86_64.iso'
gpg: Signature made Mon 01 Feb 2021 15:23:39 GMT
gpg:                using RSA key 4AA4767BBC9C4B1D18AE28B77F2D434B9741E8AC
gpg: key 7F2D434B9741E8AC: public key "Pierre Schmitz <pierre@archlinux.de>" imported
gpg: Total number processed: 1
gpg:               imported: 1
gpg: Good signature from "Pierre Schmitz <pierre@archlinux.de>" [unknown]
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: 4AA4 767B BC9C 4B1D 18AE  28B7 7F2D 434B 9741 E8AC
```

> _Replacing xxxxxxx with the version downloaded._

You can then go one step further in making sure you've got the right ISO, by cross-referencing the public-key - used to decode the signature. Either by being signed by another trustworthy source. Or by comparing the public key's fingerprint, matches that of the [developer who signed the file](https://archlinux.org/people/developers/). By clicking on the author's PGP key and comparing the public key at the top of the page.

---

# Preparing the USB drive for installation

Plug in your USB and find the drive using the terminal:

```bash
$ lsblk

Output:
NAME    MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda       8:0    1  28.9G  0 disk
```

> If you ever want to reuse the USB after installation use the command (`sudo wipefs --all /dev/sda`)

To load the installation media to the USB using **dd**, use the following command. Remembering to replace the absolute paths (e.g. `of=/dev/nvme0n1`).

```bash
$ sudo dd bs=4M if=/home/user/Downloads/archlinux-2021.02.01-x86_64.iso of=/dev/sda status=progress oflag=sync

Output:
708837376 bytes (709 MB, 676 MiB) copied, 35 s, 20.2 MB/s
172+1 records in
172+1 records out
723857408 bytes (724 MB, 690 MiB) copied, 35.6391 s, 20.3 MB/s
```

---

Now you should have the Arch Linux ISO on your USB! 🎉

```bash
$ lsblk

NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda           8:0    1  28.9G  0 disk
└─sda1        8:1    1   629M  0 part
...
```

###[Next up, we'll be booting into a live Arch Linux environment 👉](https://www.rshalford.com/blog/arch-linux-installation-guide)

---

In part 2 of this **series**, we will be booting into a live Arch Linux environment. With the use of the USB drive we setup in the [previous article](https://www.rshalford.com/blog/arch-linux-installation-guide).

> **\*Notes:** There are a few presumptions being made for this guide. Regarding yourself and your current setup.\*
>
> - _You will be moving from another \*nix system._
>   - _This will help with the initial steps, with the programs being used to download the image and write it to a USB drive._
>   - _If you are coming from Windows, I will try to link to articles explaining this fairly trivial difference._
> - _Have access to this guide on another device._
>
>   - _As once we get to installing Arch Linux, we'll be stuck in a terminal for some major steps._
>
> - _Can handle looking deep into the empty void of the tty._
> - _Make sure not to make any typos - as I try to do the same throughout these guides._

---

## What you'll need:

- **USB drive** which will have our installation medium loaded to it.
- **Disable Secure Boot** for the installation image to be supported. This can be re-enabled once the install has finished.
- **Internet connection** available.
  - Preferably via Ethernet.
  - If you will be using WiFi there are a few steps that I will cover. Every install I've done has been this way and it's really no bother.

---

# Loading up the live environment

> Before booting the USB, make sure to turn off secure boot in the UEFI.

Plug in your USB and turn on you computer. Making sure to enter the boot menu and select the installation medium on your USB.

The key to press to enter the boot menu will vary depending on your motherboard. If you never see this boot menu option, and you load straight into your original operating system (likely Windows). This will mean you also need to turn off [Fast Startup](https://www.windowscentral.com/how-disable-windows-10-fast-startup) in you UEFI settings.

Now you should be greeted with the virtual console, and see that you are logged in as the root user.

---

# Setting up the live environment for installation

## Boot mode

Before anything, we need to verify that we are booting into UEFI mode.

```zsh
$ ls /sys/firmware/efi/efivars
```

This should hopefully output the directory. If it didn't, you may be using a different boot mode than UEFI (e.g. BIOS).

Next, we will make sure your keyboard, clock and internet are connected. Before we move onto partitioning the hard drive to make space for our Arch install to live.

---

## Keyboard layout

To get a list of all available key-maps available:

```zsh
$ ls /usr/share/kbd/keymaps/**/*.map.gz
```

To narrow down your search, you can be little more advanced and pipe this list into **grep**, to make the listing easier to read. A simple example to get all Dvorak key-maps:

```zsh
$ ls /usr/share/kbd/keymaps/**/*.map.gz | grep dvorak
```

Then, once you've found your key-map of choice, load it up with the following command. Remembering to leave off the **.map.gz** file extension:

```zsh
$ loadkeys uk
```

> For the "/usr/share/kbd/keymaps/i386/qwerty/uk.map.gz" keymap.

Now everything should be inserted correctly when you type out the remaining commands.

---

## Make sure we're online

We first need to make sure our computer's network devices are recognised. As an example, my computer's Ethernet (eth13s0) and WLAN (wlp14s0) interfaces are listed with the following command:

```zsh
$ ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: enp13s0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc mq state DOWN mode DEFAULT group default qlen 1000
    link/ether 40:8d:5c:50:76:63 brd ff:ff:ff:ff:ff:ff
3: wlp14s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DORMANT group default qlen 1000
    link/ether a4:34:d9:09:77:57 brd ff:ff:ff:ff:ff:ff
```

If you're connected with an Ethernet cable, you should be okay with connecting to the internet. We can test this by pinging a popular domain we expect to be running. Once we can see that we can connect to the outside world, we can move on to [the next step](#updating-the-system-clock).

```zsh
$ ping wikipedia.com
PING wikipedia.com (91.198.174.194) 56(84) bytes of data.
64 bytes from ncredir-lb.esams.wikimedia.org (91.198.174.194): icmp_seq=1 ttl=55 time=27.0 ms
64 bytes from ncredir-lb.esams.wikimedia.org (91.198.174.194): icmp_seq=2 ttl=55 time=28.6 ms
64 bytes from ncredir-lb.esams.wikimedia.org (91.198.174.194): icmp_seq=3 ttl=55 time=154 ms
^C
--- wikipedia.com ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2002ms
rtt min/avg/max/mdev = 26.984/69.917/154.174/59.581 ms
```

> Entering Ctrl-C to stop this call (^C shown above)

---

### WiFi connection setup

For wireless connectivity, we will use the preinstalled **iwd** command line tool, with the following steps:

- To enter the tool's interactive prompt.

```zsh
$ iwctl
```

- Getting the name of the WiFi device. Mine was labelled as **wlan0**, so remember to replace the following commands with the name of your device.

```zsh
$ device list
```

- Start a scan for available networks.

```zsh
$ station wlan0 scan
```

- Bring up a list of the available networks.

```zsh
$ station wlan0 get-networks
```

- Connect to the network. Replace **SSID** with the name of the network you want to connect to. You will then be prompted to enter and submit the password for this network.

```zsh
$ station wlan0 connect SSID
```

- Hopefully show that you are now connected to your network.

```zsh
$ station wlan0 show
```

Exiting the interactive prompt with `Ctrl-d`.

To make sure things are running as they should.

```zsh
$ ping wikipedia.com
```

---

## Updating the system clock

This is a simple step.

```zsh
$ timedatectl set-ntp true
```

### [Next up, we'll be partitioning our hard drive, for Arch Linux to live on. 👉](https://www.rshalford.com/blog/arch-linux-installation-guide)

---

In part 3 of this **series**, we will be partitioning, formatting and mounting a drive to install Arch on. This follows on from the live environment setup completed in the [previous part](https://www.rshalford.com/blog/arch-linux-installation-guide) of this guide series.

> **\*Notes:** There are a few presumptions being made for this guide. Regarding yourself and your current setup.\*
>
> - _You will be moving from another \*nix system._
>   - _This will help with the initial steps, with the programs being used to download the image and write it to a USB drive._
>   - _If you are coming from Windows, I will try to link to articles explaining this fairly trivial difference._
> - _Have access to this guide on another device._
>
>   - _As once we get to installing Arch Linux, we'll be stuck in a terminal for some major steps._
>
> - _Can handle looking deep into the empty void of the tty._
> - _Make sure not to make any typos - as I try to do the same throughout these guides._

---

## What you'll need:

- The patience to re-read every command you type, and output given.
- It's not the end of the world if you "mess up" at any stage here. You'll just save yourself the time of redoing anything, if you do.

---

# Partitioning

First, we need to partition our hard drive. Creating a space for the boot, file system and swap partitions. For this, we'll use **fdisk**, a common Linux utility.

To get started, use the below command to list view the hard drive and it's current partitions.

```sh
$ fdisk -l
```

This should give you a similar view as the **lsblk** command. Used when [preparing the USB drive in part 1](https://www.rshalford.com/blog/arch-linux-installation-guide/#preparing-the-usb-drive-for-installation).

Now you should be able to identify which drive you have to partition. Next, you will input this drive path as an argument to the fdisk command.

```sh
$ fdisk /dev/nvme0n1
```

> Remembering to replace the path given above, with one that corresponds with your system (e.g. _fdisk /dev/sda_ or _fdisk /dev/nvme0n1_).

This will then prompt you with a series of commands to enter. To save some time I have provided you with some pretty standard options. You can tailor these to what you require - if you know what you're doing.

```sh
$ fdisk /dev/nvme0n1
$ m
$ g
$ n
$ 1
$ return
$ +550M
```

- m = shows the help message
- g = creates a gpt partition table
- n = creates a new partition
- 1 = partition number using the default
- return = first sector starts at 2048 as default
- +550M = gives the partition a size of 550M

This should now have created the first partition, that will be used for the EFI system.

You can list this new partition by entering _p_. This will show device start and end sectors (in mebibits, Mi) and type as "Linux filesystem".

At this point you haven't actually committed any changes yet to your drive. So don't worry if you think you've messed up. As you can _fdisk /dev/nvme0n1_ and select _d_ to delete a partition, or _q_ to quit without saving all changes.

---

## Swap Partition

To some, the creation of a swap partition is an optional step. But, given how affordable storage space is, the impact of having one is almost negligible. Especially when compared to losing all unsaved work, when your RAM fills up. And your computer needs to be restarted. Also, if you're still one to use hibernation, you will need at least the same amount of swap space as you do RAM, to store your system's state.

So creating this partition is much like the previous step. Hit _n_, and we'll create the swap partition. Enter _2_ for the partition number. Go with the default start position. And finally select how much swap space you want to assign.

```sh
$ n
$ 2
$ return
$ +4G
```

I'm choosing a swap space partition size of 4GB as I have 16GB of RAM. Some might see this as too much and some as too little. Here's an [easy to use table](https://help.ubuntu.com/community/SwapFaq#How_much_swap_do_I_need.3F) by people who know more about this than I do.

<img
  src={image1.src}
  alt="Ubuntu's table showing how much swap space you might need"
/>

---

## File System Partition

Now to create the partition for the system file system. Where your root directory will be created. Again this means following similar steps as before.

```sh
$ n
$ 3
$ return
$ return
```

Selecting the default partition size, by entering _return_ for the deault value. You will be assigning all remaining drive space for the Linux file system.

---

## Assigning Partition Types

Before assigning a type to each partition. We will view what we have done so far, by entering _p_, to show the current partition table.

```sh
Device          Start   End       Sectors   Size    Type
/dev/nvme0n1p1  2048    1128447   1126400   550M    Linux filesystem
/dev/nvme0n1p2  1128448 9517055   8388608   4G      Linux filesystem
/dev/nvme0n1p3  9517056 488397134 478880079 228.3G  Linux filesystem
```

> This is what my table looks like with a 256GB drive.

So far, all partitions are of the type "Linux filesystem". But we need to change the first two, to create both the EFI System and Linux swap partitions.

First up will be the 550M partition (1). Entering the below key presses to;

1. change partition type, _t_
2. select the correct partition, _1_
3. list available partition types, _L_
4. choose the EFI System partition type, _1_

```sh
$ t
$ 1
$ L
$ 1
```

Then we will do the same to the sencodn partition, creating the swap partition.

```sh
$ t
$ 2
$ L
$ 19
```

As the third partition is already of the right type to hold the root directory we can leave it as is. We can then view the partition table, _p_.

```sh
Device          Start   End       Sectors   Size    Type
/dev/nvme0n1p1  2048    1128447   1126400   550M    EFI System
/dev/nvme0n1p2  1128448 9517055   8388608   4G      Linux swap
/dev/nvme0n1p3  9517056 488397134 478880079 228.3G  Linux filesystem
```

If you're happy with how everything looks. Hit _w_, and this new table will be saved.

---

# Formatting Partitions

Now the drive partitions have been created and assigned a type. They will now need to be formatted.

---

## EFI System Partition

As the EFI system partition is independent of the operating system being run. This means you can add a Windows operating system to your computer. Either as a separate drive or another set of future partitions.

With the EFI system partition, we will choose to go with a FAT32 file system. Instead of the standard Linux format, ext4. The [Arch Wiki](https://wiki.archlinux.org/index.php/EFI_system_partition) has a handy page all about the EFI system partition, if you have any further questions.

To format the partition, enter the following.

```sh
$ mkfs.fat -F32 /dev/nvme0n1p1
```

> Notice the additional partition number, _p1_, added to the end of the drive path.

---

## Linux Swap Partition

Then we will initialise the swap partition, _p2_.

```sh
$ mkswap /dev/nvme0n1p2
```

---

## Linux File System Partition

Finally before mounting, we will format the Linux filesystem as ext4.

```sh
$ mkfs.ext4 /dev/nvme0n1p3
```

> When it starts to create the journal it may take a few seconds.

---

# Mounting the Formatted Partitions

Now we can mount the formatted partitions and enable the swap space.

```sh
$ swapon /dev/nvme0n1p2
$ mount /dev/nvme0n1p3 /mnt
```

Done. 🎉

We're almost there!

### [Next up, we'll install some essential packages. Make sure all things are configured. Then we can restart your computer and load up into a fresh install of Arch Linux. 👉](https://www.rshalford.com/blog/arch-linux-installation-guide)

---

In part 4 of this **series**, we will be installing essential packages. Configuring the system. And adding a boot loader to the system. This follows on from the drive partitioning, formatting and mounting in the [previous part](https://www.rshalford.com/blog/arch-linux-installation-guide) of this guide series.

> **\*Notes:** There are a few presumptions being made for this guide. Regarding yourself and your current setup.\*
>
> - _You will be moving from another \*nix system._
>   - _This will help with the initial steps, with the programs being used to download the image and write it to a USB drive._
>   - _If you are coming from Windows, I will try to link to articles explaining this fairly trivial difference._
> - _Have access to this guide on another device._
>
>   - _As once we get to installing Arch Linux, we'll be stuck in a terminal for some major steps._
>
> - _Can handle looking deep into the empty void of the tty._
> - _Make sure not to make any typos - as I try to do the same throughout these guides._

---

## What you'll need:

- Maintain the internet connection you [setup in part 2](https://www.rshalford.com/blog/arch-linux-installation-guide/#make-sure-were-online).
- The patience to re-read every command you type, and output given.
- It's not the end of the world if you "mess up" at any stage here. You'll just save yourself the time of redoing anything, if you do.

---

# Installing Arch Linux

Arch Linux uses the package manager, _pacman_. The Debian equivalent to _apt_ or Fedora's _dnf_. Before we can do any of that, we need to install three essential packages. That provide everything necessary for you to tell other people that you "use Arch Linux by the way."

> In the future I may write about pacman's repository system, and the different ways to use it. But carrying out the commands later on in this tutorial are simple enough.

For now we'll be using the _pacstrap_ script to install packages to the new root directory. Installing the [_base_ package](https://archlinux.org/packages/core/any/base/), the Linux kernel, and the Linux firmware package to help support common hardware on your device.

```sh
$ pacstrap /mnt base linux linux-firmware
```

> The _linux_ kernel package can be changed for the _linux-hardened_, _linux-lts_ or _linux-zen_ kernels.

Leave that to do it's work for a few minutes...

Then, once done, we'll go through some configurations for the system.

---

# Generating the fstab File

As the [Arch Wiki](https://wiki.archlinux.org/index.php/Fstab) states;

> _"The fstab file can be used to define how disk partitions, various other block devices, or remote filesystems should be mounted into the filesystem."_

To generate this _fstab_ file, enter the below command.

```sh
genfstab -U /mnt >> /mnt/etc/fstab
```

---

# Change Root Into Your New System

Chroot command to change root into this new installation.

```sh
arch-chroot /mnt
```

Now you can use the _ls_ command to view what the file structure of your new home will look like. Look's nice, huh?

---

# Set Time Zone

As we are now in a new installation, we need to set the time zone. To do this, we need to know which region we are from.

```sh
$ ls /usr/share/zoneinfo/
```

And what city is the nearest one to your location.

```sh
$ ls /usr/share/zoneinfo/region/
```

> Remembering to replace _/region/_ with one that is appropriate to yourself.

Now we know the closest location. We'll use the following command to force create a symbolic link - using the _-sf_ arguments.

```sh
$ ln -sf /usr/share/zoneinfo/REGION/CITY /etc/localtime
```

Entering the following, will generate the _adjtime_ file.

```sh
$ hwclock --systohc
```

---

# Localisation

With the system's time zone set, we need to select and then generate the locales. Which are required for certain programs and libraries to function as expected.

We do this by editing the _/etc/locale.gen_ file. Uncommenting locales that relate to you. For example, in the US, this will likely be `en_US.UTF-8 UTF-8` - found on line 177.

---

## Using an Editor

As Arch doesn't come with a text editor installed with the _base_ package. We need to install one to make the edit to the locale.gen file.

My recommendations here are to use the beginner-friendly command-line interface editor _nano_. As it shows the appropriate Ctrl, _^_, commands to save and exit the program, once done uncommenting the locales.

Otherwise, install and use _vim_. And let your mind expand.

To do this, enter the following command - with your chosen editor as the argument.

```sh
$ pacman -S nano
```

Now you can edit that _locale.gen_ file. Once the correct lines have been uncommented, generate the locales.

```sh
$ locale-gen
```

---

## Set the LANG Variable

Next up is to create and then set the LANG variable.

```sh
$ nano /etc/locale.conf

LANG=en_GB.UTF-8
```

> Entering the same information for the variable, as you uncommented from the locale.gen file.

---

## Keyboard Layout

Like we did in [part 2 of this series](https://rshalford.com/blog/arch-linux-installation-guide/#keyboard-layout), we need to set the keyboard layout for our region. Refer to that article section, to find your KEYMAP value.

```sh
$ nano /etc/vconsole.conf

KEYMAP=uk
```

---

# Network Configuration

Create and edit the _hostname_ file. Here you will enter the name you want your device to be known as on your network.

```sh
$ nano /etc/hostname

desktop
```

Then we need to add our hosts to the _/etc/hosts_ file. Using our _hostname_ (e.g. _desktop_) where appropriate.

```sh
$ nano /etc/hosts

127.0.0.1   localhost
::1         localhost
127.0.1.1   desktop.localdomain desktop
```

---

# Setting the Root Password

So we don't have to _chroot_ when we load back up. It's best to set the root password now. Using the _passwd_ script, create your password and confirm it.

```sh
$ passwd
New password:
Retype new password:
passwd: password updated successfully
```

---

# Bootloader

Before we're done with setting up the base install and configuring it. We need to to install a few packages to make sure the UEFI firmware can find and start the bootloader, which is in the EFI system partition.

Basically, when you start your computer, Arch Linux will be listed and can be started.

The almost "standard" bootloader these days is _GRUB_. As it can support our chosen firmware (UEFI), partition table (GPT), can multi-boot, and supports our Linux file system partition (ext4).

To setup _GRUB_, we also need to install a few other packages that will support it's installation.

```sh
$ pacman -S grub efibootmgr os-prober dosfstools mtools
```

- _grub_ is the bootloader.
- _efibootmgr_ writes the boot entries, making Arch Linux discoverable.
- _os-prober_ is used to discover other installed operating systems on your computer.
- _dosfstools_ allows the system to create, check and label FAT32 file systems.
  - e.g. format a USB to FAT32.
- _mtools_ allows you to access FAT file systems.

Now we need to create an EFI directory in _/boot/_.

```sh
$ mkdir /boot/efi
```

We can now mount the EFI system partition to that new directory.

```sh
$ mount /dev/nvme0n1p1 /boot/efi
```

Then we need to run the GRUB installation script, _grub-install_. Which will install the GRUB EFI application and install it's modules.

```sh
$ grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=grub_uefi --recheck
```

When the computer starts up, it loads the GRUB configuration file, _/boot/grub/grub.cfg_. So we need to generate this file.

```sh
$ grub-mkconfig -o /boot/grub/grub.cfg
```

---

# We're Done! (mostly)

At this point you can `exit` the chroot environment, `umount -R /mnt` and enter `reboot`. Before doing that, however, this is a good place to your user account and install a few more packages. Making your new home a bit nicer to look and easier to use, than this black void.

---

### [Next up, we'll add a user account and go look at some recommended programs to install. Including choosing your desktop environment! 👉](https://www.rshalford.com/blog/arch-linux-installation-guide)

---

In part 5 of this **series**, we will be creating a user, adding access to more programs and setting up a graphical environment. Then we can finally boot up into out fresh install of Arch Linux. This follows on from installing Arch, configuring it's setup and boot process in [previous part](https://www.rshalford.com/blog/arch-linux-installation-guide) of this guide series.

> **\*Notes:** There are a few presumptions being made for this guide. Regarding yourself and your current setup.\*
>
> - _You will be moving from another \*nix system._
>   - _This will help with the initial steps, with the programs being used to download the image and write it to a USB drive._
>   - _If you are coming from Windows, I will try to link to articles explaining this fairly trivial difference._
> - _Have access to this guide on another device._
>
>   - _As once we get to installing Arch Linux, we'll be stuck in a terminal for some major steps._
>
> - _Can handle looking deep into the empty void of the tty._
> - _Make sure not to make any typos - as I try to do the same throughout these guides._

---

## What you'll need:

- The patience to re-read every command you type, and output given.
- It's not the end of the world if you "mess up" at any stage here. You'll just save yourself the time of redoing anything, if you do.

---

# Creating a User

When using the new installation, we don't want to be the root user. Therefore, we should now create a user, and give it a password.

```sh
$ useradd -m richard
$ passwd richard
```

When logged in as this new user, we probably want to be able to have access to some necessary functions. Here we will use the _usermod_ command to do this. Selecting a few appropriate groups to add the user to.

```sh
$ usermod -aG wheel,audio,video,input,storage richard
```

> This command will output and error if you use spaces between commas.

---

## Sudo Privileges

As we want to give this user root privileges, by adding it to the wheel group. Without having to rely on entering root with _su_, and exiting out of the interactive shell every time. We can install the package, _sudo_, for the ability to perform one-off root commands.

```sh
$ pacman -S sudo
```

To make sure this user has the privileges of root, thanks to being added to the wheel group. We need to comment out the following line in the sudoers file.

```sh
 $ EDITOR=nano visudo

%wheel ALL=(ALL) ALL
```

> So that you don't need to enter a password to use sudo, as a wheel group member. You can also uncomment the next line in the file, `%wheel ALL=(ALL) NOPASSWD: ALL`

---

# Network Manager

For future's sake, and making life easier every time you boot up your computer. You'll want to automatically connect to the internet. For this, a very useful package is _NetworkManager_. Which comes with both a CLI (nmcli) and TUI (nmtui) program, to view, edit and activate network connections.

```sh
$ pacman -S networkmanager
```

Now to make sure the init system, _systemd_, has _NetworkManager_ enabled and will run when the computer starts up.

```sh
$ systemctl enable NetworkManager
```

---

# Extending Program Availability

At the moment, the only way to download and install, comes from Arch's official stable repositories; core, extra and community.

If you want to have access to the [Arch User Repository, _AUR_](https://aur.archlinux.org/). Which will provide you with an endless amount of programs. We will first need to install the _base-devel_ metapackage, to provide the tools necessary to for compiling software. Including _git_, a version control system, which will allow you to clone programs from online repositories.

```sh
$ pacman -S --needed base-devel git
```

To make life easier when installing packages from the AUR, it's recommended to install an AUR helper. My recommendation here is to use _Yay_, as it works in a similar way to pacman.

We will move into the _/opt/_ directory to install yay, as it seems like an appropriate directory. Given it's meant for installing add-on application software packages. Then we will clone yay, give our new user access to it and then build it.

```sh
$ cd /opt
$ git clone https://aur.archlinux.org/yay.git
$ chown -R richard:wheel ./yay
$ cd yay/
$ makepkg -si
```

And that's it for extending software availability on Arch Linux. Now we can focus on making the operating system user friendly, and add a graphical user interface.

---

# Rebooting Arch

With Arch Linux finally installed, added to the bootloader menu, and with a user to log in with. We can now after all this time, reboot the computer. First we need to exit the chroot environment, unmount all partitions, and shutdown the computer.

```sh
$ exit
$ umount -R /mnt
$ shutdown now
```

With this done all you have to do is remove the USB installation media and hit the power button.

With that done. You should now be prompted to enter the desktop (hostname) login and password for your user.

🥳 You're done! 🎉

But... things still look the same.

---

# Graphical User Interface

So far, we've spent our lives in tty purgatory. Staring at a black screen with harsh white text. We need to get out of this. We need to add a display server and graphical environment.

---

## Display Server & Graphics Drivers

On Linux there a two major display servers available, Xorg and Wayland. In this tutorial I am going to go over installing and setting up with Xorg. It's got more support, and a greater user-base. If you have problems in the future, it'll be easier to solve with Xorg.

To make sure you get all necessary utilities that go along with Xorg. We will install the _xorg_ meta package.

```sh
$ pacman -S xorg
```

Followed by installing the hardware drivers relating to your current system.

<img src={image2.src} alt="GPU Driver Table" />

> If you have an NVIDIA GPU, I would actually suggest using their proprietary drivers 😱

For further explanations for your specific graphics driver.

- [Intel graphics](https://wiki.archlinux.org/index.php/Intel_graphics)
- [AMDGPU](https://wiki.archlinux.org/index.php/AMDGPU)
- [AMDGPU PRO](https://wiki.archlinux.org/index.php/AMDGPU_PRO)
- [NVIDIA](https://wiki.archlinux.org/index.php/NVIDIA)
- [Nouveau](https://wiki.archlinux.org/index.php/Nouveau)

---

## Desktop Environment or Window Manager

Traditionally, operating systems and Linux distributions come bundled with a desktop environment and programs. You might already be used to using one, but here are a few that you can check out. Including what packages and configurations you may need to get it working.

- [GNOME](https://wiki.archlinux.org/index.php/GNOME)
- [KDE](https://wiki.archlinux.org/index.php/KDE)
- [Xfce](https://wiki.archlinux.org/index.php/Xfce)

These desktop environments come with a; file manager, terminal emulator, text editor, icons, browser, etc.

If you want to have a more custom and light-weight graphical user interface. You might want to opt for a window manager like [dwm](https://dwm.suckless.org/), [i3](https://i3wm.org/), or [Openbox](https://wiki.archlinux.org/index.php/Openbox). Then you can decide what extra programs you want to have without the added "bloat" of what comes with desktop environments.

---

## Display Manager

If you chose to use a desktop environment, you will most likely have a display manager. But, if you installed a window manager, you will either have to install one yourself or forgo having one. Without a display manager, you will have to start your Xorg server with the `startx` command. To make this command run automatically when you log in, edit the systems shell initialisation file.

```sh
if [[ "$(tty)" = "/dev/tty1" ]]; then
  exec startx
fi
```

> Remove `exec` and just have `startx` if you want to kill the server but remain logged in.

This if statement will run `startx` if you log in on tty1. But will keep you in the tty if you need to, when using the other five. Which can be helpful if you need to debug a graphical problem. Accessing these other tty's with, Ctrl+Alt+F2 up to F6 on Arch Linux.

---

# User Directories

To create all the standard directories within you user's home directory (Documents, Downloads, etc.). It is useful to install the _xdg-user-dirs_ packager. Which helps keep your /home/ directories organised, by using the [_XDG Base Directory_ specification](https://wiki.archlinux.org/index.php/XDG_Base_Directory).

```sh
$ pacman -S xdg-user-dirs
$ xdg-user-dirs-update
```

The generated _~/.config/user-dirs.dirs_ file can be edited to fit your use case. This is what mine looks like given I don't have a desktop with my window manager.

```sh
XDG_DESKTOP_DIR="$HOME/"
XDG_DOWNLOAD_DIR="$HOME/Downloads"
XDG_DOCUMENTS_DIR="$HOME/Documents"
XDG_MUSIC_DIR="$HOME/Media/Music"
XDG_PICTURES_DIR="$HOME/Media/Pictures"
XDG_VIDEOS_DIR="$HOME/Media/Videos"
XDG_TEMPLATES_DIR="$HOME/Templates"
XDG_PUBLICSHARE_DIR="$HOME/Public"
```

> Notice how I have also consolidated my pictures, videos and music directories within a Media/ directory. To remove even more /home/user/ clutter.

---

# Summary

At the end of this final part in the Arch Linux Installation Guide, we have covered a lot.

- Creating a user account and given it root priveleges.
- Installed a way to manage our internet connection.
- Provided ourselves with a way of downloading programs from almost anywhere.
- **Finally** rebooted our system, and into our new home.
- Added a graphical server and looked at potential desktop environments and window mangers.
- Gone through two methods to automatically login and keep things clean.

If after all five parts of this guide you have questions. I will try my best to answer them in the comments below. The best resource really is the [Arch Wiki](https://wiki.archlinux.org/index.php/). And would be my recommended first stop before installing, configuring or debugging a problem.

Thank you for taking the time to read through this guide, and I hope you have managed to get your Arch Linux installed and operational.

---

- [Part 1](https://www.rshalford.com/blog/arch-linux-installation-guide)
- [Part 2](https://www.rshalford.com/blog/arch-linux-installation-guide)
- [Part 3](https://www.rshalford.com/blog/arch-linux-installation-guide)
- [Part 4](https://www.rshalford.com/blog/arch-linux-installation-guide)
