
//% block="Poly mesh" color="#279139" icon="\uf1b2" groups='["Create","Controls","Styling"]'
namespace Polymesh {

    export const PHI = 1.6180339887, XDIST = 1.665, SDIST = 1.12
    export const inProcess: boolean[] = [false, false]

    export let ax   = 0, az   = 0,   ay   = 0,   avx     = 0, avy   = 0, avz   = 0, aax   = 0, aay   = 0, aaz   = 0, afx   = 0, afy   = 0, afz   = 0
    export let camx = 0, camy = 0,   camz = 0,   camvx   = 0, camvy = 0, camvz = 0, camax = 0, camay = 0, camaz = 0, camfx = 0, camfy = 0, camfz = 0
    export let zoom = 1, sort = 0x0, dist = 150, fardist = 0

    //% blockId=poly_sorttype
    //% block="set sorting method to $method"
    //% group="sorting"
    //% weight=10
    export function sortingMethod(method: PolySort) {
        if (sort !== method) sort = method;
    }

    //% blockId=poly_newmesh
    //% block="create new mesh"
    //% blockSetVariable=myMesh
    //% group="create"
    //% weight=10
    export function newmesh() { return new polymesh() }

}

