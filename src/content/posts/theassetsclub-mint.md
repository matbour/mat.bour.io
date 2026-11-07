---
title: 'TheAssetsClub: Mint'
description: How the TheAssetsClub NFT mint worked, from the sale phases to a verifiable reveal with Chainlink VRF.
date: 2023-04-19
updated: 2026-11-07
category: side-projects
tags: [ethereum, erc721, nft, chainlink]
---

_This post first appeared on [Medium](https://mathieubour.medium.com/theassetsclub-mint-e4bddeff4235) on April 19th, 2023, a week before the mint. I've moved it here unchanged apart from a few typos. There's an update from 2026 at the bottom._

Exciting news for NFT enthusiasts! TheAssetsClub is set to launch its highly-anticipated NFT mint on April 27th. This post provides a step-by-step breakdown of the minting process. Don't miss out on this opportunity to learn about the future of digital art and ownership.

## TL;DR

- Where: theassets.club/mint
- 0.02 ETH per Asset
- 2 free assets for access list wallets + up to 3 paid optional
- 3 free assets for OG wallets + up to 2 paid optional
- Smart contracts code: [github.com/assets-club/smart-contracts](https://github.com/assets-club/smart-contracts)

_Note: at this time, access list to the private sale has been closed and is final._

## About me

Hello Asses! My name is Mathieu and I am the blockchain engineer behind TheAssetsClub smart contracts and website!

I have more than 8 years of experience writing software and I already worked on several blockchain projects, including [Pooky](https://pooky.gg), a play-to-earn game based on football matches result prediction and [DeepSquare](https://deepsquare.io), which aims to disrupt High Performance Computing using the blockchain as decentralised job scheduler.

As a passionate blockchain user and decentralisation lover, I tried to make the blockchain integration of TheAssetsClub as decentralised as possible. This article aims to describe the exact mint process.

## Mint phases and dates

TheAssetsClub maximum token supply will be 5777; the exact supply can be less if the mint sale does not sell out. The team CANNOT change this number, as it is **hardcoded** as a constant directly in the contract.

The mint will be split into two distinct phases:

1. Private sale: on April 27th at 9:00am GMT, the mint will be open to the OGs and access list wallets.
2. Public sale: on April 28th at 9:00am GMT, the mint will be open to anyone, if the mint has NOT sold out.

The mint window will be **closed on April 30th at 9:00am GMT**, meaning that if the mint has not sold out, the circulating supply will be less than 5777.

These dates will be verifiable directly in the smart contract.

## Reveal

Reveal will happen within a few hours after the mint ends. Once we decide to reveal the collection, a few steps will happen sequentially:

1. TheAssetsClub team will call the reveal function of the TheAssetsClub smart contract.
2. Chainlink VRF will send a random number that we will use as a seed for a [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle). To save gas, we will run the algorithm offline but it will be easy for anyone to verify the shuffle using the provided seed.
3. We will upload the JSON metadata accordingly to ensure that the token IDs are correctly swapped.

## Follow TheAssetsClub!

- Twitter: [@NonFungibleAss](https://twitter.com/NonFungibleAss)
- GitHub: [github.com/assets-club](https://github.com/assets-club)

## Update, November 2026

Adrien Pisler, the designer behind TheAssetsClub, passed away in March 2025. Every Asset in the collection came from his work: [the generator](https://github.com/assets-club/nft-generator-cpp) only combined the layers, colors and textures he made. My smart contracts were just the plumbing that put his art on-chain. You can still see his work on X at [@apisler](https://x.com/apisler).

The news came from his best friend, who wanted one thing above all: that Adrien's work stays available for good, for anyone to enjoy, with no business plan or goal behind it.

The mint closed on April 30th, 2023 as planned, with 557 Assets minted out of the 5777 the contract allowed. We never sold out, and because the cap was hardcoded, the contract simply stopped there, exactly as the post above promised. The collection is still on Ethereum at [`0xe6eb4cFd8600832edd617F6D86ab9D63A4fb7bDA`](https://etherscan.io/address/0xe6eb4cFd8600832edd617F6D86ab9D63A4fb7bDA) and on [OpenSea](https://opensea.io/collection/assetsv1). The website is offline now, but the [front-end](https://github.com/assets-club/theassets.club) and the [smart contracts](https://github.com/assets-club/smart-contracts) are still on GitHub.

Thank you, Adrien.
