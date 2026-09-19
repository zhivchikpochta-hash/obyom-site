import { WebGPURenderer } from './webgpu/Renderer';
import { loadSTL, STLGeometry } from './webgpu/STLLoader';

export interface OBYOMOptions {
  canvas: string | HTMLCanvasElement;
  params?: Record<string, unknown>;
}

/** Public entry point for the Obyom WebGPU viewer. */
export class OBYOM {
  private readonly canvas: HTMLCanvasElement;
  private readonly params: Record<string, unknown>;
  private renderer: WebGPURenderer | null = null;
  private geometry: STLGeometry | null = null;
  private started = false;
  private animationFrame: number | null = null;
  private readonly handleResize = (): void => this.renderer?.resize();

  constructor(options: OBYOMOptions) {
    this.canvas = this.resolveCanvas(options.canvas);
    this.params = options.params ?? {};
  }

  /** Initializes WebGPU and starts the render loop. */
  async start(): Promise<void> {
    if (this.started) return;

    const renderer = new WebGPURenderer(this.canvas, this.params);
    await renderer.init();
    this.renderer = renderer;
    this.started = true;
    window.addEventListener('resize', this.handleResize);
    this.renderFrame();
  }

  /** Loads an STL model and uploads it to the initialized renderer. */
  async load(path: string): Promise<void> {
    if (!this.started || !this.renderer) {
      throw new Error('OBYOM must be started before loading a model');
    }

    const geometry = await loadSTL(path);
    this.geometry = geometry;
    this.renderer.setGeometry(geometry);
  }

  private renderFrame(): void {
    if (!this.renderer) return;

    if (this.geometry) {
      this.renderer.render(
        this.createViewProjectionMatrix(),
        this.createFittedModelMatrix(this.geometry.positions),
      );
    }
    this.animationFrame = requestAnimationFrame(() => this.renderFrame());
  }

  private resolveCanvas(canvas: string | HTMLCanvasElement): HTMLCanvasElement {
    if (canvas instanceof HTMLCanvasElement) return canvas;

    const element = document.querySelector(canvas);
    if (!(element instanceof HTMLCanvasElement)) {
      throw new Error(`Expected a canvas element matching "${canvas}"`);
    }
    return element;
  }

  private createViewProjectionMatrix(): Float32Array {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  }

  private createFittedModelMatrix(positions: Float32Array): Float32Array {
    const rotationX = -10 * Math.PI / 180;
    const rotationY = 18 * Math.PI / 180;
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);

    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < positions.length; i += 3) {
      min[0] = Math.min(min[0], positions[i]);
      min[1] = Math.min(min[1], positions[i + 1]);
      min[2] = Math.min(min[2], positions[i + 2]);
      max[0] = Math.max(max[0], positions[i]);
      max[1] = Math.max(max[1], positions[i + 1]);
      max[2] = Math.max(max[2], positions[i + 2]);
    }

    const center = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
    const rotatedMin = [Infinity, Infinity, Infinity];
    const rotatedMax = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i] - center[0];
      const y = positions[i + 1] - center[1];
      const z = positions[i + 2] - center[2];
      const rotated = [
        cosY * x + sinY * z,
        sinX * sinY * x + cosX * y - sinX * cosY * z,
        -cosX * sinY * x + sinX * y + cosX * cosY * z,
      ];
      for (let axis = 0; axis < 3; axis += 1) {
        rotatedMin[axis] = Math.min(rotatedMin[axis], rotated[axis]);
        rotatedMax[axis] = Math.max(rotatedMax[axis], rotated[axis]);
      }
    }

    const rotatedCenter = [
      (rotatedMin[0] + rotatedMax[0]) / 2,
      (rotatedMin[1] + rotatedMax[1]) / 2,
      (rotatedMin[2] + rotatedMax[2]) / 2,
    ];
    const largestSide = Math.max(
      rotatedMax[0] - rotatedMin[0],
      rotatedMax[1] - rotatedMin[1],
      rotatedMax[2] - rotatedMin[2],
    );
    const scale = 1.6 / largestSide;

    return new Float32Array([
      cosY * scale, sinX * sinY * scale, -cosX * sinY * scale, 0,
      0, cosX * scale, sinX * scale, 0,
      sinY * scale, -sinX * cosY * scale, cosX * cosY * scale, 0,
      -rotatedCenter[0] * scale,
      -rotatedCenter[1] * scale,
      0.5 - rotatedCenter[2] * scale,
      1,
    ]);
  }
}
