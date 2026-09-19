export class GPUPipeline {
  private pipeline: any | null = null;
  private bindGroupLayout: any | null = null;

  constructor(private device: any, private shaderCode: string, private targetFormat: string) {}

  init(): void {
    const shaderModule = this.device.createShaderModule({ code: this.shaderCode });
    this.bindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: 3, buffer: { type: 'uniform' } },
        { binding: 1, visibility: 1, buffer: { type: 'uniform' } },
        { binding: 2, visibility: 2, texture: { sampleType: 'float' } },
        { binding: 3, visibility: 2, sampler: { type: 'filtering' } },
      ],
    });

    this.pipeline = this.device.createRenderPipeline({
      layout: this.device.createPipelineLayout({ bindGroupLayouts: [this.bindGroupLayout] }),
      vertex: {
        module: shaderModule,
        entryPoint: 'vertex_main',
        buffers: [
          { arrayStride: 12, attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }] },
          { arrayStride: 12, attributes: [{ shaderLocation: 1, offset: 0, format: 'float32x3' }] },
          { arrayStride: 8, attributes: [{ shaderLocation: 2, offset: 0, format: 'float32x2' }] },
        ],
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fragment_main',
        targets: [{ format: this.targetFormat }],
      },
      primitive: { topology: 'triangle-list', cullMode: 'back', frontFace: 'ccw' },
      depthStencil: { depthWriteEnabled: true, depthCompare: 'less', format: 'depth24plus' },
    });
  }

  getPipeline(): any | null { return this.pipeline; }
  getBindGroupLayout(): any | null { return this.bindGroupLayout; }

  createBindGroup(uniformBuffer: any, modelBuffer: any, texture: any): any {
    return this.device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: uniformBuffer.getBuffer() } },
        { binding: 1, resource: { buffer: modelBuffer.getBuffer() } },
        { binding: 2, resource: texture.getTextureView() },
        { binding: 3, resource: texture.getSampler() },
      ],
    });
  }
}
