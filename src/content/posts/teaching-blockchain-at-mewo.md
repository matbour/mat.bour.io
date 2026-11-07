---
title: Teaching blockchain to engineering students
description: What I taught at Mewo between 2023 and 2025, how the course was built, and why the final exam was me trying to hack the students' contracts.
date: 2026-11-07
category: work
tags: [teaching, blockchain, solidity, foundry, security]
draft: true
---

Between 2023 and 2025 I taught at [Mewo](https://www.mewo.fr), a computer science school in Metz, alongside my main job. Most of it was a blockchain module: 32 hours over four full days, for a class of about fifteen students. I ran it three times, in May 2023, December 2023 and March 2025. In 2024 I also taught a DevOps module (16 hours) and a Google Cloud course (24 hours). That adds up to 136 hours in front of students.

## The course

I wrote the slides in LaTeX with Beamer, in French, and kept them in a Git repository like any other project. By the last session the deck was 147 slides in four parts:

1. **Cryptography.** Checksums first (ISBN, UPC barcodes), then hash functions, symmetric and asymmetric encryption, and digital signatures. It ends with a quick look at zero-knowledge proofs and post-quantum cryptography.
2. **Blockchain.** What the word actually means, then Bitcoin from the ground up: running a node, creating an account, sending a transaction, proof-of-work, mining, halvings and fees.
3. **Ethereum and smart contracts.** Creating a wallet, the Solidity language, gas, the ERC-20 and ERC-721 token standards, and writing and testing contracts with [Foundry](https://getfoundry.sh).
4. **Projects.** The final evaluation (more on that below).

Starting with checksums and hash functions takes time, but it pays off. Once students understand why changing one bit of the input changes the whole hash, a block header stops being magic. The same goes for signatures: once you've seen one, a wallet is just a private key with a nice interface.

The deck opens with a disclaimer slide. The first point is "DYOR", do your own research: on a blockchain, mistakes are permanent, and I could be wrong too. The second is that most people who put money into crypto lose it. I'm openly pro-decentralization, so the slide also warns that some of the content may lean political.

## Learning by testing

Slides only go so far, so every session had code. I wrote three sets of exercises over the years:

- [mewo-contracts-exercises](https://github.com/matbour/mewo-contracts-exercises), the first set from 2023: fifteen independent exercises, from a hello world to an ERC-20 bridge. Each one ships with a Foundry test, and an exercise is done when `forge test` passes.
- [mewo-exercises](https://github.com/matbour/mewo-exercises), a second set: from simple storage to a small DAO, staking and a token swap, with 45 tests.
- [mewo-motd](https://github.com/matbour/mewo-motd), a "message of the day" template that wires a Solidity contract to a React front end with wagmi, so students see a full dApp end to end.

Tests as the definition of done worked well. Students didn't have to wait for me to tell them whether their code was right, and they picked up a habit most tutorials skip: you don't deploy a contract you haven't tested.

## The final project: I'm the attacker

For the evaluation, each student picked one project from a list of seven:

- a casino that draws its winner with [Chainlink VRF](https://docs.chain.link/vrf), since there is no randomness on Ethereum;
- an ERC-20 faucet with a React front end;
- an NFT marketplace;
- an ERC-20 voting system, where you have to make sure the same tokens can't vote twice;
- a staking platform;
- a price prediction game using Chainlink price feeds;
- an NFT collection with traits generated at mint and served by a small back end.

The rules fit on one slide. Every project has Solidity, every contract has tests, and the code goes on GitHub. The last rule was the one students remembered: "Security first: I'll be the hacker trying to exploit your protocol."

That rule changed how they wrote code. A contract that works is not enough when someone will actively look for the transfer that drains it, the vote that counts twice, or the function anyone can call. It's the same mindset I apply at work, and teaching it to people who had never written a smart contract was the most fun part of the job.

## DevOps and Google Cloud

The 2024 modules were less about blockchain and more about shipping. For DevOps, I gave students a [starter repository](https://github.com/matbour/mewo-devops-2024) to fork. Their first goal was to deploy a Next.js app to Google Cloud Run through GitHub Actions, and then to containerize more services: Flask, Postgres, Redis, MariaDB, Nginx, even a Minecraft server.

## The slides

The full deck is on GitHub, in French: [mewo-blockchain-course](https://github.com/matbour/mewo-blockchain-course), with the compiled PDF at the root.
