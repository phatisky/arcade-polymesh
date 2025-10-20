
//% block="Poly mesh" color="#279139" icon="\uf1b2" groups='["Create","Controls","Styling"]'
namespace Polymesh {

    export const __mesh: polymesh[][] = []
    export const PHI = 1.6180339887, NORMAL_DIST = 1.665, LOD_DIST = 1.06
    export const D2R = Math.PI / 180, R2D = 180 / Math.PI

    export const angle = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, ax: 0, ay: 0, az: 0, fx: 0, fy: 0, fz: 0 };
    export const cam = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, ax: 0, ay: 0, az: 0, fx: 0, fy: 0, fz: 0 };
    export let zoom = 1, sort = 0x0, dist = 150, fardist = 0

    //% blockId=poly_sorttype
    //% block="set sorting method to $method"
    //% group="sorting"
    //% weight=10
    export function sortingMethod(method: PolySort) {
        if (sort !== method) sort = method;
    }

    //% blockId=poly_create
    //% block="create mesh with kind $kind=poly_kind_shadow"
    //% blockSetVariable=myMesh
    //% group="create"
    //% weight=10
    export function create(kind: number) {
        return new polymesh(Math.round(kind));
    }

    //% blockId=poly_kind_allmesh
    //% block="array mesh of kind $kind=poly_kind_shadow"
    //% blockSetVariable=myMeshes
    //% group="mesh kind"
    //% weight=13
    export function meshAll(kind?: number) {
        return Polymesh.__mesh[kind].filter( msh => msh != null || (msh && !msh.isDel()))
    }

}

