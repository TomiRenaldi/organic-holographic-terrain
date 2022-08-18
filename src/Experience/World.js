import Experience from './Experience.js'
import Terrain from './components/Terrain.js'

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
            }
        })
    }

    setTerrain()
    {
        this.terrain = new Terrain()        
    }

    resize()
    {
    }

    update()
    {
        if (this.terrain)
            this.terrain.update()
    }

    destroy()
    {
    }
}