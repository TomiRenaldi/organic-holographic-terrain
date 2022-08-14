varying float vElevation;

#pragma glslify: perlin3d = require('../partials/perlin3d.glsl')

float getEleveation(vec3 _position)
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

    elevation *= 2.0;

    return elevation;
}

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = getEleveation(modelPosition.xyz);

    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    vElevation = elevation;
}