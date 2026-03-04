#!/bin/bash
# ============================================================
# OAAI Framework — ASP Solver Runner
# Devudaaa Research Lab
#
# Requires: clingo (https://potassco.org/clingo/)
# Install:  conda install -c potassco clingo
#           OR: apt-get install gringo clasp
#
# Usage:
#   ./run-solver.sh                    # Grounded extension (default)
#   ./run-solver.sh preferred          # Preferred extensions
#   ./run-solver.sh stable             # Stable extensions
#   ./run-solver.sh all                # All semantics
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRAMEWORK="$SCRIPT_DIR/ownership-accountability.lp"
RULES="$SCRIPT_DIR/extensions.lp"

# Check clingo availability
if ! command -v clingo &> /dev/null; then
  echo "Error: clingo not found."
  echo "Install: conda install -c potassco clingo"
  echo "     OR: apt-get install gringo clasp"
  exit 1
fi

MODE=${1:-grounded}

run_semantics() {
  local sem=$1
  echo "============================================"
  echo " Computing $sem extension(s)"
  echo "============================================"
  clingo "$FRAMEWORK" "$RULES" 0 -c "mode=$sem" --quiet=1 2>/dev/null
  echo ""
}

if [ "$MODE" = "all" ]; then
  run_semantics "grounded"
  run_semantics "preferred"
  run_semantics "stable"
else
  run_semantics "$MODE"
fi
