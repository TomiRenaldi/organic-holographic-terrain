uniform sampler2D uTexture;

varying float vElevation;

void main()
{
    vec4 textureColor = texture2D(uTexture, vec2(0, vElevation * 15.0));

    // float alpha = mod(vElevation * 10.0, 1.0);
    // alpha = step(0.95, alpha);

    gl_FragColor = textureColor;
}