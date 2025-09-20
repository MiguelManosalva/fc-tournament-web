# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

FIFA Tournament Manager is a React TypeScript application for organizing and managing FIFA tournaments. It supports multiple tournament formats (league/round-robin and knockout/elimination) with complete match tracking and results management.

## Development Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # Build for production (TypeScript + Vite)
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

The application follows a strict layered architecture pattern:

```
Components (Atomic Design Pattern)
    ↓ (only consume stores)
Zustand Stores (Global State)
    ↓ (only connection to services)
LocalStorage Service (Data Layer)
    ↓
Browser LocalStorage (Persistence)
```

### Key Architectural Rules

- **Components are strictly layered**: Atoms → Molecules → Organisms
- **Atomic components** can only use props, never stores directly
- **Only stores** can consume the service layer
- **All business logic** lives in Zustand stores
- **Single service layer** handles all localStorage operations

### Core Types

The application is built around these main entities:
- `Player`: Individual tournament participants
- `Tournament`: Tournament container with format, players, and matches
- `Match`: Individual game with scores and results
- `TournamentFormat`: 'league' | 'knockout' | 'hybrid'

### State Management

Uses Zustand with two main stores:
- `playerStore.ts`: Player management (CRUD operations)
- `tournamentStore.ts`: Tournament and match management

### Component Structure

- **atoms/**: Basic reusable components (PlayerCard, MatchCard, TournamentCard, FormatSelector)
- **molecules/**: Combined components (PlayerManager, LeagueTable, KnockoutBracket)
- **organisms/**: Page-level components (TournamentCreator, TournamentView)

### Data Persistence

All data is stored in browser localStorage via `LocalStorageService`:
- Singleton pattern with automatic date conversion
- Structured storage with tournaments and players separation
- Export/import functionality for data backup

## Technologies

- **React 19** with TypeScript
- **Vite** for development and building
- **Zustand** for state management
- **HeroUI** for UI components
- **TailwindCSS** for styling
- **ESLint** with TypeScript rules

## Tournament Formats

- **League (Round-Robin)**: All players play each other once
- **Knockout (Elimination)**: Single-elimination bracket tournament
- **Hybrid**: Planned feature combining group stage + knockout

## Key Features

- Player management with unique name validation
- Tournament creation with format selection
- Real-time match result tracking
- Automatic standings calculation
- Tournament history persistence
- Data export/import capabilities