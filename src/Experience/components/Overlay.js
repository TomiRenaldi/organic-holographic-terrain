import * as THREE from 'three'
import Experience from '../Experience.js'

import vertexShader from '../shaders/overlay/vertex.glsl'
import fragmentShader from '../shaders/overlay/fragment.glsl'

export default class Overlay
{
    constructor ()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.camera = this.experience.camera
        this.renderer = this.experience.renderer
        this.config = this.experience.config

        // Debug
        if (this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'overlay',
                expanded: false
            })
        }

        this.setOverlay()
    }

    setOverlay()
    {
        this.overlay = {}

        this.overlay.color = {}
        this.overlay.color.value = '#a5a5a5'
        this.overlay.color.instance = new THREE.Color(this.overlay.color.value)

        if (this.debug)
        {
            const debugFolder = this.debugFolder.addFolder({
                title: 'color'
            })

            debugFolder.addInput(
                this.overlay.color,
                'value',
                {
                    view: 'color'
                }
            )
            .on('change', () => {
                this.overlay.color.instance.set(this.overlay.color.value)    
            })
        }

        this.overlay.uniforms = {
            uSchemaColor: { value: this.overlay.color.instance },
            uSchemaMultiplier: { value: 0.435 },
            uSchemaOffset: { value: -0.043 },
        }

        if (this.debug)
        { 
            const debugFolder = this.debugFolder.addFolder({
                title: 'material'
            })

            debugFolder.addInput(
                this.overlay.uniforms.uSchemaMultiplier,
                'value',
                { label: 'uSchemaMultiplier', min: 0, max: 5, step: 0.001 }
            )

            debugFolder.addInput(
                this.overlay.uniforms.uSchemaOffset,
                'value',
                { label: 'uSchemaOffset', min: -2, max: 2, step: 0.001 }
            )
        }

        this.overlay.geometry = new THREE.PlaneGeometry(2, 2) 

        this.overlay.material = new THREE.ShaderMaterial({
            uniforms: this.overlay.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            depthTest: false
        })

        this.overlay.mesh = new THREE.Mesh(this.overlay.geometry, this.overlay.material)
        this.overlay.mesh.userData.noBokeh = true
        this.overlay.mesh.frustumCulled = false
        this.scene.add(this.overlay.mesh)
    }

    update()
    {
    }
}