#!/usr/bin/env bash
set -euo pipefail

library_dist="${1:-obyom-library/dist}"

if [[ ! -d "$library_dist" ]]; then
  echo "Library dist directory does not exist: $library_dist" >&2
  exit 1
fi

copy_required() {
  local source="$1"
  local destination="$2"

  if [[ ! -s "$source" ]]; then
    echo "Required runtime file is missing or empty: $source" >&2
    exit 1
  fi

  mkdir -p "$(dirname "$destination")"
  cp "$source" "$destination"
}

copy_required \
  "$library_dist/bundle.js" \
  "bundle.js"

copy_required \
  "$library_dist/shaders/webgpu/basic.wgsl" \
  "shaders/webgpu/basic.wgsl"

copy_required \
  "$library_dist/assets/3dmodels/stl/OBYOM_LOGO.stl" \
  "assets/3dmodels/stl/OBYOM_LOGO.stl"
