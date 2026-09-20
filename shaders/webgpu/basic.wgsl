struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
};

struct Uniforms {
  viewProjection: mat4x4<f32>,
  lightDirection: vec3<f32>,
  ambientLight: f32,
};

struct Material {
  baseColor: vec3<f32>,
  metallic: f32,
  roughness: f32,
  specular: f32,
};

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) normal: vec3<f32>,
  @location(1) uv: vec2<f32>,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<uniform> modelMatrix: mat4x4<f32>;
@group(0) @binding(2) var diffuseTexture: texture_2d<f32>;
@group(0) @binding(3) var diffuseSampler: sampler;

const material = Material(
  vec3<f32>(0.949, 0.416, 0.129),
  0.18,
  0.28,
  0.95,
);

@vertex
fn vertex_main(vertex: VertexInput) -> VertexOutput {
  let worldNormal = normalize((modelMatrix * vec4<f32>(vertex.normal, 0.0)).xyz);
  let worldPosition = modelMatrix * vec4<f32>(vertex.position, 1.0);
  return VertexOutput(
    uniforms.viewProjection * worldPosition,
    worldNormal,
    vertex.uv,
  );
}

@fragment
fn fragment_main(input: VertexOutput) -> @location(0) vec4<f32> {
  let lightDir = normalize(uniforms.lightDirection);
  let normal = normalize(input.normal);
  let viewDir = normalize(vec3<f32>(0.0, 0.0, 1.0));
  let lightness = max(dot(normal, -lightDir), 0.0);
  let light = uniforms.ambientLight + (1.0 - uniforms.ambientLight) * lightness;
  let halfVector = normalize(viewDir - lightDir);
  let specularPower = mix(128.0, 24.0, material.roughness);
  let highlight = pow(max(dot(normal, halfVector), 0.0), specularPower);
  let metalTint = mix(vec3<f32>(1.0), material.baseColor, material.metallic);
  let specularColor = mix(vec3<f32>(1.0, 0.88, 0.68), metalTint, material.metallic);
  let diffuse = material.baseColor * light * (1.0 - material.metallic);
  let reflected = specularColor * highlight * material.specular;
  return vec4<f32>(diffuse + reflected, 1.0);
}
