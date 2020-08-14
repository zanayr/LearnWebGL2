const primatives = {};
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