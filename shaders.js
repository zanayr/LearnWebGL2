class Shader {
    constructor(context, vertexSource, fragmentSource) {
        this.program = ShaderUtil.createProgramFromText(context, vertexSource, fragmentSource, true);

        if (this.program) {
            this.gl = context;
            this.gl.useProgram(this.program);
            this.attribLocation = ShaderUtil.getStandardAttribLocations(context, this.program);
            this.uniformLocation = {};
        }
    }

    // Methods
    activate() {
        this.gl.useProgram(this.program);
        return this;
    }
    deactivate() {
        this.gl.useProgram(null);
        return this;
    }
    dispose() {
        if (this.gl.getParameter(this.gt.CURRENT_PROGRAM) === this.program) this.gl.useProgram(null);
        this.gl.deleteProgram(this.program);
    }

    // Render related methods
    preRender() {}

    // Handle rendering a modal
    renderModal(modal) {
        this.gl.bindVertexArray(modal.mesh.vao);

        if (modal.mesh.indexCount) {
            this.gl.drawElements(modal.mesh.drawMode, modal.mesh.indexLength, gl.UNSIGNED_SHORT, 0);
        } else {
            this.gl.drawArrays(modal.mesh.drawMode, 0, modal.mesh.verticesCount);
        }

        this.gl.bindVertexArray(null);
        return this;
    }
}

class ShaderUtil {
    static loadShader(elementId) {
        const element = document.getElementById(elementId);
        if (!element || element.text == "") {
            console.log(`${elementId} shader not found or no text.`);
            return null;
        }
        return element.text;
    }

    static compileShader(context, source, type) {
        const shader = context.createShader(type);
        context.shaderSource(shader, source);
        context.compileShader(shader);

        // Get Error data if shader failed to compile
        if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
            console.error(`Error compiling shader: ${source}, ${context.getShaderInfoLog(shader)}`);
            context.deleteShader(shader);
            return null;
        }

        return shader;
    }

    static linkProgram(context, vertex, fragment, validate) {
        // Link shaders together
        const program = context.createProgram();
        context.attachShader(program, vertex);
        context.attachShader(program, fragment);

        context.bindAttribLocation(program, POSITION_LOCATION, POSITION_NAME);
        context.bindAttribLocation(program, NORMAL_LOCATION, NORMAL_NAME);
        context.bindAttribLocation(program, UV_LOCATION, UV_NAME);

        context.linkProgram(program);

        // Check if linking was successful
        if (!context.getProgramParameter(program, context.LINK_STATUS)) {
            console.error(`Error creating shader program: ${context.getProgramInfoLog(program)}`);
            context.deleteProgram(program);
            return null;
        }

        // Validate if debugging
        if (validate) {
            context.validateProgram(program);
            if (!context.getProgramParameter(program, context.VALIDATE_STATUS)) {
                console.error(`Error validating program: ${context.getProgramInfoLog(program)}`);
                context.deleteProgram(program);
                return null;
            }
        }

        // Can delete the shaders since the program has been linked
        context.detachShader(program, vertex); // may cause issues on some browsers
        context.detachShader(program, fragment); // may cause issues on some browsers
        context.deleteShader(fragment);
        context.deleteShader(vertex);

        return program;
    }

    static createProgram(context, vertexId, fragmentId, validate) {
        const vertexText = ShaderUtil.loadShader(vertexId);
        const fragmentText = ShaderUtil.loadShader(fragmentId);
        if (!vertexText || !fragmentText) return null;

        const vertex = ShaderUtil.compileShader(context, vertexText, context.VERTEX_SHADER);
        const fragment = ShaderUtil.compileShader(context, fragmentText, context.FRAGMENT_SHADER);
        if (!vertex) return null;
        if (!fragment) {
            context.deleteShader(vertex);
            return null;
        }

        return ShaderUtil.linkProgram(context, vertex, fragment, validate);
    }

    static createProgramFromText(context, vertexText, fragmentText, validate) {
        const vertex = ShaderUtil.compileShader(context, vertexText, context.VERTEX_SHADER);
        const fragment = ShaderUtil.compileShader(context, fragmentText, context.FRAGMENT_SHADER);
        if (!vertex) return null;
        if (!fragment) {
            context.deleteShader(vertex);
            return null;
        }

        return ShaderUtil.linkProgram(context, vertex, fragment, validate);
    }

    static getStandardAttribLocations(context, program) {
        return {
            position: context.getAttribLocation(program, POSITION_NAME),
            normal: context.getAttribLocation(program, NORMAL_NAME),
            uv: context.getAttribLocation(program, UV_NAME),
        };
    }
}