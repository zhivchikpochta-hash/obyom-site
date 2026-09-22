#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path
import re
import os

path = Path(os.environ["BUNDLE_PATH"])
text = path.read_text()

replacements = {
    "loadShader('/shaders/webgpu/basic.wgsl')": f"loadShader('shaders/webgpu/{os.environ['SHADER_PATH']}')",
    "viewer.load('/assets/3dmodels/stl/OBYOM_LOGO.stl')": f"viewer.load('assets/3dmodels/stl/{os.environ['MODEL_PATH']}')",
    "loadShader('shaders/webgpu/basic.wgsl')": f"loadShader('shaders/webgpu/{os.environ['SHADER_PATH']}')",
    "viewer.load('assets/3dmodels/stl/OBYOM_LOGO.stl')": f"viewer.load('assets/3dmodels/stl/{os.environ['MODEL_PATH']}')",
    "background-color: #b5b0b0;": "background-color: #181818;",
}

for old, new in replacements.items():
    text = text.replace(old, new)

text = re.sub(
    r"loadShader\(['\"](?:/)?shaders/webgpu/basic(?:-[^'\"]+)?\.wgsl['\"]\)",
    f"loadShader('shaders/webgpu/{os.environ['SHADER_PATH']}')",
    text,
)
text = re.sub(
    r"viewer\.load\(['\"](?:/)?assets/3dmodels/stl/OBYOM_LOGO(?:-[^'\"]+)?\.stl['\"]\)",
    f"viewer.load('assets/3dmodels/stl/{os.environ['MODEL_PATH']}')",
    text,
)

responsive_canvas = r"""canvas {\\n  width: 100%;\\n  height: 100%;\\n  max-width: 100%;\\n  max-height: 100%;\\n  display: block;\\n  z-index: 1;\\n  background-color: #181818;\\n}"""

# The library bundle contains CSS serialized inside an eval string, so the
# literal newline escape sequence is part of the JavaScript source.
canvas_pattern = re.compile(
    r"canvas \{\\+n"
    r"(?:  [^;{}]+;\\+n)*"
    r"  width: 700px;\\+n  height: 700px;\\+n"
    r"  display: block;\\+n  z-index: 1;\\+n"
    r"  background-color: #[0-9a-fA-F]{6};\\+n\}"
)
text, count = canvas_pattern.subn(lambda _match: responsive_canvas, text)
if count == 0 and not re.search(r"canvas \{\\+n(?:  [^;{}]+;\\+n)*  width: 100%;", text):
    raise SystemExit("Could not find a supported canvas rule in bundle.js")

path.write_text(text)
PY
