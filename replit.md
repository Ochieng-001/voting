# DecentralVote - Blockchain Voting System

## Overview

DecentralVote is a decentralized voting system built on blockchain technology that enables transparent, secure, and tamper-proof elections. The application combines a React frontend with a Node.js/Express backend, integrating with Ethereum smart contracts through MetaMask wallet connections. The system allows for voter registration, candidate management, secure voting, and real-time election results tracking with full audit capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Web3 Integration**: Ethers.js for blockchain interactions and MetaMask wallet connectivity

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: TSX for TypeScript execution in development
- **Build**: ESBuild for production bundling with external package handling
- **Storage Interface**: Abstracted storage layer with in-memory implementation (expandable to databases)

### Smart Contract Integration
- **Contract Type**: Solidity-based VoterRegistry contract on Ethereum
- **Features**: Voter registration, candidate management, vote casting, and audit logging
- **Wallet Connection**: MetaMask integration for user authentication and transaction signing
- **Contract Interaction**: Custom wrapper class for type-safe contract method calls

### Data Management
- **Schema Validation**: Zod schemas for runtime type checking across frontend and backend
- **Shared Types**: Common TypeScript interfaces between client and server
- **Query Caching**: React Query for optimistic updates and background synchronization
- **Form Validation**: Client-side validation with server-side backup

### User Interface Design
- **Design System**: Custom design tokens with semantic color variables
- **Responsive Layout**: Mobile-first design with adaptive components
- **Role-Based Views**: Separate interfaces for voters and administrators
- **Real-time Updates**: Live election statistics and results display
- **Accessibility**: WCAG-compliant components with keyboard navigation support

### Security Architecture
- **Blockchain Security**: Immutable vote records stored on Ethereum blockchain
- **Wallet Authentication**: MetaMask signature-based user verification
- **Input Validation**: Comprehensive validation on both client and server sides
- **Error Handling**: Graceful error boundaries with user-friendly messaging

## External Dependencies

### Blockchain Infrastructure
- **Ethereum Network**: Public blockchain for vote storage and verification
- **MetaMask**: Browser extension wallet for user authentication and transaction signing
- **Neon Database**: PostgreSQL-compatible serverless database (configured but not actively used in current implementation)

### Development Tools
- **Replit Integration**: Development environment integration with runtime error overlay and cartographer for debugging
- **Vite Plugins**: Hot module replacement and development tooling
- **PostCSS**: CSS processing with Tailwind and autoprefixer

### UI and Styling
- **Radix UI**: Headless component primitives for accessibility and functionality
- **Lucide React**: Icon library for consistent visual elements
- **Google Fonts**: Inter font family for typography
- **Class Variance Authority**: Utility for managing component variants

### Utility Libraries
- **Date-fns**: Date manipulation and formatting
- **Clsx/Tailwind Merge**: Conditional CSS class management
- **Nanoid**: Unique identifier generation