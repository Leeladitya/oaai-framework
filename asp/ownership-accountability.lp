% ============================================================
% OAAI Framework — ASP Encoding
% Devudaaa Research Lab
% 
% Compatible with: ASPARTIX-V19, clingo (Potassco)
% 
% Usage with clingo:
%   clingo ownership-accountability.lp extensions.lp 0
%   (0 = enumerate all models)
%
% Arguments: 16 (7 ownership, 6 accountability, 3 bridge)
% Attacks: 14
% ============================================================

% --- Ownership Arguments ---
arg(a1). % Prompt = Authorship (Li v. Liu 2023; Locke)
arg(a2). % AI = Autonomous Creator (Thaler 2025; Feist)
arg(a3). % Prompts = Ideas (USCO Zarya; idea/expression)
arg(a4). % Selection = Expression (Zarya arrangement; compilations)
arg(a5). % No Incentive Needed (Thaler; Art. I §8)
arg(a6). % Investment Incentive (utilitarian counter)
arg(a7). % Public Domain (Algorithmic Muse 2025)

% --- Accountability Arguments ---
arg(b1). % User Accountability (respondeat superior; Lior 2020)
arg(b2). % Developer Accountability (product liability; EU PLD)
arg(b3). % Proportional Distribution (EU AI Act framework)
arg(b4). % Traceability Required (C2PA; evidentiary)
arg(b5). % Foreseeability Limit (reasonable foreseeability test)
arg(b6). % Non-Waivable Liability (EU PLD; strict liability)

% --- Bridge Arguments ---
arg(c1). % Consistent Attribution (qui sentit commodum; Hohfeld)
arg(c2). % Unified Threshold (meaningful human control; Santoni de Sio)
arg(c3). % Separability (property rights absolutism)

% --- Attack Relations ---
att(a2,a1). % AI autonomous → prompt ≠ authorship
att(a3,a1). % prompts are ideas → prompts ≠ authorship
att(a4,a2). % selection is creative → human contribution exists
att(a5,a1). % no incentive needed → no constitutional purpose for prompt copyright
att(a5,a6). % no incentive needed → investment argument undermined
att(a6,a5). % investment incentive → some protection warranted
att(a6,a7). % investment matters → public domain too absolute
att(a7,a1). % public domain → opposes exclusive ownership
att(a7,a6). % public domain optimal → investment argument outweighed
att(b1,b2). % user accountable → developer accountability reduced
att(b2,b1). % developer created system → user accountability incomplete
att(b5,b1). % unforeseeable behavior → user accountability limited
att(c1,c3). % ownership = accountability → separability fails
att(c3,c1). % separable → consistent attribution unnecessary

% --- Value assignments (for VAF analysis) ---
val(a1, creator_rights).
val(a2, legal_integrity).
val(a3, legal_integrity).
val(a4, creator_rights).
val(a5, legal_integrity).
val(a6, innovation).
val(a7, public_access).
val(b1, personal_responsibility).
val(b2, public_safety).
val(b3, fairness).
val(b4, rule_of_law).
val(b5, fairness).
val(b6, public_safety).
val(c1, coherence).
val(c2, coherence).
val(c3, property_rights).
