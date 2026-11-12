---
title: 'Shipping the offline editor'
eyebrow: 'Engineering'
description: 'Conflict resolution for a document that three people edited on a train.'
publishedAt: 2026-10-24
category: 'engineering'
author: 'Devin Park'
coverAlt: ''
---

Offline editing is easy to demo and hard to ship. The demo shows a document being edited on a plane. The shipping version has to answer what happens when three people edit the same paragraph offline, in different directions, and then reconnect within the same second.

## The model

We use a per-block sequence CRDT rather than a character-level one. Blocks are the unit users think in, and conflicts at block granularity are both rarer and easier to present honestly.

Each block carries a version vector. On reconnect, the client sends only the blocks whose vectors diverge, and the server resolves them in a deterministic order that both sides can reproduce.

## What users see

Deterministic resolution is not the same as a sensible result. When two people rewrite the same paragraph offline, the merge is technically correct and editorially wrong.

So we surface it. Conflicting blocks are marked inline, both versions are preserved, and the reader chooses. We considered automatic last-writer-wins and rejected it: silently discarding someone's paragraph is worse than asking them to spend four seconds choosing.

## The hard part was storage

The CRDT itself took three weeks. Making it survive a laptop lid closing mid-write took three months. Every local write goes through a journal that is fsynced before the UI acknowledges it, and recovery replays the journal on startup.

> If the acknowledgment reaches the screen before the bytes reach the disk, you have built a data loss bug with a progress indicator.

## Status

Offline editing is in early access for workspaces with fewer than fifty members. We expect general availability in the first quarter.
