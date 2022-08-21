import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Overlay
{
    constructor ()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setOverlay()
    }

    setOverlay()
    {
        this.overlay = {}
        this.overlay.geometry = new THREE.PlaneGeometry(1, 1, 1, 1) 
        this.overlay.material = new THREE.MeshBasicMaterial({ color: '#0000ff' })
        this.overlay.mesh = new THREE.Mesh(this.overlay.geometry, this.overlay.material)
        this.scene.add(this.overlay.mesh)
    }
}