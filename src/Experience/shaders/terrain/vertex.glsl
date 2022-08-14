#pragma glslify: perlin3d = require('../partials/perlin3d.glsl')

varying float vElevation;
uniform float uElevation;

float getElevation(vec3 _position)
{
    float elevation = 0.0;

    // General Elevation
    elevation += perlin3d(vec3(
        _position.xz * 0.3,
        0.0
    )) * 0.5;

    // Smaller Details
    elevation += perlin3d(vec3(
        (_position.xz + 123.0) * 1.0,
        0.0
    )) * 0.2;

    elevation *= uElevation;

    return elevation;
}

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = getElevation(modelPosition.xyz);

    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    vElevation = elevation;
}