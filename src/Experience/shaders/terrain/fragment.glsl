uniform sampler2D uTexture;
uniform float uTextureFrequency;
uniform float uHslHue;
uniform float uHslHueOffset;
uniform float uHslHueFrequency;
uniform float uHslLightness;
uniform float uHslLightnessVariation;
uniform float uHslLightnessFrequency;

varying float vElevation;
varying vec2 vUv;

#pragma glslify: getElevation = require('../partials/getElevation.glsl')
#pragma glslify: perlin2d = require('../partials/perlin2d.glsl')
#pragma glslify: getHslToRgb = require('../partials/getHslToRgb.glsl')

vec3 getRainbowColor()
{
    float hue = uHslHueOffset + perlin2d(vUv * uHslHueFrequency) * uHslHue;
    float lightness = uHslLightness + perlin2d(vUv * uHslLightnessFrequency + 1234.5) * uHslLightnessVariation;
    vec3 hslColor = vec3(hue, 1.0, lightness);  
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