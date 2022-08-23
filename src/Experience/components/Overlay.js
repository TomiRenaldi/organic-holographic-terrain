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

        // Debug
        if (this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'overlay',
            })
        }

        this.setOverlay()
        this.setView()
    }

    setOverlay()
    {
        this.overlay = {}

        this.overlay.colorA = {}
        this.overlay.colorA.value = '#5c5c5c'
        this.overlay.colorA.instance = new THREE.Color(this.overlay.colorA.value)

        // this.overlay.colorB = {}
        // this.overlay.colorB.value = '#000fff'
        // this.overlay.colorB.instance = new THREE.Color(this.overlay.colorB.value)

        if (this.debug)
        {
            const debugFolder = this.debugFolder.addFolder({
                title: 'color'
            })

            debugFolder.addInput(
                this.overlay.colorA,
                'value',
                {
                    view: 'color'
                }
            )
            .on('change', () => {
                this.overlay.colorA.instance.set(this.overlay.colorA.value)    
            })

            // debugFolder.addInput(
            //     this.overlay.colorB,
            //     'value',
            //     {
            //         view: 'color'
            //     }
            // )
            // .on('change', () => {
            //     this.overlay.colorB.instance.set(this.overlay.colorB.value)    
            // })
        }

        this.overlay.uniforms = {
            uSchemaColor: { value: this.overlay.colorA.instance },
            uSchemaMultiplier: { value: 0.815 },
            uSchemaOffset: { value: - 0.043 },
            // uOverlayColor: { value: this.overlay.colorB.instance },
            // uOverlayAlpha: { value: 1 }
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

            // debugFolder.addInput(
            //     this.overlay.uniforms.uOverlayAlpha,
            //     'value',
            //     { label: 'uOverlayAlpha', min: 0, max: 1, step: 0.001 }
            // )
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

    setView()
    {
        this.view = {}
        this.view.index = 0
        this.view.settings = [
            {
                position: { x: 0, y: 2.124, z: - 0.172 },
                rotation: { x: -1.489, y: - Math.PI, z: 0 },
                focus: 2.14,
                parallaxMultiplier: 0.25
            },

            {
                position: { x: 1, y: 1.1, z: 0 },
                rotation: { x: -0.833, y: 1.596, z: 1.651 },
                focus: 1.1,
                parallaxMultiplier: 0.12
            },

            {
                position: { x: 1, y: 0.87, z: - 0.97 },
                rotation: { x: - 0.638, y: 2.33, z: 0 },
                focus: 1.36,
                parallaxMultiplier: 0.12
            },

            {
                position: { x: -1.43, y: 0.33, z: -0.144 },
                rotation: { x: -0.312, y: -1.67, z: 0 },
                focus: 1.25,
                parallaxMultiplier: 0.12
            }
        ]

        this.view.current = this.view.settings[this.view.index]

        // Parallax
        this.view.parallax = {}

        this.view.parallax.target = {}
        this.view.parallax.target.x = 0
        this.view.parallax.target.y = 0

        this.view.parallax.eased = {}
        this.view.parallax.eased.x = 0
        this.view.parallax.eased.y = 0
        this.view.parallax.eased.multiplier = 4

        // Apply
        this.view.apply = () => 
        {
            // camera
            this.camera.position.copy(this.view.current.position)
            this.camera.rotation.x = this.view.current.rotation.x
            this.camera.rotation.y = this.view.current.rotation.y

            // Bokeh
            this.renderer.postProcess.bokehPass.materialBokeh.uniforms.focus.value = this.current.focus

            // Parallax
            this.view.parallax.multiplier = this.view.current.parallaxMultiplier
        }

        // Change
        this.view.change = (_index) => 
        {
            this.view = _index
            this.view.current = this.view.settings[_index]
        }
    }
}