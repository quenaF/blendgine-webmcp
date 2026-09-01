# Evidence & provenance

Blendgine intentionally keeps three kinds of knowledge separate.

## 1. External scientific reference

Scientific flavor/compound sources can supply signals that make a pairing worth testing. The challenge demo references FlavorDB2 and records the source and license boundary with the evidence. External records are not presented as Blendgine-owned data.

The demo does not claim that compound overlap determines whether two ingredients taste good together.

## 2. Blendgine hypothesis

A pairing hypothesis is reasoning produced from available signals. It is explicitly labeled `hypothesis` or `hypothesis_input`. A hypothesis requires human tasting before it can acquire sensory evidence.

## 3. Human sensory observation

A human can report what they actually experience. Blendgine records the exact formulation/preparation context, a structured descriptor, intensity/phase when provided, the human's own words, and provenance `human_sensory_observation`.

One observation is not a universal flavor fact. The system can use it to propose a next experiment while retaining its individual-observation status.

## Why WebMCP matters

The browser exposes this distinction as tools rather than forcing an agent to infer state from UI text. An agent can inspect the formulation and evidence, ask the human for the information only the human can provide, write that observation through a constrained schema, show the human what was recorded, and propose the next experiment with traceable evidence.

This is the collaboration boundary: the agent reasons; the human tastes.
