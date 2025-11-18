
//% block="Poly mesh" color="#279139" icon="\uf1b2" groups='["Create","Controls","Styling"]'
namespace Polymesh {

    export interface Face { indices: number[], color: number, offset?: number, scale?: number, img?: Image, imgs?: Image[] }

    export interface Motion3 { x: number, y: number, z: number, vx: number, vy: number, vz: number, ax: number, ay: number, az: number, fx: number, fy: number, fz: number }
    export interface Vector3 { x: number, y: number, z: number }

    const __meshes: polymesh[] = [];
    const __meshes_ref: {[id: number]: number[]} = {};
    export const PHI = 1.6180339887, NORMAL_DIST = 1.665, LOD_DIST = 1.2

    export const angle: Motion3 = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, ax: 0, ay: 0, az: 0, fx: 0, fy: 0, fz: 0 };
    export const cam: Motion3 = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, ax: 0, ay: 0, az: 0, fx: 0, fy: 0, fz: 0 };
    export let zoom = 1, sort = 0x0, dist = 150, fardist = 0;

    export function __meshes_upd_kind(msh: polymesh, kind: number) {
        if (msh.kind === Math.floor(kind)) return;
        __meshes_ref[msh.kind].removeAt(__meshes_ref[msh.kind].indexOf(msh.idx));
        msh.kind = Math.floor(kind);
        if (!__meshes_ref[msh.kind]) __meshes_ref[msh.kind] = []
        __meshes_ref[msh.kind].push(msh.idx);
    }

    export function __meshes_del(msh: polymesh) {
        __meshes_ref[msh.kind].removeAt(__meshes_ref[msh.kind].indexOf(msh.idx));
        __meshes[msh.idx] = null;
        
    }

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
        if (!__meshes_ref[kind]) __meshes_ref[kind] = []
        let idx = __meshes.indexOf(null)
        if (idx < 0) {
            idx = __meshes.length
            __meshes_ref[kind].push(idx)
            const msh = new polymesh(Math.floor(kind), idx);
            __meshes.push(msh)
            return msh
        }
        __meshes_ref[kind].push(idx)
        const msh = new polymesh(Math.floor(kind), idx);
        __meshes[idx] = msh
        return msh
    }

    //% blockId=poly_kind_allmesh
    //% block="array mesh of kind $kind=poly_kind_shadow"
    //% blockSetVariable=myMeshes
    //% group="mesh kind"
    //% weight=13
    export function meshAll(kind?: number) {
        return __meshes_ref[kind].map(i => __meshes[i])
    }

}

