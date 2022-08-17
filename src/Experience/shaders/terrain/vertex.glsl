#pragma glslify: perlin3d = require('../partials/perlin3d.glsl')

uniform float uElevation;
uniform float uTime;

varying float vElevation;

float getElevation(vec2 _position)
{
    float elevation = 0.0;

    // Position
    vec2 position = _position;
    position.x += uTime * 0.03;
    position.y += uTime * 0.1;

    // General Elevation
    elevation += perlin3d(vec3(
        position * 0.3,
        0.0
    )) * 0.5;

    // Smaller Details
    elevation += perlin3d(vec3(
        (position + 123.0) * 1.0,
        0.0
    )) * 0.2;

    elevation *= uElevation;

    return elevation;
}

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = getElevation(modelPosition.xz);

    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    vElevation = elevation;
}