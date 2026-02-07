---
name: main
description: Describe when to use this prompt
---
# Master Build Prompt: RTA Dashboard Phase 1

## Vision
Create a high-fidelity "Command Center" for RTA Dubai employees to optimize bus stop placement in Business Bay and Reem Island.

## Contextual Assets
- @UAE Transit App: Lingo.dev Integration (Project Plan)
- @stops table schema (PostGIS)
- @LanguageSwitcher.tsx

## Instructions
1. **Initialize Map Container**: Create a `CommandCenterMap.tsx` using Mapbox. Center it on Dubai [55.2708, 25.2048].
2. **Geospatial Integration**: 
   - Fetch bus stops from Supabase. 
   - Render 'AC Shelters' as Green markers and 'Poles' as Blue markers.
   - Overlay a Heatmap layer using the `commuter_pings` table data.
3. **AI Sidebar**: 
   - Build a glass-morphism left sidebar (`@/components/ChatAgent.tsx`).
   - Use a simple state-based chat UI (Mock the agent response for now to save time).
4. **Localization**: Wrap all UI text (titles, buttons, labels) in tags compatible with the Lingo.dev compiler.

## Implementation Details
- Style: Dark Mode (Slate-950 background, Teal-500 accents).
- Layout: 25% Sidebar / 75% Map.
- Animation: Use Framer Motion for the "Stats Overlay" entrance.

**IMPORTANT**: Do not change any existing Supabase client configurations. Only implement the UI and Map logic. Do not simplify the SQL logic for hotspots—use the `ST_DWithin` function as specified in the blueprint.