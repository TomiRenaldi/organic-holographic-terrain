uniform vec3 uSchemaColor;
uniform float uSchemaMultiplier;
uniform float uSchemaOffset;
// uniform vec3 uOverlayColor;
// uniform float uOverlayAlpha;

varying vec2 vUv;

void main()
{
    float distanceToCenter = smoothstep(0.0, 1.0, length(vUv - 0.5));

    float alpha = distanceToCenter * uSchemaMultiplier + uSchemaOffset;

    gl_FragColor = vec4(uSchemaColor, alpha);
}