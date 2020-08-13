const POSITION_NAME = "a_position";
const POSITION_LOCATION = 0;
const NORMAL_NAME = "a_normal";
const NORMAL_LOCATION = 1;
const UV_NAME = "a_uv";
const UV_LOCATION = 2;

function GLInstance(canvasId) {
    const canvas = document.getElementById(canvasId);
    const gl = canvas.getContext('webgl2');

    if (!gl) {
        console.error("WebGl context is not available.");
        return null;
    }

    gl.mMeshCache = []; // Cache all the mesh structs

    // Setup GL, Set all the defualt configurations we need.
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // set color

    // Methods
    gl.fClear = function() {
        this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
        return this;
    };

    // Create and fill our array buffer
    gl.fCreateArrayBuffer = function(array, static=true) {
        const buffer = this.createBuffer();
        this.bindBuffer(this.ARRAY_BUFFER, buffer);
        this.bufferData(this.ARRAY_BUFFER, array, static ? this.STATIC_DRAW : this.DYNAMIC_DRAW);
        this.bindBuffer(this.ARRAY_BUFFER, null);

        return buffer;
    };

    gl.fCreateMeshVAO = function(name, indices, vertices, normals, uvs) {
        const vao = { drawMode: this.TRIANGLES };

        // Create and bind vao
        vao.vao = this.createVertexArray();
        this.bindVertexArray(vao.vao);

        // Set up vertices
        if (vertices) {
            vao.verticesBuffer = this.createBuffer();
            vao.verticesLength = 3;
            vao.verticesCount = vertices.length / vao.verticesLength;

            this.bindBuffer(this.ARRAY_BUFFER, vao.verticesBuffer);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(vertices), this.STATIC_DRAW);
            this.enableVertexAttribArray(POSITION_LOCATION);
            this.vertexAttribPointer(POSITION_LOCATION, 3, this.FLOAT, false, 0, 0);
        }

        // Set up normals
        if (normals) {
            vao.normalBuffer = this.createBuffer();
            this.bindBuffer(this.ARRAY_BUFFER, vao.normalBuffer);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(normals), this.STATIC_DRAW);
            this.enableVertexAttribArray(NORMAL_LOCATION);
            this.vertexAttribPointer(NORMAL_LOCATION, 3, this.FLOAT, false, 0, 0);
        }

        // Set up uvs
        if (uvs) {
            vao.uvBuffer = this.createBuffer();
            this.bindBuffer(this.ARRAY_BUFFER, vao.uvBuffer);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(uvs), this.STATIC_DRAW);
            this.enableVertexAttribArray(UV_LOCATION);
            this.vertexAttribPointer(UV_LOCATION, 2, this.FLOAT, false, 0, 0);
        }

        // Set up normals
        if (indices) {
            vao.indicesBuffer = this.createBuffer();
            vao.indicesCount = indices.length;
            this.bindBuffer(this.ARRAY_BUFFER, vao.indicesBuffer);
            this.bufferData(this.ARRAY_BUFFER, new Uint16Array(indices), this.STATIC_DRAW);
            this.bindBuffer(this.ARRAY_BUFFER, null);
        }

        // Clean up
        this.bindVertexArray(null);
        this.bindBuffer(this.ARRAY_BUFFER, null);

        this.mMeshCache[name] = vao;
        return vao;
    }

    // Setters and Getters

    // Set the size of the canvas html element and the rendering viewport
    gl.fSetSize = function(width, height) {
        // Set the size of the canvas, on chrome we need to set it 3 ways to make it work perfectly.
        this.canvas.style.width = width + "px";
        this.canvas.style.height = height + "px";
        this.canvas.width = width;
        this.canvas.height = height;

        // When updating the canvas size, must reset the viewport of the canvas
        // Else the resolution webgl renders at, will not change
        this.viewport(0.0, 0.0, width, height);
        return this;
    };

    return gl;
}