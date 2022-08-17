uniform sampler2D uTexture;
uniform float uTextureFrequency;

varying float vElevation;
varying vec2 vUv;

#pragma glslify: getElevation = require('../partials/getElevation.glsl')
#pragma glslify: perlin3d = require('../partials/perlin3d.glsl')
#pragma glslify: getHslToRgb = require('../partials/getHslToRgb.glsl')

vec3 getRainbowColor()
{
    float hue = perlin3d(vec3(vUv, 0.0));
    vec3 hslColor = vec3(0.0, 1.0, 0.5);
    vec3 rainbowColor = getHslToRgb(hslColor);
    return rainbowColor;
}

void main()
{
    vec3 uColor = vec3(1.0, 1.0, 1.0);

    vec3 rainbowColor = getRainbowColor();
    vec4 textureColor = texture2D(uTexture, vec2(0, vElevation * uTextureFrequency));

    // float alpha = mod(vElevation * 10.0, 1.0);
    // alpha = step(0.95, alpha);

    vec3 color = mix(uColor, rainbowColor, textureColor.r);

    gl_FragColor = vec4(color, textureColor.a);
}