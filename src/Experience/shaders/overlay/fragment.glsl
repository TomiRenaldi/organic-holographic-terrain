uniform vec3 uColor;
uniform float uMultiplier;
uniform float uOffset;

varying vec2 vUv;

void main()
{
    float distanceToCenter = length(vUv - 0.5);
    float alpha = distanceToCenter * uMultiplier + uOffset;
    gl_FragColor = vec4(uColor, alpha);
}