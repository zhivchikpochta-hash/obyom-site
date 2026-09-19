const BUFFER_UNIFORM = 0x0040;
const BUFFER_COPY_DST = 0x0008;
const BUFFER_VERTEX = 0x0020;

export class GPUBuffer {
  private buffer: any;

  constructor(private device: any, size: number, usage: number) {
    if (size <= 0 || size % 4 !== 0) {
      throw new Error(`GPU buffer size must be a positive multiple of 4, got ${size}`);
    }
    this.buffer = device.createBuffer({ size, usage });
  }

  static createVertexBuffer(device: any, data: Float32Array): GPUBuffer {
    const buffer = new GPUBuffer(device, data.byteLength, BUFFER_VERTEX | BUFFER_COPY_DST);
    buffer.write(data);
    return buffer;
  }

  static createUniformBuffer(device: any, byteLength: number): GPUBuffer {
    return new GPUBuffer(device, byteLength, BUFFER_UNIFORM | BUFFER_COPY_DST);
  }

  write(data: Float32Array, offset = 0): void {
    this.device.queue.writeBuffer(this.buffer, offset, data);
  }

  getBuffer(): any {
    return this.buffer;
  }

  destroy(): void {
    this.buffer.destroy();
  }
}
