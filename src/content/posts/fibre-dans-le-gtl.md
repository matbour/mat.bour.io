---
title: La fibre dans le GTL, sans box
description: Comment j'ai remplacé une box opérateur encombrante par un ONT, une passerelle UniFi et un point d'accès Wi-Fi, le tout rangé dans la gaine technique de l'appartement.
date: 2026-11-07
category: side-projects
tags: [self-hosting, networking, unifi, fibre, cloudflare]
lang: fr
---

Pendant des années, j'étais chez Free avec une Freebox Delta, sans la TV, pour environ 50 € par mois. Ça marchait, mais c'était cher pour ce que j'en faisais, et le serveur Delta est un gros boîtier qui ne rentre dans aucun placard technique. Aujourd'hui, la fibre arrive dans le GTL, un petit ONT la convertit en Ethernet juste à côté, et mon routeur est branché directement dessus. Plus de box nulle part, et la porte de la gaine ferme.

Cet article décrit le matériel, la forme du réseau, et ce que ça permet : héberger des applications chez moi sans ouvrir un seul port.

## Le GTL

Le GTL, c'est la gaine technique logement. Dans un logement neuf ou rénové, la norme NF C 15-100 impose un emplacement qui regroupe le tableau électrique et le coffret de communication. Chez moi, c'est une colonne Schneider Electric Resi9 : le tableau électrique en haut, le coffret de communication en dessous.

Le coffret contient déjà ce qu'il faut pour un réseau propre :

- la **PTO** (prise terminale optique), où arrive la fibre de l'immeuble ;
- un **tableau de brassage** de 8 ports RJ45 et une sortie TV/SAT, d'où partent les câbles vers les prises murales des pièces ;
- deux **prises 230 V** intégrées, pour alimenter les équipements sans rallonge qui sort de la gaine ;
- une grille perforée sur laquelle on fixe les boîtiers avec des clips Schneider « Fix Box ».

Le problème, c'est qu'une box opérateur n'est pas faite pour y entrer. Elle fait tout à la fois : convertisseur fibre, routeur, Wi-Fi, parfois téléphone et TV. Elle est trop grosse pour le coffret, et même si elle rentrait, un point d'accès Wi-Fi enfermé dans une gaine technique au fond d'un couloir arrose surtout le mur.

L'idée est donc de séparer les rôles : ce qui touche à la fibre et au routage va dans le GTL, et le Wi-Fi va là où sont les gens.

## Le matériel

![Le coffret de communication ouvert : en haut le tableau de brassage RJ45, la PTO et l'ONT Nokia ; au milieu les prises 230 V et la passerelle UniFi tenue par des clips verts ; en bas l'Orange Pi dans son boîtier noir ventilé](../../assets/posts/fibre-gtl/gtl-ouvert.jpg)

De haut en bas sur la photo :

| Équipement                            | Rôle                                                                 |
| ------------------------------------- | -------------------------------------------------------------------- |
| PTO                                   | arrivée de la fibre dans le logement                                 |
| ONT Nokia (fourni par Bouygues)       | convertit la fibre XGS-PON en Ethernet 10 Gb/s                       |
| UniFi Cloud Gateway Fiber (UCG Fiber) | routeur, pare-feu, DHCP et contrôleur UniFi                          |
| Orange Pi 5 Plus                      | serveur maison : Docker, Coolify, ce blog                            |
| UniFi Switch Ultra (USW Ultra)        | petit switch dans une autre pièce, alimenté en PoE par la passerelle |
| UniFi U7 Long-Range                   | point d'accès Wi-Fi 7, alimenté en PoE par le switch                 |

La pièce centrale est la UCG Fiber. Elle a un port WAN RJ45 à 10 GbE, deux cages SFP+ à 10 Gb/s et quatre ports 2,5 GbE, dont un en PoE+. Elle tient à plat dans le coffret, avec deux clips. C'est aussi elle qui fait tourner l'application UniFi Network, donc pas besoin d'un contrôleur à part.

L'ONT, c'est Bouygues qui me l'a envoyé. Avec l'offre B&You Pure Fibre Plus, on peut demander un ONT seul à la place de la Bbox. C'est un petit boîtier Nokia avec quatre LED (alimentation, PON, alarme, données), une entrée fibre et une sortie Ethernet. Il se pose à côté de la PTO, relié par une courte jarretière optique.

