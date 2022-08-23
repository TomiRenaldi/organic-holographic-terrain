import Experience from './Experience.js'
import Terrain from './components/Terrain.js'
import Overlay from './components/Overlay.js'

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
                this.setTerrain()
                this.setOverlay()
            }
        })
    }

    setTerrain()
    {
        this.terrain = new Terrain()        
    }

    setOverlay()
    {
        this.overlay = new Overlay()        
    }

    resize()
    {
    }

    update()
    {
        if (this.terrain)
            this.terrain.update()
        
        if (this.overlay)
            this.overlay.update()
    }

    destroy()
    {
    }
}