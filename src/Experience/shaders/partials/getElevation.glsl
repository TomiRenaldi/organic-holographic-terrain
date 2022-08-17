uniform float uElevation;
uniform float uTime;

#pragma glslify: perlin3d = require('../partials/perlin3d.glsl')

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

#pragma glslify: export(getElevation)