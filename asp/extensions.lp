% ============================================================
% Extension Computation Rules
% Compatible with clingo
%
% Usage:
%   Grounded:  clingo ownership-accountability.lp extensions.lp 0 -c mode=grounded
%   Preferred: clingo ownership-accountability.lp extensions.lp 0 -c mode=preferred
%   Stable:    clingo ownership-accountability.lp extensions.lp 0 -c mode=stable
% ============================================================

% --- Grounded Extension (default) ---
#const mode = grounded.

% Characteristic function F(S) — iterative least fixed point
defeated(X) :- in(Y), att(Y,X), arg(X), arg(Y).
not_defended(X) :- att(Y,X), not defeated(Y), arg(X), arg(Y).

% Grounded: accept if not attacked or all attackers defeated
in(X) :- arg(X), not not_defended(X), not defeated(X), mode == grounded.

% --- Preferred Extension ---
% Guess-and-check with maximization
{ in(X) : arg(X) } :- mode == preferred.
:- in(X), in(Y), att(X,Y), mode == preferred.
attacked_by(X,Y) :- in(X), att(Y,X), arg(Y), mode == preferred.
def(X) :- attacked_by(X,Y), in(Z), att(Z,Y), mode == preferred.
:- in(X), attacked_by(X,_), not def(X), mode == preferred.
#maximize { 1,X : in(X) } :- mode == preferred.

% --- Stable Extension ---
{ in(X) : arg(X) } :- mode == stable.
:- in(X), in(Y), att(X,Y), mode == stable.
out_defeated(X) :- in(Y), att(Y,X), mode == stable.
:- arg(X), not in(X), not out_defeated(X), mode == stable.

#show in/1.