![Le même coffret avec le plastron du haut remis : de la PTO et de l'ONT, on ne voit plus que les LED, et la passerelle reste accessible en dessous](../../assets/posts/fibre-gtl/gtl-plastron.jpg)

Une fois le plastron remis, il ne reste que les LED de l'ONT qui dépassent.

## La forme du réseau

Tout part de la passerelle. Le réseau est volontairement simple : un seul LAN en `192.168.1.0/24`, la passerelle en `.254`.

```text
            Bouygues Telecom, XGS-PON
            8 Gb/s descendant, 1 Gb/s montant
                       |
                       |  fibre
                       v
+-- GTL, coffret de communication Resi9 ---------------+
|                                                      |
|   PTO --jarretière--> ONT Nokia                      |
|                          |                           |
|                          |  10 GbE, VLAN 100         |
|                          v                           |
|   UniFi Cloud Gateway Fiber           192.168.1.254  |
|     port 3, 2,5 GbE -> Orange Pi 5 Plus  .10         |
|     ports 1 et 2    -> prises murales -> PC          |
|     port 4, PoE+    -> prise murale ---------+       |
|                                              |       |
+----------------------------------------------+-------+
                                               |
                       câble dans le mur, PoE  |
                                               v
                               UniFi Switch Ultra  .102
                                 port 1, PoE
                                               |
                                               v
                               U7 Long-Range       .159
                               Wi-Fi 2,4 et 5 GHz
```

Le switch et le point d'accès n'ont pas de bloc d'alimentation : la passerelle alimente le switch en PoE+, et le switch alimente le U7 Long-Range à son tour. Au total, la passerelle fournit environ 8 W sur les 30 W de son budget PoE.

Le U7 Long-Range diffuse deux réseaux Wi-Fi :

- le réseau principal, en 2,4 et 5 GHz, en WPA2/WPA3 ;
- un réseau IoT, en 2,4 GHz seulement et en WPA2, pour les objets connectés qui ne savent pas faire mieux : robot aspirateur, imprimante, chauffe-eau.

En 5 GHz, il émet sur un canal de 160 MHz. C'est large pour un immeuble, mais l'interface UniFi note l'expérience Wi-Fi comme excellente. Au moment où j'écris, une quinzaine d'appareils y sont connectés.

Pour l'instant, les deux réseaux Wi-Fi arrivent dans le même LAN. Mettre l'IoT dans un VLAN séparé, avec des règles de pare-feu entre les deux, est la prochaine étape.

## La configuration Bouygues

Sans Bbox, c'est la passerelle qui reçoit directement l'adresse IPv4 publique. Il faut qu'elle se présente au réseau Bouygues comme une Bbox. Tout se règle dans l'interface UniFi, sans SSH. J'ai suivi le récapitulatif de [lafibre.info](https://lafibre.info), où les abonnés qui remplacent leur box partagent ce qui marche.

| Paramètre   | Valeur                                            |
| ----------- | ------------------------------------------------- |
| VLAN        | 100                                               |
| Adresse MAC | celle de la Bbox, clonée                          |
| IPv4        | DHCP, vendor class (option 60) `BYGTELIAD`, CoS 6 |
| IPv6        | DHCPv6, CoS 6, délégation de préfixe en `/60`     |

Je n'y suis pas arrivé du premier coup. Pendant quelques jours, la Bbox est restée dans le circuit, avec la passerelle UniFi dans sa DMZ. Ça marchait, mais avec deux routeurs qui font du NAT l'un derrière l'autre, et deux réseaux qui démarrent tous les deux en `192.168.1.x`. Avec l'ONT, il n'y a plus qu'un seul routeur. La Bbox est dans un tiroir, au cas où.

## Héberger chez soi sans ouvrir de port

C'est ce qui m'intéressait vraiment. L'Orange Pi est branché en 2,5 GbE sur la passerelle, juste en dessous d'elle dans le coffret. Il fait tourner [Coolify](https://coolify.io) et plusieurs applications, dont ce blog.

Pour les rendre accessibles depuis Internet, je n'ouvre aucun port sur le routeur. L'Orange Pi lance `cloudflared`, qui ouvre une connexion **sortante** vers Cloudflare. Les visiteurs arrivent chez Cloudflare, et leurs requêtes redescendent par ce tunnel.

```text
visiteur
   |  https://mat.bour.io
   v
Cloudflare (DNS *.bour.io, TLS, protection DDoS)
   ^
   |  tunnel ouvert depuis la maison, aucun port entrant
   |
UCG Fiber (pare-feu fermé en entrée)
   |
Orange Pi 5 Plus : cloudflared -> proxy Coolify -> applications
```

Ça a plusieurs avantages :

- le pare-feu de la passerelle reste fermé en entrée ;
- mon adresse IP publique n'apparaît nulle part dans le DNS ;
- si l'adresse change, rien à faire, le tunnel se reconnecte tout seul ;
- un enregistrement DNS `*.bour.io` pointe vers le tunnel, donc une nouvelle application n'a besoin que d'un nom de domaine dans Coolify.

Le détail du pipeline, de la construction de l'image jusqu'au déploiement, est dans [How this blog is built](/posts/how-this-blog-is-built/) (en anglais).

## Le bilan

- **Moins cher.** Je payais environ 50 € par mois chez Free. L'offre fibre seule de B&You, sans TV ni téléphone, me coûte moins cher.
- **Le même débit, en mieux exploité.** 8 Gb/s en descendant et 1 Gb/s en montant, avec un port WAN à 10 GbE et un serveur en 2,5 GbE pour en profiter.
- **Rangé.** La fibre, l'ONT, le routeur et le serveur tiennent dans le coffret de communication. La porte ferme, et on ne voit plus de câble.
- **Une seule interface.** La passerelle, le switch et le Wi-Fi se gèrent depuis la même application UniFi, chez moi ou à distance.
