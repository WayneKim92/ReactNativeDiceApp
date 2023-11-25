import { Matrix } from "../Maths/math.vector.js";

import { ShaderMaterial } from "../Materials/shaderMaterial.js";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture.js";
import { Color4 } from "../Maths/math.color.js";
import "../Shaders/meshUVSpaceRenderer.vertex.js";
import "../Shaders/meshUVSpaceRenderer.fragment.js";
/**
 * Class used to render in the mesh UV space
 * @since 5.49.1
 */
export class MeshUVSpaceRenderer {
    static _GetShader(scene) {
        if (!scene._meshUVSpaceRendererShader) {
            const shader = new ShaderMaterial("meshUVSpaceRendererShader", scene, {
                vertex: "meshUVSpaceRenderer",
                fragment: "meshUVSpaceRenderer",
            }, {
                attributes: ["position", "normal", "uv"],
                uniforms: ["world", "projMatrix"],
                samplers: ["textureSampler"],
                needAlphaBlending: true,
            });
            shader.backFaceCulling = false;
            shader.alphaMode = 2;
            scene.onDisposeObservable.add(() => {
                var _a;
                (_a = scene._meshUVSpaceRendererShader) === null || _a === void 0 ? void 0 : _a.dispose();
                scene._meshUVSpaceRendererShader = null;
            });
            scene._meshUVSpaceRendererShader = shader;
        }
        return scene._meshUVSpaceRendererShader;
    }
    static _IsRenderTargetTexture(texture) {
        return texture.renderList !== undefined;
    }
    /**
     * Creates a new MeshUVSpaceRenderer
     * @param mesh The mesh used for the source UV space
     * @param scene The scene the mesh belongs to
     * @param options The options to use when creating the texture
     */
    constructor(mesh, scene, options) {
        this._textureCreatedInternally = false;
        /**
         * Clear color of the texture
         */
        this.clearColor = new Color4(0, 0, 0, 0);
        this._mesh = mesh;
        this._scene = scene;
        this._options = Object.assign({ width: 1024, height: 1024, textureType: 0, generateMipMaps: true, optimizeUVAllocation: true }, options);
    }
    /**
     * Checks if the texture is ready to be used
     * @returns true if the texture is ready to be used
     */
    isReady() {
        if (!this.texture) {
            this._createDiffuseRTT();
        }
        return MeshUVSpaceRenderer._IsRenderTargetTexture(this.texture) ? this.texture.isReadyForRendering() : this.texture.isReady();
    }
    /**
     * Projects and renders a texture in the mesh UV space
     * @param texture The texture
     * @param position The position of the center of projection (world space coordinates)
     * @param normal The direction of the projection (world space coordinates)
     * @param size The size of the projection
     * @param angle The rotation angle around the direction of the projection
     */
    renderTexture(texture, position, normal, size, angle = 0) {
        if (!this.texture) {
            this._createDiffuseRTT();
        }
        if (MeshUVSpaceRenderer._IsRenderTargetTexture(this.texture)) {
            const matrix = this._createProjectionMatrix(position, normal, size, angle);
            const shader = MeshUVSpaceRenderer._GetShader(this._scene);
            shader.setTexture("textureSampler", texture);
            shader.setMatrix("projMatrix", matrix);
            this.texture.render();
        }
    }
    /**
     * Clears the texture map
     */
    clear() {
        if (MeshUVSpaceRenderer._IsRenderTargetTexture(this.texture) && this.texture.renderTarget) {
            const engine = this._scene.getEngine();
            engine.bindFramebuffer(this.texture.renderTarget);
            engine.clear(this.clearColor, true, true, true);
            engine.unBindFramebuffer(this.texture.renderTarget);
        }
    }
    /**
     * Disposes of the ressources
     */
    dispose() {
        if (this._textureCreatedInternally) {
            this.texture.dispose();
            this._textureCreatedInternally = false;
        }
    }
    _createDiffuseRTT() {
        this._textureCreatedInternally = true;
        const texture = this._createRenderTargetTexture(this._options.width, this._options.height);
        texture.setMaterialForRendering(this._mesh, MeshUVSpaceRenderer._GetShader(this._scene));
        this.texture = texture;
    }
    _createRenderTargetTexture(width, height) {
        const rtt = new RenderTargetTexture(this._mesh.name + "_uvspaceTexture", { width, height }, this._scene, this._options.generateMipMaps, true, this._options.textureType, false, this._options.generateMipMaps ? 3 : 2, false, false, false, 5);
        rtt.renderParticles = false;
        rtt.optimizeUVAllocation = !!this._options.optimizeUVAllocation;
        rtt.onClearObservable.addOnce(() => {
            this._scene.getEngine().clear(this.clearColor, true, true, true);
            rtt.onClearObservable.add(() => { }); // this disables clearing the texture for the next frames
        });
        rtt.renderList = [this._mesh];
        return rtt;
    }
    _createProjectionMatrix(position, normal, size, angle = 0) {
        const yaw = -Math.atan2(normal.z, normal.x) - Math.PI / 2;
        const len = Math.sqrt(normal.x * normal.x + normal.z * normal.z);
        const pitch = Math.atan2(normal.y, len);
        const p = position.add(normal.scale(size.z * 0.5));
        const projWorldMatrix = Matrix.RotationYawPitchRoll(yaw, pitch, angle).multiply(Matrix.Translation(p.x, p.y, p.z));
        const inverseProjWorldMatrix = Matrix.Invert(projWorldMatrix);
        const projMatrix = Matrix.FromArray([2 / size.x, 0, 0, 0, 0, 2 / size.y, 0, 0, 0, 0, 1 / size.z, 0, 0, 0, 0, 1]);
        const screenMatrix = Matrix.FromArray([0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 1, 0, 0.5, 0.5, 0.0, 1]);
        return inverseProjWorldMatrix.multiply(projMatrix).multiply(screenMatrix);
    }
}
//# sourceMappingURL=meshUVSpaceRenderer.js.map