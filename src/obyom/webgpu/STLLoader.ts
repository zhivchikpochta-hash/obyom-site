export interface STLGeometry {
  positions: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
}

/** Loads a binary STL file. */
export async function loadBinarySTL(url: string): Promise<STLGeometry> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load STL ${url}: ${response.status}`);
  }

  const data = await response.arrayBuffer();
  return parseBinarySTL(data, url);
}

/** Loads either binary or ASCII STL, detecting the format from the file contents. */
export async function loadSTL(url: string): Promise<STLGeometry> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load STL ${url}: ${response.status}`);
  const data = await response.arrayBuffer();

  try {
    return parseBinarySTL(data, url);
  } catch (binaryError) {
    try {
      return parseASCIISTL(new TextDecoder().decode(data), url);
    } catch (asciiError) {
      throw new Error(
        `Invalid STL ${url}: binary parse failed (${(binaryError as Error).message}); ` +
        `ASCII parse failed (${(asciiError as Error).message})`,
      );
    }
  }
}

export function parseBinarySTL(data: ArrayBuffer, source = 'STL'): STLGeometry {
  if (data.byteLength < 84) {
    throw new Error(`Invalid binary STL ${source}: file is shorter than 84 bytes`);
  }

  const view = new DataView(data);
  const triangleCount = view.getUint32(80, true);
  const expectedSize = 84 + triangleCount * 50;

  if (expectedSize !== data.byteLength) {
    throw new Error(
      `Invalid binary STL ${source}: expected ${expectedSize} bytes, got ${data.byteLength}`,
    );
  }

  const positions = new Float32Array(triangleCount * 9);
  const normals = new Float32Array(triangleCount * 9);
  const uvs = new Float32Array(triangleCount * 6);

  let positionOffset = 0;
  let normalOffset = 0;
  let uvOffset = 0;

  for (let triangle = 0; triangle < triangleCount; triangle += 1) {
    const offset = 84 + triangle * 50;
    const normal = [
      view.getFloat32(offset, true),
      view.getFloat32(offset + 4, true),
      view.getFloat32(offset + 8, true),
    ];

    for (let vertex = 0; vertex < 3; vertex += 1) {
      const vertexOffset = offset + 12 + vertex * 12;
      positions[positionOffset++] = view.getFloat32(vertexOffset, true);
      positions[positionOffset++] = view.getFloat32(vertexOffset + 4, true);
      positions[positionOffset++] = view.getFloat32(vertexOffset + 8, true);

      normals[normalOffset++] = normal[0];
      normals[normalOffset++] = normal[1];
      normals[normalOffset++] = normal[2];

      uvs[uvOffset++] = vertex === 0 ? 0 : 1;
      uvs[uvOffset++] = vertex === 2 ? 1 : 0;
    }
  }

  return { positions, normals, uvs };
}

export function parseASCIISTL(text: string, source = 'STL'): STLGeometry {
  const facetPattern = /facet\s+normal\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)[\s\S]*?outer\s+loop\s+([\s\S]*?)endloop[\s\S]*?endfacet/gi;
  const vertexPattern = /vertex\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)/gi;
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  let triangleCount = 0;
  let facetMatch: RegExpExecArray | null;

  while ((facetMatch = facetPattern.exec(text)) !== null) {
    const normal = facetMatch.slice(1, 4).map(Number);
    if (normal.some((value) => !Number.isFinite(value))) {
      throw new Error(`Invalid ASCII STL ${source}: non-numeric normal`);
    }
    const vertices: number[][] = [];
    let vertexMatch: RegExpExecArray | null;
    vertexPattern.lastIndex = 0;
    while ((vertexMatch = vertexPattern.exec(facetMatch[0])) !== null) {
      const vertex = vertexMatch.slice(1, 4).map(Number);
      if (vertex.some((value) => !Number.isFinite(value))) {
        throw new Error(`Invalid ASCII STL ${source}: non-numeric vertex`);
      }
      vertices.push(vertex);
    }
    if (vertices.length !== 3) {
      throw new Error(`Invalid ASCII STL ${source}: each facet must contain 3 vertices`);
    }
    vertices.forEach((vertex, index) => {
      positions.push(...vertex);
      normals.push(...normal);
      uvs.push(index === 0 ? 0 : 1, index === 2 ? 1 : 0);
    });
    triangleCount += 1;
  }

  if (triangleCount === 0 || !/^\s*solid\b/i.test(text) || !/endsolid\s*[^\r\n]*\s*$/i.test(text.trim())) {
    throw new Error(`Invalid ASCII STL ${source}: no complete solid was found`);
  }
  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    uvs: new Float32Array(uvs),
  };
}
