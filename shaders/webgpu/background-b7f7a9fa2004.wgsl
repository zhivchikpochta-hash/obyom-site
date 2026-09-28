struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@group(0) @binding(0) var backgroundTexture: texture_2d<f32>;
@group(0) @binding(1) var backgroundSampler: sampler;
@group(0) @binding(2) var<uniform> backgroundUniforms: vec4<f32>;

@vertex
fn vertex_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var positions = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>(1.0, -1.0),
    vec2<f32>(-1.0, 1.0),
    vec2<f32>(-1.0, 1.0),
    vec2<f32>(1.0, -1.0),
    vec2<f32>(1.0, 1.0),
  );
  var uvs = array<vec2<f32>, 6>(
    vec2<f32>(0.0, 1.0),
    vec2<f32>(1.0, 1.0),
    vec2<f32>(0.0, 0.0),
    vec2<f32>(0.0, 0.0),
    vec2<f32>(1.0, 1.0),
    vec2<f32>(1.0, 0.0),
  );
  return VertexOutput(vec4<f32>(positions[vertexIndex], 0.999, 1.0), uvs[vertexIndex]);
}

@fragment
fn fragment_main(input: VertexOutput) -> @location(0) vec4<f32> {
  let canvasAspect = backgroundUniforms.x;
  let imageAspect = backgroundUniforms.y;
  let fit = backgroundUniforms.z;
  let opacity = backgroundUniforms.w;
  var uv = input.uv;
  if (fit < 0.5) {
    if (canvasAspect > imageAspect) {
      uv.y = (uv.y - 0.5) * imageAspect / canvasAspect + 0.5;
    } else {
      uv.x = (uv.x - 0.5) * canvasAspect / imageAspect + 0.5;
    }
  } else if (fit < 1.5) {
    if (canvasAspect > imageAspect) {
      uv.x = (uv.x - 0.5) * canvasAspect / imageAspect + 0.5;
    } else {
      uv.y = (uv.y - 0.5) * imageAspect / canvasAspect + 0.5;
    }
  }
  let sampled = textureSample(backgroundTexture, backgroundSampler, uv);
  return vec4<f32>(sampled.rgb, sampled.a * opacity);
}