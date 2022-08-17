import * as THREE from 'three'
import Experience from '../Experience.js'

import vertexShader from '../shaders/terrain/vertex.glsl'
import fragmentShader from '../shaders/terrain/fragment.glsl'

import vertexDepthShader from '../shaders/terrain/vertex.glsl'
import fragmentDepthShader from '../shaders/terrain/fragment.glsl'

export default class Terrain
{
    constructor ()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.time = this.experience.time

        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'terrain'
            })
        }

        this.setTexture()
        this.setTerrain()
    }

    setTexture()
    {
        this.texture = {}
        this.texture.linesCount = 8
        this.texture.bigLineWidth = 0.1
        this.texture.smallLineWidth = 0.02
        this.texture.smallLineAlpha = 0.2
        this.texture.width = 32
        this.texture.height = 128
        this.texture.canvas = document.createElement('canvas')
        this.texture.canvas.width = this.texture.width
        this.texture.canvas.height = this.texture.height
        this.texture.canvas.style.position = 'fixed'
        this.texture.canvas.style.top = 0
        this.texture.canvas.style.left = 0
        this.texture.canvas.style.zIndex = 1
        document.body.append(this.texture.canvas)

        this.texture.context = this.texture.canvas.getContext('2d')

        this.texture.instance = new THREE.CanvasTexture(this.texture.canvas)
        this.texture.instance.wrapS = THREE.RepeatWrapping
        this.texture.instance.wrapT = THREE.RepeatWrapping
        this.texture.instance.magFilter = THREE.NearestFilter

        this.texture.update = () =>
        {
            this.texture.context.clearRect(0, 0, this.texture.width, this.texture.height)
            
            // Big lines
            const actualBigLineWidth = Math.round(this.texture.height * this.texture.bigLineWidth)
            this.texture.context.globalAlpha = 1
            this.texture.context.fillStyle = '#ffffff'

            this.texture.context.fillRect(
                0,
                0,
                this.texture.width,
                actualBigLineWidth
            )

            // Small lines
            const actualSmallLineWidth = Math.round(this.texture.height * this.texture.smallLineWidth)
            const smallLinesCount = this.texture.linesCount - 1

            for (let i = 0; i < smallLinesCount; i++)
            {
                this.texture.context.globalAlpha = this.texture.smallLineAlpha
                this.texture.context.fillRect(
                    0,
                    actualBigLineWidth + Math.round((this.texture.height - actualBigLineWidth) / this.texture.linesCount) * (i + 1),
                    this.texture.width,
                    actualSmallLineWidth
                )
            }
            // Update texture instance
            this.texture.instance.needsUpdate = true
        }

        // Update set texture
        this.texture.update()

        // Debug Texture
        if (this.debug)
        {
            const debugFolder = this.debugFolder.addFolder({
                title: 'terrainTexture'
            })
            
            debugFolder.addInput(
                this.texture,
                'linesCount',
                {
                    min: 1, max: 10, step: 1,
                }
            )
            .on('change', () =>
            {
                this.texture.update()
            })

            debugFolder.addInput(
                this.texture,
                'bigLineWidth',
                {
                    min: 0,
                    max: 0.5,
                    step: 0.0001,
                }
            )
            .on('change', () => 
            {
                this.texture.update()    
            })

            debugFolder.addInput(
                this.texture,
                'smallLineWidth',
                {
                    min: 0,
                    max: 0.2,
                    step: 0.0001,
                }
            )
            .on('change', () => 
            {
                this.texture.update()    
            })

            debugFolder.addInput(
                this.texture,
                'smallLineAlpha',
                {
                    min: 0,
                    max: 1,
                    step: 0.01,
                }
            )
            .on('change', () => 
            {
                this.texture.update()    
            })
        }
    }

    setTerrain()
    {
        this.terrain = {}

        // Geometry
        this.terrain.geometry = new THREE.PlaneGeometry(1, 1, 500, 500)
        this.terrain.geometry.rotateX(- Math.PI * 0.5)

        // Material
        this.terrain.material = new THREE.ShaderMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uTexture: { value: this.texture.instance },
                uTextureFrequency: { value: 15.0 },
                uElevation: { value: 2.0 },
                uTime: { value: 0 }
            }
        })

        // Debug unforms
        if (this.debug)
        {
            const debugFolder = this.debugFolder.addFolder({
                title: 'material'
            })

            debugFolder.addInput(
                this.terrain.material.uniforms.uElevation,
                'value',
                { label: 'uElevation', min: 0, max: 5, step: 0.001 }
            )

            debugFolder.addInput(
                this.terrain.material.uniforms.uTextureFrequency,
                'value',
                { label: 'uTextureFrequency', min: 0.01, max: 50, step: 0.01 }
            )
        }

        // Depth material
        this.terrain.uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib.common,
            THREE.UniformsLib.displacementmap
        ])

        this.terrain.depthMaterial = new THREE.ShaderMaterial({
            uniforms: this.terrain.uniforms,
            vertexShader: vertexDepthShader, 
            fragmentShader: fragmentDepthShader 
        })

        for (const uniformsKey in this.terrain.uniforms)
        {
            this.terrain.uniforms[uniformsKey] = this.terrain.uniforms[uniformsKey]  
        }
        this.terrain.depthMaterial.depthPacking = THREE.RGBADepthPacking
        this.terrain.depthMaterial.blending = THREE.NoBlending

        // Mesh
        this.terrain.mesh = new THREE.Mesh(this.terrain.geometry, this.terrain.material)
        this.terrain.mesh.userData.depthMaterial = this.terrain.depthMaterial
        this.terrain.mesh.scale.set(10, 10, 10)
        this.scene.add(this.terrain.mesh)
    }

    update()
    {
        // Update terrain
        this.terrain.material.uniforms.uTime.value = this.time.elapsed * 0.0005
    }
}