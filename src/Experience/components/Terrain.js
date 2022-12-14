import * as THREE from 'three'
import Experience from '../Experience.js'

import vertexShader from '../shaders/terrain/vertex.glsl'
import fragmentShader from '../shaders/terrain/fragment.glsl'

import vertexDepthShader from '../shaders/terrainDepth/vertex.glsl'
import fragmentDepthShader from '../shaders/terrainDepth/fragment.glsl'

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
                title: 'terrain',
                expanded: false
            })
        }

        this.setTexture()
        this.setTerrain()
    }

    setTexture()
    {
        this.texture = {}
        this.texture.visible = false
        this.texture.linesCount = 10
        this.texture.bigLineWidth = 0.03   
        this.texture.smallLineWidth = 0.01
        this.texture.smallLineAlpha = 0.1
        this.texture.width = 1
        this.texture.height = 128
        this.texture.canvas = document.createElement('canvas')
        this.texture.canvas.width = this.texture.width
        this.texture.canvas.height = this.texture.height
        this.texture.canvas.style.position = 'fixed'
        this.texture.canvas.style.top = 0
        this.texture.canvas.style.left = 0
        this.texture.canvas.style.zIndex = 1
        this.texture.canvas.style.width = '50px'
        this.texture.canvas.style.height = `${this.texture.height}px`

        if (this.texture.visible)
        {
            document.body.append(this.texture.canvas)
        }

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
                this.texture.context.fillStyle = '#00ffff'
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
                title: 'terrainTexture',
                expanded: false
            })
            
            debugFolder.addInput(
                this.texture,
                'visible',
            )
            .on('change', () =>
            {
                if (this.texture.visible)
                {
                    document.body.append(this.texture.canvas)    
                }
                else
                { 
                    document.body.removeChild(this.texture.canvas)
                }
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
        this.terrain.geometry = new THREE.PlaneGeometry(1, 1, 800, 800)
        this.terrain.geometry.rotateX(- Math.PI * 0.5)

        this.terrain.hampura = {
            uTexture: { value: this.texture.instance },
            uTextureFrequency: { value: 15.0 },
            uTextureOffset: { value: 0 },
            uElevation: { value: 2.0 },
            uElevationTerrain: { value: 0.4 },
            uElevationTerrainFrequency: { value: 1.5 },
            uElevationGeneral: { value: 0.2 },
            uElevationGeneralFrequency: { value: 0.2 },
            uElevationDetails: { value: 0.2 },
            uElevationDetailsFrequency: { value: 2.012 },
            uTime: { value: 0 },
            uHslHue: { value: 1.0 },
            uHslHueOffset: { value: 0.0 },
            uHslHueFrequency: { value: 10.0 },
            uHslTimeFrequency: { value: 0.040 },
            uHslLightness: { value: 0.55 },
            uHslLightnessVariation: { value: 0.25 },
            uHslLightnessFrequency: { value: 20.0 }
        }
        
        // Material
        this.terrain.material = new THREE.ShaderMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: this.terrain.hampura
        })

        // Debug unforms
        if (this.debug)
        {
            const debugFolder = this.debugFolder.addFolder({
                title: 'material',
                expanded: false
            })

            debugFolder.addInput(
                this.terrain.hampura.uElevation,
                'value',
                { label: 'uElevation', min: 0, max: 5, step: 0.001 }
            )

            debugFolder.addInput(
                this.terrain.hampura.uTextureFrequency,
                'value',
                { label: 'uTextureFrequency', min: 0.01, max: 50, step: 0.01 }
            )

            debugFolder.addInput(
                this.terrain.hampura.uTextureOffset,
                'value',
                { label: 'uTextureOffset', min: 0, max: 1, step: 0.001 }
            )

            debugFolder.addInput(
                this.terrain.hampura.uHslHue,
                'value',
                { label: 'uHslHue', min: 0, max: 1, step: 0.001 }
            )

            debugFolder.addInput(
                this.terrain.hampura.uHslHueOffset,
                'value',
                { label: 'uHslHueOffset', min: 0, max: 1, step: 0.001 }
            )

            debugFolder.addInput(
                this.terrain.hampura.uHslHueFrequency,
                'value',
                { label: 'uHslHueFrequency', min: 0, max: 50, step: 0.01 }
            )

            debugFolder.addInput(
                this.terrain.hampura.uHslTimeFrequency,
                'value',
                { label: 'uHslTimeFrequency', min: 0, max: 0.2, step: 0.001 }
            )

            debugFolder.addInput(
                this.terrain.hampura.uHslLightness,
                'value',
                { label: 'uHslLightness', min: 0, max: 1, step: 0.001 }
            )
            
            debugFolder.addInput(
                this.terrain.hampura.uHslLightnessVariation,
                'value',
                { label: 'uHslLightnessVariation', min: 0, max: 1, step: 0.001 }
            )

            debugFolder.addInput(
                this.terrain.hampura.uHslLightnessFrequency,
                'value',
                { label: 'uHslLightnessFrequency', min: 0, max: 50, step: 0.01 }
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
        this.terrain.hampura.uTime.value = this.time.elapsed * 0.001
    }
}