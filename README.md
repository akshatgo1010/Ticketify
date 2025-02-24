# Ticketify 🎟️

A blockchain-powered app that issues non-transferrable NFT tickets for events (concerts, shows, etc.), purchased exclusively with cryptocurrency. Designed to eliminate black-market resales, each ticket’s ownership is permanently tied to the buyer’s wallet, with event details stored in tamper-proof metadata.

## Features

### For All Users
- MetaMask wallet authentication
- Browse available events with visual cards
- Purchase tickets using ETH
- Non-transferable NFT tickets enforced by smart contract

### For Event Organizers (Owner)
- Create new events with custom details
- Real-time stats dashboard:
  - Total events created
  - Tickets sold per event
- Immediate ETH withdrawal to owner wallet on ticket purchase (future plans)

### Technical Highlights
- Secure smart contract with:
  - Reentrancy protection
  - Owner-only functions
  - Proper access controls
- Responsive UI with custom theming
- Real-time data updates

## Tech Stack 

### Blockchain
- Solidity (Smart Contracts)
- Ethereum (Sepolia Testnet)
- OpenZeppelin (ERC721 Implementation)

### Frontend
- React.js (Framework)
- Ethers.js (Blockchain Interaction)
- Tailwind CSS (Styling)
- React Icons (UI Elements)

### Storage
- IPFS (Metadata Storage via Pinata)
- Local JSON (Default Event Images)

## Getting Started 🚀

### Prerequisites
- Node.js (v18+)
- MetaMask Wallet
- Sepolia ETH (for testing)
