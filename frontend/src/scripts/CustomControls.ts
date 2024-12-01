// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Camera, Spherical } from "three";
import { useStateController } from "../helpers/StateProvider";

const _KEYASSIGNMENTS = {
    UP: "KeyW",
    DOWN: "KeyS",
    LEFT: "KeyA",
    RIGHT: "KeyD"
}

const keys = {
    LEFT: "ArrowLeft",
    UP: "ArrowUp",
    RIGHT: "ArrowRight",
    BOTTOM: "ArrowDown"
}

export class CustomControls extends OrbitControls {
    camera;
    domElement;
    acceleration;
    deceleration;
    isKeyDown;
    currentSpeed;
    decelerating;
    panSpeed;
    enableZoom;
    rotateSpeed;
    zoomSpeed;
    _sphericalDelta;

    constructor(camera: Camera, domElement: HTMLCanvasElement) {
        super(camera);
        this.camera = camera;
        this.domElement = domElement;
        this.acceleration = 0.0002;
        this.deceleration = 0.90;
        this.isKeyDown = false;
        this.currentSpeed = 0.02;
        this.decelerating = false;
        this.panSpeed = 1;
        this.enableZoom = true;
        this.zoomSpeed = 1;
        this.rotateSpeed = 1;
        this._sphericalDelta = new Spherical();

        window.addEventListener('keyup', (event) => this._handleKeyUp(event));
        window.addEventListener('keydown', (event) => this._handleKeyDown(event));
    }



    _getZoomScale(delta: number) {
        const normalizedDelta = Math.abs(delta * 0.01);
        return Math.pow(0.95, this.zoomSpeed * normalizedDelta);
    }


    _pan(x: number, y: number) {
        // @ts-ignore
        super._pan(x, y);
    }
    

    _handleKeyUp(event: KeyboardEvent) {
        this.isKeyDown = false;
        this.currentSpeed = 0.02;
        this.panSpeed = 0.5;
        // this._animateDeceleration();
    }
    _handleKeyDown(event: KeyboardEvent) {
        try {
            this.isKeyDown = true;
            let needsUpdate = false;
            const rotateAmount = (8 * Math.PI * this.rotateSpeed) / this.domElement.clientHeight;
            const panAmount = this.panSpeed;
    
            switch (event.code) {
                case _KEYASSIGNMENTS.UP:
                    if (event.shiftKey) {
                        this._pan(0, panAmount);
                    } else {
                        this.rotateUp(this.currentSpeed);
                    }
                    needsUpdate = true;
                    break;
                case keys.UP:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) {
                        this.rotateUp(rotateAmount);
                    } else {
                        this._pan(0, panAmount);
                    }
                    needsUpdate = true;
                    break;
    
                case _KEYASSIGNMENTS.DOWN:
                    if (event.shiftKey) {
                        this._pan(0, -panAmount);
                    } else {
                        this.rotateUp(-this.currentSpeed);
                    }
                    needsUpdate = true;
                    break;
                case keys.BOTTOM:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) {
                        this.rotateUp(-rotateAmount);
                    } else {
                        this._pan(0, -panAmount);
                    }
                    needsUpdate = true;
                    break;
    
                case _KEYASSIGNMENTS.LEFT:
                    if (event.shiftKey) {
                        this._pan(panAmount, 0);
                    } else {
                        this.rotateLeft(this.currentSpeed);
                    }
                    needsUpdate = true;
                    break;
    
                case keys.LEFT:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) {
                        this.rotateLeft(rotateAmount);
                    } else {
                        this._pan(panAmount, 0);
                    }
                    needsUpdate = true;
                    break;
    
                case _KEYASSIGNMENTS.RIGHT:
                    if (event.shiftKey) {
                        this._pan(-panAmount, 0);
                    } else {
                        this.rotateLeft(-this.currentSpeed);
                    }
                    needsUpdate = true;
                    break;
                case keys.RIGHT:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) {
                        this.rotateLeft(-rotateAmount);
                    } else {
                        this._pan(-panAmount, 0);
                    }
                    needsUpdate = true;
                    break;
    
                case 'KeyZ':
                    this.enableZoom = true;
                    needsUpdate = true;
                    break;
                case 'KeyH':
                    this.reset();
            }
    
            if (needsUpdate) {
                event.preventDefault();
                this.movementUpdate();
            }
        } catch (error) {
            console.error("An error occurred in _handleKeyDown:", error);
        }
    }
    
    rotateUp(angle: number) {
        this._sphericalDelta.phi -= angle;
    }

    rotateLeft(angle: number) {
        this._sphericalDelta.theta -= angle;
    }


    movementUpdate() {
        if (this.isKeyDown) {
            this.currentSpeed += this.acceleration; // Increase speed while key is down
            this.panSpeed += .2;
            this.update();
        }


        // Call the update function to render changes
    }

}

