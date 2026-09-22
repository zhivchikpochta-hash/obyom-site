#!/usr/bin/env bash
set -euo pipefail

library_dist="${1:-obyom-library/dist}"
runtime_version="${2:?Runtime version is required}"

bundle_name="bundle-${runtime_version}.js"
shader_name="basic-${runtime_version}.wgsl"
model_name="OBYOM_LOGO-${runtime_version}.stl"

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
  "$bundle_name"

copy_required \
  "$library_dist/shaders/webgpu/basic.wgsl" \
  "shaders/webgpu/$shader_name"

copy_required \
  "$library_dist/assets/3dmodels/stl/OBYOM_LOGO.stl" \
  "assets/3dmodels/stl/$model_name"

# Remove previous generated runtime versions. Site-owned files are not matched.
find . -maxdepth 1 -type f -name 'bundle-*.js' ! -name "$bundle_name" -delete
rm -f bundle.js
find shaders/webgpu -maxdepth 1 -type f -name 'basic-*.wgsl' ! -name "$shader_name" -delete
rm -f shaders/webgpu/basic.wgsl
find assets/3dmodels/stl -maxdepth 1 -type f -name 'OBYOM_LOGO-*.stl' ! -name "$model_name" -delete
rm -f assets/3dmodels/stl/OBYOM_LOGO.stl
