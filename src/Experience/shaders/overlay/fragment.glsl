uniform vec3 uSchemaColor;
uniform float uSchemaMultiplier;
uniform float uSchemaOffset;
uniform vec3 uOverlayColor;
uniform float uOverlayAlpha;

varying vec2 vUv;

void main()
{
    float distanceToCenter = smoothstep(0.0, 1.0, length(vUv - 0.5));

    float schemaStrength = clamp(distanceToCenter * uSchemaMultiplier + uSchemaOffset, 0.0, 1.0);

    vec3 colored = mix(uSchemaColor, uOverlayColor, (1.0 - schemaStrength) * uOverlayAlpha);

    float alpha = schemaStrength + uOverlayAlpha;

    gl_FragColor = vec4(colored, alpha);
}