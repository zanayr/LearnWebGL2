class Transform {
    constructor() {
        this.position = new Vector3(0.0, 0.0, 0.0);  // Traditional x, y, z 3d position
        this.scale = new Vector3(1.0, 1.0, 1.0);     // How much to scale a mesh, having a 1 means no scaling is done
        this.rotation = new Vector3(0.0, 0.0, 0.0);  // Hold rotation values based on degrees, object will translate it to radians
        this.viewMatrix = new Matrix4();             // Cache the results when calling updateMatrix
        this.normalMatrix = new Float32Array(9);     // This is a Mat3, raw array to hold the values is enough for what it's used for

        this.forward = new Float32Array(4); // When rotating, keep track of what the forward direction is
        this.up = new Float32Array(4);      // What the up direction is, invert to get the bottom
        this.right = new Float32Array(4);   // What the right direction is, invert to get left
    }

    updateMatrix() {
        this.viewMatrix.reset() // Order is very important!!
            .vtranslate(this.position)
            .rotateX(this.rotation.x * Transform.deg2Rad)
            .rotateZ(this.rotation.z * Transform.deg2Rad) // NOTE: z
            .rotateY(this.rotation.y * Transform.deg2Rad)
            .vscale(this.scale);
        
        // Calculate the normal matrix which doesn't need translate, then transpose and inverse the mat4 to mat3
        Matrix4.normalMat3(this.normalMatrix, this.viewMatrix.raw);

        // Determine direction after all the transformations
        Matrix4.transformVec4(this.forward, [0.0, 0.0, 1.0, 0.0], this.viewMatrix.raw); // z
        Matrix4.transformVec4(this.up, [0.0, 1.0, 0.0, 0.0], this.viewMatrix.raw); // y
        Matrix4.transformVec4(this.right, [1.0, 0.0, 0.0, 0.0], this.viewMatrix.raw); // x

        

        return this.viewMatrix.raw;
    }

    updateDirection() {
        Matrix4.transformVec4(this.forward, [0.0, 0.0, 1.0, 0.0], this.viewMatrix.raw);
        Matrix4.transformVec4(this.up, [0.0, 1.0, 0.0, 0.0], this.viewMatrix.raw);
        Matrix4.transformVec4(this.right, [1.0, 0.0, 0.0, 0.0], this.viewMatrix.raw);
        return this;
    }

    getViewMatrix() { return this.viewMatrix.raw; }
    getNormalMatrix() { return this.normalMatrix; }

    reset() {
        this.position.set(0.0, 0.0, 0.0);
        this.scale.set(1.0, 1.0, 1.0);
        this.rotation.set(0.0, 0.0, 0.0);
    }
}

Transform.deg2Rad = Math.PI / 180;