uniform float uElevation;

#pragma glslify: perlin2d = require('../partials/perlin2d.glsl')

float getElevation(vec2 _position)
{
    float elevation = 0.0;

    // General Elevation
    elevation += perlin2d(_position * 0.3) * 0.5;

    // Smaller Details
    elevation += perlin2d(_position + 123.0) * 0.2;

    elevation *= uElevation;

    return elevation;
}

#pragma glslify: export(getElevation)