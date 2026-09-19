import { WebGPUContext } from './Context';
import { GPUBuffer } from './Buffer';
import { GPUTexture } from './Texture';
import { GPUPipeline } from './Pipeline';

export class WebGPURenderer {
  private context!: WebGPUContext;
  private pipeline: GPUPipeline | null = null;
  private uniformBuffer: GPUBuffer | null = null;
  private modelBuffer: GPUBuffer | null = null;
  private bindGroup: any | null = null;
  private depthTexture: GPUTexture | null = null;
  private positionBuffer: GPUBuffer | null = null;
  private normalBuffer: GPUBuffer | null = null;
  private uvBuffer: GPUBuffer | null = null;
  private vertexCount = 0;
  private fallbackTexture: GPUTexture | null = null;

  setGeometry(geometry: { positions: Float32Array; normals: Float32Array; uvs: Float32Array }): void {
    const device = this.context.getDevice();
    if (!device) throw new Error('Device not initialized');

    this.positionBuffer?.destroy();
    this.normalBuffer?.destroy();
    this.uvBuffer?.destroy();

    this.positionBuffer = GPUBuffer.createVertexBuffer(device, geometry.positions);
    this.normalBuffer = GPUBuffer.createVertexBuffer(device, geometry.normals);
    this.uvBuffer = GPUBuffer.createVertexBuffer(device, geometry.uvs);
    this.vertexCount = geometry.positions.length / 3;
  }

  constructor(
    private canvas: HTMLCanvasElement,
    private params: Record<string, unknown> = {},
  ) {}

  async init(): Promise<void> {
    this.context = new WebGPUContext();
    await this.context.init(this.canvas);
    this.resizeCanvasToDisplaySize();

    const device = this.context.getDevice();
    if (!device) throw new Error('Device not initialized');

    this.uniformBuffer = GPUBuffer.createUniformBuffer(device, 80);
    this.modelBuffer = GPUBuffer.createUniformBuffer(device, 64);

    const shaderCode = await this.loadShader('/shaders/webgpu/basic.wgsl');
    this.pipeline = new GPUPipeline(device, shaderCode, this.context.getPresentationFormat());
    this.pipeline.init();

    // A 1x1 white texture keeps the first render path valid before materials exist.
    this.fallbackTexture = new GPUTexture(device, { width: 1, height: 1 });
    this.bindGroup = this.pipeline.createBindGroup(this.uniformBuffer, this.modelBuffer, this.fallbackTexture);

    this.createDemoTriangle();
    this.createDepthTexture();
  }

  private createDemoTriangle(): void {
    const device = this.context.getDevice()!;
    const positions = new Float32Array([0, 0.7, 0, -0.7, -0.7, 0, 0.7, -0.7, 0]);
    const normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]);
    const uvs = new Float32Array([0.5, 0, 0, 1, 1, 1]);
    this.positionBuffer = GPUBuffer.createVertexBuffer(device, positions);
    this.normalBuffer = GPUBuffer.createVertexBuffer(device, normals);
    this.uvBuffer = GPUBuffer.createVertexBuffer(device, uvs);
    this.vertexCount = positions.length / 3;
  }

  private createDepthTexture(): void {
    const device = this.context.getDevice();
    const width = this.canvas.width || 1;
    const height = this.canvas.height || 1;
    if (this.depthTexture) this.depthTexture.destroy();
    this.depthTexture = new GPUTexture(device!, { width, height }, 'depth24plus');
  }

  private async loadShader(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load shader ${url}: ${response.status}`);
    return response.text();
  }

  render(viewProjectionMatrix: Float32Array, modelMatrix: Float32Array, texture: GPUTexture | null = null): void {
    const device = this.context.getDevice();
    const queue = this.context.getQueue();
    const pipeline = this.pipeline?.getPipeline();
    if (!device || !queue || !pipeline || !this.uniformBuffer || !this.modelBuffer) return;

    const uniformData = new Float32Array(20);
    uniformData.set(viewProjectionMatrix.subarray(0, 16), 0);
    uniformData.set([0, 0, -1, 0.2], 16);
    this.uniformBuffer.write(uniformData);
    this.modelBuffer.write(modelMatrix.subarray(0, 16));

    if (texture) {
      this.bindGroup = this.pipeline!.createBindGroup(this.uniformBuffer, this.modelBuffer, texture);
    }

    const currentTexture = this.context.getCurrentTexture();
    const depthView = this.depthTexture?.getTextureView();
    if (!currentTexture || !depthView || !this.bindGroup || !this.positionBuffer || !this.normalBuffer || !this.uvBuffer) return;

    this.context.pushErrorScope('validation');

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [{ view: currentTexture, clearValue: { r: 0.95, g: 0.95, b: 0.95, a: 1 }, loadOp: 'clear', storeOp: 'store' }],
      depthStencilAttachment: { view: depthView, depthClearValue: 1, depthLoadOp: 'clear', depthStoreOp: 'store' },
    });
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, this.bindGroup);
    passEncoder.setVertexBuffer(0, this.positionBuffer.getBuffer());
    passEncoder.setVertexBuffer(1, this.normalBuffer.getBuffer());
    passEncoder.setVertexBuffer(2, this.uvBuffer.getBuffer());
    passEncoder.draw(this.vertexCount);
    passEncoder.end();
    queue.submit([commandEncoder.finish()]);

    void this.context.popErrorScope().then((error: any) => {
      if (error) {
        console.error(
          `[WebGPU render ${error.constructor?.name ?? 'Error'}]`,
          error.message,
        );
      }
    });
  }

  resize(width = this.canvas.clientWidth, height = this.canvas.clientHeight): void {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    this.canvas.width = Math.max(1, Math.floor(width * dpr));
    this.canvas.height = Math.max(1, Math.floor(height * dpr));
    this.context?.configureCanvas();
    if (this.context?.getDevice()) this.createDepthTexture();
  }

  private resizeCanvasToDisplaySize(): void {
    this.resize(this.canvas.clientWidth || 700, this.canvas.clientHeight || 700);
  }

  getContext(): WebGPUContext { return this.context; }
}
