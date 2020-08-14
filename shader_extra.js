class GridAxisShader extends Shader {
    constructor(context, perspectiveMatrix) {
        const vertexSource = `#version 300 es
        in vec3 a_position; // standard position data
        layout(location=4) in float a_color; // will hold the 4th custom position of the custom position buffer

        uniform mat4 u_projectionMatrix;
        uniform mat4 u_modalViewMatrix;
        uniform mat4 u_cameraMatrix;
        uniform vec3 u_color[4]; // color array

        out lowp vec4 color; // color output

        void main(void) {
            color = vec4(u_color[int(a_color)], 1.0); // using the 4th float as a color index
            gl_Position = u_projectionMatrix * u_cameraMatrix * u_modalViewMatrix * vec4(a_position, 1.0);
        }`;
        const fragmentSouce = `#version 300 es
        precision mediump float;

        in vec4 color;
        out vec4 final;

        void main(void) {
            final = color;
        }`;
        super(context, vertexSource, fragmentSouce);

        // Standard uniforms
        this.setPerspective(perspectiveMatrix);

        // Custom unifroms
        const uColor = context.getUniformLocation(this.program, 'u_color');
        context.uniform3fv(uColor, new Float32Array([
            0.8, 0.8, 0.8, // gray
            1.0, 0.0, 0.0, // red
            0.0, 1.0, 0.0, // green
            0.0, 0.0, 1.0, // blue
        ]));

        // Clean up
        context.useProgram(null);
    }
}