# Anchor — Student Credential Wallet

> Part of the **[Anchor](https://github.com/osaamasaleem)** decentralized academic credential platform.

This repository contains the React Native mobile application for students — a self-sovereign credential wallet that stores W3C Verifiable Credentials, generates QR-based Verifiable Presentations, and supports mnemonic-based wallet recovery.

---

## Overview

Anchor is a decentralized academic credential system built on the **Polygon Amoy Testnet** using **W3C Verifiable Credentials**. Once a university issues a credential, it is anchored on-chain and the student receives it in this mobile wallet.

Students use this app to:
- View their issued academic credentials
- Present credentials to verifiers via a time-limited QR code
- Recover their wallet on a new device using a BIP-39 mnemonic phrase

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (Expo) |
| Language | TypeScript |
| Blockchain | Polygon Amoy Testnet (Ethers.js) |
| Credential Standard | W3C Verifiable Credentials / Verifiable Presentations |
| Wallet Recovery | BIP-39 Mnemonic (12-word phrase) |
| QR Code | Dynamic QR generation with 5-minute expiry timer |

---

## System Architecture

```
┌─────────────────────────────────┐
│        anchor-wallet            │
│      (React Native / Expo)      │
│                                 │
│  - View credentials             │
│  - Generate VP + QR code        │
│  - Mnemonic recovery            │
└────────────┬────────────────────┘
             │ REST API
             ▼
       anchor-backend
       (Node.js / Express / MongoDB)
             │
             └── Polygon Amoy Testnet
                 (AnchorRegistry Smart Contract)
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- Expo CLI: `npm install -g expo-cli`
- [Expo Go](https://expo.dev/go) app on your Android/iOS device

### Installation

```bash
git clone https://github.com/osaamasaleem/anchor-wallet.git
cd anchor-wallet
npm install
```

### Environment Configuration

Update the backend URL and contract address in your constants or `.env`:

```env
API_BASE_URL=http://localhost:5000
CONTRACT_ADDRESS=your_deployed_contract_address
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
```

### Running the App

```bash
npx expo start
```

Scan the QR code with **Expo Go** on your phone, or press `a` for Android emulator / `i` for iOS simulator.

---

## Key Features

### Credential Wallet
- Displays all W3C Verifiable Credentials issued to the student's wallet address
- Fetches credential metadata from the backend
- Shows credential details: degree, institution, date, and blockchain anchor status

### QR-Based Verifiable Presentation
- Student selects a credential to share
- App generates a **W3C Verifiable Presentation (VP)** signed with the student's key
- VP is encoded as a QR code with a **5-minute countdown timer** to prevent replay attacks
- Verifier scans the QR from the `anchor-portals` verifier interface

### Mnemonic Wallet Recovery
- On first launch, a BIP-39 mnemonic phrase is generated and shown to the user
- Student can restore their wallet on a new device using the 12-word phrase
- Recovery fetches credentials associated with the restored wallet address from the backend

---

## Security Notes

- Verifiable Presentations include a **nonce and expiry** to prevent replay attacks
- The 5-minute QR timer enforces short-lived presentations
- No private keys are ever sent to the backend
- Credential authenticity is always verified against the Polygon smart contract

---

## Related Repositories

| Repo | Description |
|---|---|
| [`anchor-portals`](https://github.com/osaamasaleem/anchor-portals) | Web portals for issuers (universities) and verifiers (employers) |
| [`anchor-backend`](https://github.com/osaamasaleem/anchor-backend) | Node.js/Express API — credential management and smart contract interaction |

---

## Project Context

Anchor is a Final Year Project developed at **Foundation University Islamabad (FUSST Campus)** for the BS Information Technology program. It addresses credential fraud and slow verification in academic institutions using blockchain immutability and decentralized identity standards.

---

## License

This project is for academic purposes. All rights reserved.
