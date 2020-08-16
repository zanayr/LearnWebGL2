const primatives = {};

primatives.Cube = class {
    static createModal(gl) { return new Modal(primatives.Cube.createMesh(gl, 1, 1, 1, 0, 0, 0)); }
    static createMesh(gl, width, height, depth, x, y, z) {
        const w = width * 0.5;
        const h = height * 0.5;
        const d = depth * 0.5;
        const x0 = x - w;
        const x1 = x + w;
        const y0 = y - h;
        const y1 = y + h;
        const z0 = z - d;
        const z1 = z + d;
        const vertices = [
            x0, y1, z1, 0,
            x0, y0, z1, 0,
            x1, y0, z1, 0,
            x1, y1, z1, 0,

            x1, y1, z0, 1,
            x1, y0, z0, 1,
            x0, y0, z0, 1,
            x0, y1, z0, 1,

            x0, y1, z0, 2,
            x0, y0, z0, 2,
            x0, y0, z1, 2,
            x0, y1, z1, 2,

            x0, y0, z1, 3,
            x0, y0, z0, 3,
            x1, y0, z0, 3,
            x1, y0, z1, 3,

            x1, y1, z1, 4,
            x1, y0, z1, 4,
            x1, y0, z0, 4,
            x1, y1, z0, 4,

            x0, y1, z0, 5,
            x0, y1, z1, 5,
            x1, y1, z1, 5,
            x1, y1, z0, 5,
        ];

        const uvs = [];
        for (let i = 0; i < 6; i++) uvs.push(0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0);

        const indices = [];
        for (let i = 0, len = vertices.length / 4; i < len; i+=2) indices.push(i, i + 1, (Math.floor(i / 4) * 4) + ((i + 2) % 4));
        
        const normals = [
             0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,
             0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,
            -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0,
             0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,
             1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,
             0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,
        ];

        const mesh = gl.fCreateMeshVAO("Cube", indices, vertices, normals, uvs, 4);
        mesh.noCulling = true;
        return mesh;
    }
}

primatives.Quad = class {
    static createModal(gl) { return new Modal(primatives.Quad.createMesh(gl)); }
    static createMesh(gl) {
        const vertices = [
            -0.5,  0.5, 0.0,
            -0.5, -0.5, 0.0,
             0.5, -0.5, 0.0,
             0.5,  0.5, 0.0,
        ];
        const uvs = [
            0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0,
        ];
        const indices = [ 0, 1, 2, 2, 3, 0 ];
        const mesh = gl.fCreateMeshVAO("Quad", indices, vertices, null, uvs);
        mesh.noCulling = true;
        mesh.doBlending = true;
        return mesh;
    }
}

primatives.MultiQuad = class {
    static createModal(gl) { return new Modal(primatives.MultiQuad.createMesh(gl)); }
    static createMesh(gl) {
        const vertices = [];
        const uvs = [];
        const indices = [];

        for (let i = 0; i < 10; i++) {
            // Calculate a random size, y rotation and position for the quad
            let size = 0.2 + (0.8 * Math.random());     // quad size
            let half = size * 0.5;                      // radius of rotations
            let angle = Math.PI * 2 * Math.random();    // random angle between 0 and 2 radians
            let dx = half * Math.cos(angle);            // x offset
            let dy = half * Math.sin(angle);            // y offset
            let x = -2.5 + (Math.random() * 5);
            let y = -2.5 + (Math.random() * 5);
            let z = 2.5 - (Math.random() * 5);
            let p = i * 4;                              // index of the first vertex of a quad

            vertices.push(x - dx, y + half, z - dy); // top left
            vertices.push(x - dx, y - half, z - dy); // bottom left
            vertices.push(x + dx, y - half, z + dy); // bottom right
            vertices.push(x + dx, y + half, z + dy); // top right

            uvs.push(0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0);
            indices.push(p, p + 1, p + 2, p + 2, p + 3, p);
        }

        const mesh = gl.fCreateMeshVAO("MultiQuad", indices, vertices, null, uvs);
        mesh.noCulling = true;
        mesh.doBlending = true;
        return mesh;
    }
}

primatives.GridAxis = class {
    static createModal(context, axis) { return new Modal(primatives.GridAxis.createMesh(context, axis)); }
    static createMesh(context, axis=false) {
        const vertices = [];
        const size = 1.8;
        const divisions = 10;
        const step = size / divisions;
        const half = size / 2;
        const colorLocation = 4;
        const mesh = { drawMode: context.LINES, vao: context.createVertexArray() };
        let stride;
        let temp;

        for (let i = 0; i <= divisions; i++) {
            temp = -half + ( i * step);
            vertices.push(temp);
            vertices.push(0.0);
            vertices.push(half);
            vertices.push(0);

            vertices.push(temp);
            vertices.push(0.0);
            vertices.push(-half);
            vertices.push(0);

            temp = half - ( i * step);
            vertices.push(-half);
            vertices.push(0.0);
            vertices.push(temp);
            vertices.push(0);

            vertices.push(half);
            vertices.push(0.0);
            vertices.push(temp);
            vertices.push(0);
        }

        if (axis) {
            // x axis
            vertices.push(-1.1);
            vertices.push(0.0);
            vertices.push(0.0);
            vertices.push(1);
            
            vertices.push(1.1);
            vertices.push(0.0);
            vertices.push(0.0);
            vertices.push(1);
            // y axis
            vertices.push(0.0);
            vertices.push(-1.1);
            vertices.push(0.0);
            vertices.push(2);
            
            vertices.push(0.0);
            vertices.push(1.1);
            vertices.push(0.0);
            vertices.push(2);
            // z axis
            vertices.push(0.0);
            vertices.push(0.0);
            vertices.push(-1.1);
            vertices.push(3);
            
            vertices.push(0.0);
            vertices.push(0.0);
            vertices.push(1.1);
            vertices.push(3);
        }

        mesh.verticesLength = 4;
        mesh.verticesCount = vertices.length / mesh.verticesLength;
        stride = Float32Array.BYTES_PER_ELEMENT * mesh.verticesLength;

        mesh.verticesBuffer = context.createBuffer();
        context.bindVertexArray(mesh.vao);
        context.bindBuffer(context.ARRAY_BUFFER, mesh.verticesBuffer);
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.STATIC_DRAW);
        context.enableVertexAttribArray(POSITION_LOCATION);
        context.enableVertexAttribArray(colorLocation);

        context.vertexAttribPointer(
            POSITION_LOCATION,
            3,
            context.FLOAT,
            false,
            stride,
            0
        );
        context.vertexAttribPointer(
            colorLocation,
            1,
            context.FLOAT,
            false,
            stride,
            Float32Array.BYTES_PER_ELEMENT * 3
        );

        context.bindVertexArray(null);
        context.bindBuffer(gl.ARRAY_BUFFER, null);
        context.mMeshCache["grid"] = mesh;
        return mesh;
    }
}