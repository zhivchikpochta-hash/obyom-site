// Minimal WebGPU declarations for browsers that do not yet ship them in lib.dom.d.ts.
interface GPU {
  requestAdapter(options?: any): Promise<GPUAdapter | null>;
  getPreferredCanvasFormat(): string;
}

interface GPUAdapter {
  requestDevice(descriptor?: any): Promise<GPUDevice>;
}

interface GPUDevice {
  createBuffer(options: any): any;
  createTexture(options: any): any;
  createSampler(options?: any): any;
  createShaderModule(options: any): any;
  createPipelineLayout(options: any): any;
  createBindGroupLayout(options: any): any;
  createBindGroup(options: any): any;
  createRenderPipeline(options: any): any;
  createCommandEncoder(options?: any): any;
  pushErrorScope(filter: 'validation' | 'out-of-memory' | 'internal'): void;
  popErrorScope(): Promise<any>;
  addEventListener(type: string, listener: (event: any) => void): void;
  lost: Promise<{ reason: string; message: string }>;
  queue: GPUQueue;
}

interface GPUQueue {
  writeBuffer(buffer: any, offset: number, data: ArrayBufferView, dataOffset?: number, size?: number): void;
  copyExternalImageToTexture(source: any, destination: any, copySize: any): void;
  writeTexture(destination: any, data: ArrayBufferView, dataLayout: any, size: any): void;
  submit(commandBuffers: any[]): void;
}

interface GPUCanvasContext {
  configure(options: any): void;
  getCurrentTexture(): any;
}

interface GPURenderPassEncoder {
  setPipeline(pipeline: any): void;
  setBindGroup(index: number, bindGroup: any, dynamicOffsets?: number[]): void;
  setVertexBuffer(slot: number, buffer: any, offset?: number, size?: number): void;
  draw(vertexCount: number, instanceCount?: number, firstVertex?: number, firstInstance?: number): void;
  end(): void;
}

export class WebGPUContext {
  private adapter: GPUAdapter | null = null;
  private device: GPUDevice | null = null;
  private queue: GPUQueue | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private canvasContext: GPUCanvasContext | null = null;
  private presentationFormat = '';

  async init(canvas: HTMLCanvasElement): Promise<void> {
    this.canvas = canvas;
    const gpu = (navigator as any).gpu as GPU | undefined;
    if (!gpu) throw new Error('WebGPU is not supported in this browser');

    this.adapter = await gpu.requestAdapter();
    if (!this.adapter) throw new Error('Failed to get GPU adapter');

    this.device = await this.adapter.requestDevice();
    this.queue = this.device.queue;
    this.canvasContext = canvas.getContext('webgpu') as unknown as GPUCanvasContext;
    if (!this.canvasContext) throw new Error('Failed to get WebGPU canvas context');

    this.presentationFormat = gpu.getPreferredCanvasFormat();
    this.device.lost.then(({ reason, message }) => {
      console.error(`WebGPU device lost (${reason}): ${message}`);
    });
    this.device.addEventListener('uncapturederror', (event: any) => {
      const error = event.error;
      console.error(
        `[WebGPU ${error?.constructor?.name ?? 'Error'}]`,
        error?.message ?? error,
      );
    });
  }

  configureCanvas(): void {
    if (!this.device || !this.canvasContext || !this.canvas) return;
    this.canvasContext.configure({
      device: this.device,
      format: this.presentationFormat,
      alphaMode: 'opaque',
    });
  }

  getAdapter(): GPUAdapter | null { return this.adapter; }
  getDevice(): GPUDevice | null { return this.device; }
  getQueue(): GPUQueue | null { return this.queue; }
  getCanvas(): HTMLCanvasElement | null { return this.canvas; }
  getPresentationFormat(): string { return this.presentationFormat; }
  pushErrorScope(filter: 'validation' | 'out-of-memory' | 'internal'): void {
    this.device?.pushErrorScope(filter);
  }
  async popErrorScope(): Promise<any> {
    return this.device?.popErrorScope() ?? null;
  }
  getCurrentTexture(): any | null {
    return this.canvasContext ? this.canvasContext.getCurrentTexture().createView() : null;
  }
}
