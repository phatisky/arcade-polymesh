
//% block="Poly mesh" color="#279139" icon="\uf1b2" groups='["Create","Controls","Styling"]'
namespace Polymesh {

    export interface Face { indices: number[], color: number, offset?: number, scale?: number, img?: Image }
    export interface FaceLOD { indices: number[], color: number, offset?: number, scale?: number, img?: Image, imgs?: Image[] }

    export interface Motion3 { x: number, y: number, z: number, vx: number, vy: number, vz: number, ax: number, ay: number, az: number, fx: number, fy: number, fz: number }
    export interface Vector3 { x: number, y: number, z: number }
    export interface Vector3_ { x: number, y: number, z: number, x_: number, y_: number, z_: number }
    export interface Wave3 { sinX: number, sinY: number, sinZ: number, cosX: number, cosY: number, cosZ: number }

    const __meshes: polymesh[] = [];
    const __meshes_refs: {[id: number]: number[]} = {};
    const __meshes_null_refs: number[] = [];
    const __meshes_null_refh: {[id: number]: boolean} = {};
    const __meshes_kinds: {[kind: number]: polymesh[]} = {};
    export const PHI = 1.6180339887, NORMAL_DIST = 1.665, LOD_DIST = 1.2, REDUSPOWER = ((PHI - 1) * Math.PI)

    export const camview = new polyview(true);
    export let zoom = 1, sort = 0x0, dist = 150, fardist = 0;

    export function __meshes_upd_kind(msh: polymesh, kind: number) {
        if (msh.kind === (kind | 0)) return;
        __meshes_refs[msh.kind] = __meshes_refs[msh.kind].filter(idx => idx !== msh.idx);
        __meshes_kinds[msh.kind] = __meshes_refs[msh.kind].map(i => __meshes[i]);
        msh.kind = kind | 0;
        if (!__meshes_refs[msh.kind]) __meshes_refs[msh.kind] = [];
        if (!__meshes_kinds[kind]) __meshes_kinds[kind] = [];
        __meshes_refs[msh.kind].push(msh.idx);
        __meshes_kinds[msh.kind] = __meshes_refs[msh.kind].map(i => __meshes[i]);
    }

    export function __meshes_del(msh: polymesh) {
        __meshes_refs[msh.kind] = __meshes_refs[msh.kind].filter(idx => idx !== msh.idx);
        __meshes_kinds[msh.kind] = __meshes_refs[msh.kind].map(i => __meshes[i]);
        __meshes[msh.idx] = null;
        __meshes_null_refs.push(msh.idx);
        __meshes_null_refh[msh.idx] = true;
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
        if (!__meshes_refs[kind]) __meshes_refs[kind] = [];
        let idx = -1
        if (__meshes_null_refs.length > 0) {
            idx = __meshes_null_refs.pop()
            __meshes_null_refh[idx] = false
        }
        if (!__meshes_kinds[kind]) __meshes_kinds[kind] = [];
        if (idx < 0) {
            idx = __meshes.length
            __meshes_refs[kind].push(idx)
            const msh = new polymesh(Math.floor(kind), idx);
            __meshes.push(msh)
            __meshes_kinds[kind].push(msh)
            return msh
        }
        __meshes_refs[kind].push(idx)
        const msh = new polymesh(Math.floor(kind), idx);
        __meshes[idx] = msh
        __meshes_kinds[kind].push(msh)
        return msh
    }

    //% blockId=poly_kind_allmesh
    //% block="array mesh of kind $kind=poly_kind_shadow"
    //% blockSetVariable=myMeshes
    //% group="mesh kind"
    //% weight=13
    export function meshAll(kind: number) {
        return __meshes_kinds[kind]
    }

    export function meshAny() {
        return __meshes.filter((_, i) => !__meshes_null_refh[i])
    }

}

