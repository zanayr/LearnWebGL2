class Camera {
    constructor(context, fov=45.0, near=0.1, far=100.0) {
        // Set the perspective matrix
        const ratio = context.canvas.width / context.canvas.height;
        this.projectionMatrix = new Float32Array(16);
        Matrix4.perspective(this.projectionMatrix, fov, ratio, near, far);
        this.transform = new Transform();       // setup transfrom to control the position of the camera
        this.viewMatrix = new Float32Array(16); // Cache the matrix that will hold the inverse of the tranform

        this.mode = Camera.MODE_ORBIT;          // Set what sort of control mode to use
    }

    panX(v) {
        if (this.mode === Camera.MODE_ORBIT) return; // panning in the x axis is only allowed in free mode
        this.updateViewMatrix();
        this.transform.position.x += this.transform.right[0] * v;
        this.transform.position.y += this.transform.right[1] * v;
        this.transform.position.z += this.transform.right[2] * v;
    }
    panY(v) {
        this.updateViewMatrix();
        this.transform.position.y += this.transform.up[1] * v;
        if (this.mode === Camera.MODE_ORBIT) return; // can only move up and down in y axis in orbit mode
        this.transform.position.x += this.transform.up[0] * v;
        this.transform.position.z += this.transform.up[2] * v;
    }
    panZ(v) {
        this.updateViewMatrix();
        if (this.mode === Camera.MODE_ORBIT) {
            this.transform.position.z += v; // orbit mode does translate after rotate, so only need to set Z, the rotate will handle the rest
        } else {
            this.transform.position.x += this.transform.forward[0] * v;
            this.transform.position.y += this.transform.forward[1] * v;
            this.transform.position.z += this.transform.forward[2] * v;
        }
    }

    // To have different modes of movements, this function handles the view matrix update for the tranform object
    updateViewMatrix() {
        // Optimize camera transform update, no need for scale and rotate
        if (this.mode === Camera.MODE_FREE) {
            this.transform.viewMatrix.reset()
                .vtranslate(this.transform.position)
                .rotateX(this.transform.rotation.x * Transform.deg2Rad)
                .rotateY(this.transform.rotation.y * Transform.deg2Rad);
        } else {
            this.transform.viewMatrix.reset()
                .rotateX(this.transform.rotation.x * Transform.deg2Rad)
                .rotateY(this.transform.rotation.y * Transform.deg2Rad)
                .vtranslate(this.transform.position);
        }

        this.transform.updateDirection();

        // Cameras work by doing the inverse tranformation on all meshes
        Matrix4.invert(this.viewMatrix, this.transform.viewMatrix.raw);
        return this.viewMatrix;
    }
}

Camera.MODE_FREE = 0;
Camera.MODE_ORBIT = 1;

class CameraController {
    constructor(context, camera) {
        const that = this;
        const box = context.canvas.getBoundingClientRect();
        this.canvas = context.canvas;
        this.camera = camera;

        this.rotateRate = -300;
        this.panRate = 5;
        this.zoomRate = 200;

        this.offsetX = box.left;
        this.offsetY = box.top;
        
        this.initX = 0;
        this.initY = 0;
        this.prevX = 0;
        this.prevY = 0;

        this.onUpHandler = function(e) { that.onMouseUp(e); }
        this.onMoveHandler = function(e) { that.onMouseMove(e); }

        this.canvas.addEventListener('mousedown', function(e) { that.onMouseDown(e); });
        this.canvas.addEventListener('mousewheel', function(e) { that.onMouseWheel(e); });
    }

    getMouseVec2(e) { return { x: e.pageX = this.offsetX, y: e.pageY - this.offsetY }; }
    
    onMouseDown(e) {
        this.initX = this.prevX = e.pageX - this.offsetX;
        this.initY = this.prevY = e.pageY - this.offsetY;

        this.canvas.addEventListener('mouseup', this.onUpHandler);
        this.canvas.addEventListener('mousemove', this.onMoveHandler);
    }

    onMouseUp(e) {
        this.canvas.removeEventListener('mouseup', this.onUpHandler);
        this.canvas.removeEventListener('mousemove', this.onMoveHandler);
    }

    onMouseWheel(e) {
        const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))); // Try to map wheel movement to a nomber between -1 and 1
        this.camera.panZ(delta * (this.zoomRate / this.canvas.height));
    }

    onMouseMove(e) {
        const x = e.pageX - this.offsetX;
        const y = e.pageY - this.offsetY;
        const dx = x - this.prevX;
        const dy = y - this.prevY;

        if (!e.shiftKey) {
            this.camera.transform.rotation.y += dx * (this.rotateRate / this.canvas.width);
            this.camera.transform.rotation.x += dy * (this.rotateRate / this.canvas.height);
        } else {
            this.camera.panX(-dx * (this.panRate / this.canvas.width));
            this.camera.panY(dy * (this.panRate / this.canvas.height));
        }

        this.prevX = x;
        this.prevY = y;
    }
}