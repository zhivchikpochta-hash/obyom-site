export class GPUTexture {
  private texture: any;
  private sampler: any;
  private size: { width: number; height: number } = { width: 0, height: 0 };

  constructor(
    private device: any,
    size: { width: number; height: number },
    private format = 'rgba8unorm'
  ) {
    this.size = size;
    const isDepth = format === 'depth24plus';

    this.texture = device.createTexture({
      size: [size.width, size.height, 1],
      format,
      usage: isDepth ? 0x0010 : 0x0002 | 0x0004, // RENDER_ATTACHMENT | COPY_DST | TEXTURE_BINDING
    });

    if (!isDepth && size.width === 1 && size.height === 1) {
      const pixelData = new Uint8Array(256);
      pixelData.set([255, 255, 255, 255]);

      device.queue.writeTexture(
        { texture: this.texture },
        pixelData,
        { offset: 0, bytesPerRow: 256, rowsPerImage: 1 },
        { width: 1, height: 1, depthOrArrayLayers: 1 }
      );
    }

    this.sampler = device.createSampler({
      addressModeU: 'repeat',
      addressModeV: 'repeat',
      magFilter: 'linear',
      minFilter: 'linear',
    });
  }

  static fromImage(
    device: any,
    image: HTMLImageElement | ImageBitmap
  ): GPUTexture {
    const texture = new GPUTexture(device, {
      width: image.width,
      height: image.height,
    });
    texture.uploadImage(image);
    return texture;
  }

  uploadImage(image: HTMLImageElement | ImageBitmap): void {
    this.device.queue.copyExternalImageToTexture(
      { source: image },
      { texture: this.texture },
      [image.width, image.height]
    );
  }

  getTexture(): any {
    return this.texture;
  }

  getSampler(): any {
    return this.sampler;
  }

  getTextureView(): any {
    return this.texture.createView();
  }

  getSize(): { width: number; height: number } {
    return this.size;
  }

  destroy(): void {
    this.texture.destroy();
  }
}
