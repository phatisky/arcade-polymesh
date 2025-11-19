
//% block="Poly mesh" color="#279139" icon="\uf1b2" groups='["Create","Controls","Styling"]'
namespace Polymesh {

    export interface Face { indices: number[], color: number, offset?: number, scale?: number, img?: Image, imgs?: Image[] }

    export interface Motion3 { x: number, y: number, z: number, vx: number, vy: number, vz: number, ax: number, ay: number, az: number, fx: number, fy: number, fz: number }
    export interface Vector3 { x: number, y: number, z: number }
    export interface Vector3_ { x: number, y: number, z: number, x_: number, y_: number, z_: number }

    const __meshes: polymesh[] = [];
    const __meshes_refs: {[id: number]: number[]} = {};
    const __meshes_null_refs: number[] = [];
    export const PHI = 1.6180339887, NORMAL_DIST = 1.665, LOD_DIST = 1.2

    export const angle: Motion3 = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, ax: 0, ay: 0, az: 0, fx: 0, fy: 0, fz: 0 };
    export const cam: Motion3 = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, ax: 0, ay: 0, az: 0, fx: 0, fy: 0, fz: 0 };
    export let zoom = 1, sort = 0x0, dist = 150, fardist = 0;

    export function __meshes_upd_kind(msh: polymesh, kind: number) {
        if (msh.kind === Math.floor(kind)) return;
        __meshes_refs[msh.kind] = __meshes_refs[msh.kind].filter(idx => idx !== msh.idx);
        msh.kind = Math.floor(kind);
        if (!__meshes_refs[msh.kind]) __meshes_refs[msh.kind] = []
        __meshes_refs[msh.kind].push(msh.idx);
    }

    export function __meshes_del(msh: polymesh) {
        __meshes_refs[msh.kind] = __meshes_refs[msh.kind].filter(idx => idx !== msh.idx);
        __meshes[msh.idx] = null;
        __meshes_null_refs.push(msh.idx);
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
        if (!__meshes_refs[kind]) __meshes_refs[kind] = []
        let idx = __meshes_null_refs.length > 0 ? __meshes_null_refs.pop() : -1
        if (idx < 0) {
            idx = __meshes.length
            __meshes_refs[kind].push(idx)
            const msh = new polymesh(Math.floor(kind), idx);
            __meshes.push(msh)
            return msh
        }
        __meshes_refs[kind].push(idx)
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
        return __meshes_refs[kind].map(i => __meshes[i])
    }

}

