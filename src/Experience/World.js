import * as THREE from 'three'
import Experience from './Experience.js'
import Holographic from './components/Holographic.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setHolographic()
            }
        })
    }

    setHolographic()
    {
        this.holographic = new Holographic()        
    }

    resize()
    {
    }

    update()
    {
    }

    destroy()
    {
    }
}