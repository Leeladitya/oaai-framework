# AAF Formalization — Technical Specification

## Framework Definition

AF = (A, R) where:
- A = {a1, a2, a3, a4, a5, a6, a7, b1, b2, b3, b4, b5, b6, c1, c2, c3}
- R ⊆ A × A (14 attack relations)

## Semantics Implemented

- **Grounded Extension**: Least fixed point of F(S) = {a ∈ A | S defends a}
- **Preferred Extensions**: Maximal admissible sets
- **Complete Extensions**: Admissible + includes all defended arguments
- **Stable Extensions**: Conflict-free + attacks all outsiders
- **Ideal Extension**: Largest admissible set ⊆ every preferred extension

## Value-Based Extension (Bench-Capon 2003)

VAF = (A, R, V, val, P) where:
- V = {creator_rights, legal_integrity, innovation, public_access, ...}
- val: A → V maps arguments to values
- P is audience-specific preference ordering over V

Attack (a,b) succeeds iff val(a) ≥_P val(b)

## ASP Encoding

See `asp/ownership-accountability.lp` for ASPARTIX/clingo-compatible encoding.
Run: `clingo asp/ownership-accountability.lp asp/extensions.lp 0`
