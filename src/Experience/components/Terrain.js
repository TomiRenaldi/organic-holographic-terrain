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
        this.texture.width = 32
        this.texture.height = 128
        this.texture.canvas = document.createElement('canvas')
        this.texture.canvas.width = this.texture.width
        this.texture.canvas.height = this.texture.height
        this.texture.canvas.style.position = 'fixed'
        this.texture.canvas.style.top = 0
        this.texture.canvas.style.left = 0
        this.texture.canvas.style.zIndex = 1
        this.texture.context = this.texture.canvas.getContext('2d')
        document.body.append(this.texture.canvas)
        this.texture.context.fillStyle = 'red'
        this.texture.context.fillRect(0, 0, this.texture.width, this.texture.height)

        this.texture.instance = new THREE.CanvasTexture(this.texture.canvas)
        this.texture.instance.wrapS = THREE.RepeatWrapping
        this.texture.instance.wrapT = THREE.RepeatWrapping
    }

    setTerrain()
    {
        this.terrain = {}

        this.terrain.geometry = new THREE.PlaneGeometry(1, 1, 100, 100)
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