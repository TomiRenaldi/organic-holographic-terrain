import * as THREE from 'three'
import Experience from './Experience.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { BokehPass } from '../Experience/passes/BokehPass.js'

export default class Renderer
{
    constructor (_options = {})
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.stats = this.experience.stats
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        // Debug
        if (this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'renderer'
            })
        }

        this.usePostprocess = true

        this.setInstance()
        this.setPostProcess()
    }

    setInstance() 
    {
        this.clearColor = '#010101'

        if (this.debug) 
        {
            this.debugFolder
                .addInput(
                    this,
                    'clearColor',
                    {
                        view: 'color'
                    }
                )
                .on('change', () => {
                    this.instance.setClearColor(this.clearColor, 1)
                })
        }

        // Renderer
        this.instance = new THREE.WebGLRenderer({
            alpha: false,
            antialias: true
        })

        this.instance.sortObjects = true

        this.instance.domElement.style.position = 'absolute'
        this.instance.domElement.style.top = 0
        this.instance.domElement.style.left = 0
        this.instance.domElement.style.width = '100%'
        this.instance.domElement.style.height = '100%'

        this.instance.setClearColor(this.clearColor, 1)
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        this.instance.outputEncoding = THREE.sRGBEncoding

        this.context = this.instance.getContext()

        // Add stats panel
        if (this.stats) 
        {
            this.stats.setRenderPanel(this.context)
        }
    }

    setPostProcess()
    {
        this.postProcess = {}

        /**
         * Render pass
         */
        this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance)

        /**
         * Bokeh pass
         */
        this.postProcess.bokehPass = new BokehPass(
            this.scene,
            this.camera.instance,
            {
                focus: 1.0,
                aperture: 0.015,
                maxblur: 0.01,

                width: this.config.width * this.config.pixelRatio,
                height: this.config.height * this.config.pixelRatio
            }
        )

        // Debug Bokeh
        if (this.debug)
        {
            const debugFolder = this.debugFolder.addFolder({
                title: 'bokehPass'
            })

            debugFolder.addInput(
                this.postProcess.bokehPass,
                'enabled'
            )

            debugFolder.addInput(
                this.postProcess.bokehPass.materialBokeh.uniforms.focus,
                'value',
                { label: 'focus', min: 0, max: 10, step: 0.001 }
            )

            debugFolder.addInput(
                this.postProcess.bokehPass.materialBokeh.uniforms.aperture,
                'value',
                { label: 'aperture', min: 0.0002, max: 0.1, step: 0.0001 }
            )

            debugFolder.addInput(
                this.postProcess.bokehPass.materialBokeh.uniforms.maxblur,
                'value',
                { label: 'maxblur', min: 0, max: 0.02, step: 0.0001 }
            )
        }

        /**
         * Effect composer
         */
        this.renderTarget = new THREE.WebGLRenderTarget(
            this.config.width,
            this.config.height,
            {
                generateMipmaps: false,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
                encoding: THREE.sRGBEncoding,
                samples: 2
            }
        )

        this.postProcess.composer = new EffectComposer(this.instance, this.renderTarget)
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)

        this.postProcess.composer.addPass(this.postProcess.renderPass)
        this.postProcess.composer.addPass(this.postProcess.bokehPass)
    }

    resize() 
    {
        // Instance
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        // Post process
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)

        // Bokeh passes
        this.postProcess.bokehPass.renderTargetDepth.width = this.config.width * this.config.pixelRatio
        this.postProcess.bokehPass.renderTargetDepth.height = this.config.height * this.config.pixelRatio
    }

    update() 
    {
        if (this.stats) 
        {
            this.stats.beforeRender()
        }

        if (this.usePostprocess) 
        {
            this.postProcess.composer.render()
        }
        else 
        {
            this.instance.render(this.scene, this.camera.instance)
        }

        if (this.stats) 
        {
            this.stats.afterRender()
        }
    }

    destroy() 
    {
        this.instance.renderLists.dispose()
        this.instance.dispose()
        this.renderTarget.dispose()
        this.postProcess.composer.renderTarget1.dispose()
        this.postProcess.composer.renderTarget2.dispose()
    }
}