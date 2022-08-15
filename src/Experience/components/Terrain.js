import * as THREE from 'three'
import Experience from '../Experience.js'

import vertexShader from '../shaders/terrain/vertex.glsl'
import fragmentShader from '../shaders/terrain/fragment.glsl'

export default class Terrain
{
    constructor ()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setTexture()
        this.setTerrain()
    }

    setTexture()
    {
        this.texture = {}
        this.texture.linesCount = 5
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

        this.texture.update = () =>
        {
            this.texture.context.clearRect(0, 0, this.texture.width, this.texture.height)
            
            // Big lines
            this.texture.context.globalAlpha = 1
            this.texture.context.fillStyle = '#ffffff'

            this.texture.context.fillRect(
                0,
                0,
                this.texture.width,
                Math.round(this.texture.height * 0.05)
            )

            // Small lines
            this.texture.smallLinesCount = this.texture.linesCount - 1

            for (let i = 0; i < this.texture.smallLinesCount; i++)
            {
                this.texture.context.globalAlpha = 0.5
                this.texture.context.fillRect(
                    0,
                    Math.round(this.texture.height / this.texture.linesCount) * (i + 1),
                    this.texture.width,
                    Math.round(this.texture.height * 0.02)
                )
            }
        }

        this.texture.update()
    }

    setTerrain()
    {
        this.terrain = {}

        this.terrain.geometry = new THREE.PlaneGeometry(1, 1, 1000, 1000)
        this.terrain.geometry.rotateX(- Math.PI * 0.5)

        this.terrain.material = new THREE.ShaderMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uTexture: { value: this.texture.instance },
                uElevation: { value: 2 }
            }
        })

        this.terrain.mesh = new THREE.Mesh(this.terrain.geometry, this.terrain.material)
        this.terrain.mesh.scale.set(10, 10, 10)
        this.scene.add(this.terrain.mesh)
    }
}