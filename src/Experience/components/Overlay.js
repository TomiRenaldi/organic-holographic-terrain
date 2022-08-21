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

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder({
                title: 'overlay',
            })
        }

        this.setOverlay()
    }

    setOverlay()
    {
        this.overlay = {}

        this.overlay.color = {}
        this.overlay.color.value = '#5c5c5c'
        this.overlay.color.instance = new THREE.Color(this.overlay.color.value)

        if (this.debug) {
            this.debugFolder
                .addInput(
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
            uColor: { value: this.overlay.color.instance },
            uMultiplier: { value: 1 },
            uOffset: { value: 0 },
        }

        this.overlay.geometry = new THREE.PlaneGeometry(2, 2) 

        this.overlay.material = new THREE.ShaderMaterial({
            uniforms: this.overlay.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
        })

        this.overlay.mesh = new THREE.Mesh(this.overlay.geometry, this.overlay.material)
        this.overlay.mesh.userData.noBokeh = true
        this.overlay.mesh.frustumCulled = false
        this.scene.add(this.overlay.mesh)
    }
}