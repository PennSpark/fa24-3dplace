// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from "./OrbitControls.js";

const _KEYASSIGNMENTS = {
    UP: "KeyW",
    DOWN: "KeyS",
    LEFT: "KeyA",
    RIGHT: "KeyD"
}

export class MyOrbitControls extends OrbitControls {
    camera;
    domElement;
    acceleration;
    deceleration;
    isKeyDown;
    currentSpeed;

    constructor(camera, domElement) {
        super(camera, domElement);
        this.camera = camera;
        this.domElement = domElement;
        this.acceleration = 0.002;
        this.deceleration = 0.90;
        this.isKeyDown = false;
        this.currentSpeed = 0.01;

        window.addEventListener('keyup', (event) => this._handleKeyUp(event));
    }

    _rotateUp(amount) {
        if (typeof super._rotateUp === 'function') {
            super._rotateUp(amount);
        } else {
            console.warn('Rotate up method is not accessible.');
        }
    }


    _getZoomScale(delta) {
        const normalizedDelta = Math.abs(delta * 0.01);
        return Math.pow(0.95, this.zoomSpeed * normalizedDelta);
    }

    _rotateLeft(amount) {
        if (typeof super._rotateLeft === 'function') {
            super._rotateLeft(amount);
        } else {
            console.warn('Rotate left method is not accessible.');
        }
    }

    _pan(x, y) {
        if (typeof super._pan === 'function') {
            super._pan(x, y);
        } else {
            console.warn('Pan method is not accessible.');
        }
    }

    _handleKeyUp(event) {
        let needsUpdate = false;
        // console.log("here")
        this.isKeyDown = false;
        this.currentSpeed = 0;

        while (this.currentSpeed >= 0.5) {
            switch (event.code) {
                case _KEYASSIGNMENTS.UP:
                    if (event.shiftKey) {
                        this._pan(0, panAmount);
                    } else {
                        // this._rotateUp(rotateAmount);
                        this._rotateUp(this.currentSpeed);
                    }
                    needsUpdate = true;
                    break;
                case this.keys.UP:
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
                        // this._rotateUp(-rotateAmount);
                        this._rotateUp(-this.currentSpeed);
                    }
                    needsUpdate = true;
                    break;
                case this.keys.BOTTOM:
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
                        // this._rotateLeft(rotateAmount);
                    }
                    needsUpdate = true;
                    break;

                case this.keys.LEFT:
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
                        // this._rotateLeft(-rotateAmount);
                        this._rotateLeft(-this.currentSpeed);
                    }
                    needsUpdate = true;
                    break;
                case this.keys.RIGHT:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) {
                        this._rotateLeft(-rotateAmount);
                    } else {
                        this._pan(-panAmount, 0);
                    }
                    needsUpdate = true;
                    break;

                case 'KeyZ':
                    this.enableZoom = true;
                    //  = 3;
                    // this._dollyIn(this._getZoomScale(event.deltaY));
                    needsUpdate = true;
                    break;
            }

            if (needsUpdate) {
                event.preventDefault();
                // this.update();
                this.movementUpdate();
            }
        }
    }

    _handleKeyDown(event) {
        this.isKeyDown = true;
        let needsUpdate = false;
        const rotateAmount = (8 * Math.PI * this.rotateSpeed) / this.domElement.clientHeight;
        const panAmount = this.keyPanSpeed;

        switch (event.code) {
            case _KEYASSIGNMENTS.UP:
                if (event.shiftKey) {
                    this._pan(0, panAmount);
                } else {
                    // this._rotateUp(rotateAmount);
                    this._rotateUp(this.currentSpeed);
                }
                needsUpdate = true;
                break;
            case this.keys.UP:
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
                    // this._rotateUp(-rotateAmount);
                    this._rotateUp(-this.currentSpeed);
                }
                needsUpdate = true;
                break;
            case this.keys.BOTTOM:
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
                    // this._rotateLeft(rotateAmount);
                }
                needsUpdate = true;
                break;

            case this.keys.LEFT:
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
                    // this._rotateLeft(-rotateAmount);
                    this._rotateLeft(-this.currentSpeed);
                }
                needsUpdate = true;
                break;
            case this.keys.RIGHT:
                if (event.ctrlKey || event.metaKey || event.shiftKey) {
                    this._rotateLeft(-rotateAmount);
                } else {
                    this._pan(-panAmount, 0);
                }
                needsUpdate = true;
                break;

            case 'KeyZ':
                this.enableZoom = true;
                //  = 3;
                // this._dollyIn(this._getZoomScale(event.deltaY));
                needsUpdate = true;
                break;
        }

        if (needsUpdate) {
            event.preventDefault();
            this.movementUpdate();
        }
    }

    movementUpdate() {
        if (this.isKeyDown) {
            this.currentSpeed += this.acceleration; // Increase speed while key is down
            this.update();
        } else {
            while (currentSpeed >= 0.5) {
                this.currentSpeed *= this.deceleration; // Gradually reduce speed when key is up
                this.update();
            }
        }



        // Call the update function to render changes
    }

}
