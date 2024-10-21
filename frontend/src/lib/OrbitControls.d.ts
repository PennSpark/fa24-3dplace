// OrbitControls.d.ts
declare module "./OrbitControls.js" {
  export class OrbitControls {
    constructor(object: any, domElement: HTMLElement);
    update(): void;
    dispose(): void;
    // Add other properties and methods as needed
  }
}
