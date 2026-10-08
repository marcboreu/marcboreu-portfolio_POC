export const fragmentShader = `
varying vec3 vNormal;
varying vec3 vPosition;
uniform vec3 uColorA;
uniform vec3 uColorB;

void main() {
    float light = max(dot(normalize(vNormal), normalize(vec3(0.45, 0.8, 1.0))), 0.0);
    float blend = smoothstep(-1.0, 1.0, vPosition.y);
    vec3 color = mix(uColorA, uColorB, blend);
    color *= 0.55 + light * 0.8;
    gl_FragColor = vec4(color, 0.94);
}
`;
