uniform float uElevation;
uniform float uElevationTerrainFrequency;
uniform float uElevationTerrain;
uniform float uElevationGeneral;
uniform float uElevationGeneralFrequency;
uniform float uElevationDetails;
uniform float uElevationDetailsFrequency;

#pragma glslify: perlin2d = require('../partials/perlin2d.glsl')

float getElevation(vec2 _position)
{
    float elevation = 0.0;

    // Valley
    float terrainStrength = cos(_position.y * uElevationTerrainFrequency + 3.1415) * 0.5 + 0.5;
    elevation += terrainStrength * uElevationTerrain;

    // General elevation
    elevation += perlin2d(_position * uElevationGeneralFrequency) * uElevationGeneral * (terrainStrength + 0.1);
    
    // Smaller details
    elevation += perlin2d(_position * uElevationDetailsFrequency + 123.0) * uElevationDetails * (terrainStrength + 0.1);

    elevation *= uElevation;

    return elevation;
}

#pragma glslify: export(getElevation)