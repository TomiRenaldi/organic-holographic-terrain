#pragma glslify: getElevation = require('../partials/getElevation.glsl')

varying float vElevation;

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