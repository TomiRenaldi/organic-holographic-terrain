import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Holographic
{
    constructor ()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setTerrain()
    }

    setTerrain()
    {
        this.terrain = {}

        this.terrain.geometry = new THREE.PlaneGeometry(1, 1, 100, 100)
        this.terrain.geometry.rotateX(- Math.PI * 0.5)

        this.terrain.material = new THREE.MeshBasicMaterial({ color: '#ffffff' })

        this.terrain.mesh = new THREE.Mesh(this.terrain.geometry, this.terrain.material)
        this.terrain.mesh.scale.set(10, 10, 10)
        this.scene.add(this.terrain.mesh)
    }
}