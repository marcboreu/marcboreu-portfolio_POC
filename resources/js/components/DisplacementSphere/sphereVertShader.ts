export const vertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
uniform float uTime;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vec3 displaced = position + normal * (0.08 * sin(position.y * 4.0 + uTime * 3.0) + 0.035 * sin(position.x * 7.0 - uTime * 2.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;
