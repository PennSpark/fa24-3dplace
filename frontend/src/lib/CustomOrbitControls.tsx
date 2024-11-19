// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DOMElement } from "react";
import { OrbitControls } from "./OrbitControls.js";

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

export class CustomOrbitControls extends OrbitControls {
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

    constructor(camera, domElement) {
        super(camera, domElement);
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

        window.addEventListener('keyup', (event) => this._handleKeyUp(event));
        window.addEventListener('keydown', (event) => this._handleKeyDown(event));
    }

    _rotateUp(amount: number) {
        if (typeof super._rotateUp === 'function') {
            super._rotateUp(amount);
        } else {
            console.warn('Rotate up method is not accessible.');
        }
    }


    _getZoomScale(delta: number) {
        const normalizedDelta = Math.abs(delta * 0.01);
        return Math.pow(0.95, this.zoomSpeed * normalizedDelta);
    }

    _rotateLeft(amount: number) {
        if (typeof super._rotateLeft === 'function') {
            super._rotateLeft(amount);
        } else {
            console.warn('Rotate left method is not accessible.');
        }
    }

    _pan(x: number, y: number) {
        if (typeof super._pan === 'function') {
            super._pan(x, y);
        } else {
            console.warn('Pan method is not accessible.');
        }
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
                        this._rotateUp(this.currentSpeed);
                    }
                    needsUpdate = true;
                    break;
                case keys.UP:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) {
                        this._rotateUp(rotateAmount);
                    } else {
                        this._pan(0, panAmount);
                    }
                    needsUpdate = true;
                    break;
    
                case _KEYASSIGNMENTS.DOWN:
                    if (event.shiftKey) {
                        this._pan(0, -panAmount);
                    } else {
                        this._rotateUp(-this.currentSpeed);
                    }
                    needsUpdate = true;
                    break;
                case keys.BOTTOM:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) {
                        this._rotateUp(-rotateAmount);
                    } else {
                        this._pan(0, -panAmount);
                    }
                    needsUpdate = true;
                    break;
    
                case _KEYASSIGNMENTS.LEFT:
                    if (event.shiftKey) {
                        this._pan(panAmount, 0);
                    } else {
                        this._rotateLeft(this.currentSpeed);
                    }
                    needsUpdate = true;
                    break;
    
                case keys.LEFT:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) {
                        this._rotateLeft(rotateAmount);
                    } else {
                        this._pan(panAmount, 0);
                    }
                    needsUpdate = true;
                    break;
    
                case _KEYASSIGNMENTS.RIGHT:
                    if (event.shiftKey) {
                        this._pan(-panAmount, 0);
                    } else {
                        this._rotateLeft(-this.currentSpeed);
                    }
                    needsUpdate = true;
                    break;
                case keys.RIGHT:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) {
                        this._rotateLeft(-rotateAmount);
                    } else {
                        this._pan(-panAmount, 0);
                    }
                    needsUpdate = true;
                    break;
    
                case 'KeyZ':
                    this.enableZoom = true;
                    needsUpdate = true;
                    break;
            }
    
            if (needsUpdate) {
                event.preventDefault();
                this.movementUpdate();
            }
        } catch (error) {
            console.error("An error occurred in _handleKeyDown:", error);
        }
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
