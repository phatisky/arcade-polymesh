
namespace Polymesh {

    export class shadowIndices { constructor(public i1: number, public i2?: number, public i3?: number, public i4?: number) { } }
    //% blockId=poly_shadow_indices
    //% block="indice of i1 $i1|| i2 $i2 i3 $i3 i4 $i4"
    //% blockHidden
    export function indiceShadow(i1: number, i2?: number, i3?: number, i4?: number) { return new shadowIndices(i1, i2, i3, i4) }

    export class shadowPoint3 { constructor(public x: number, public y: number, public z: number) { } }
    //% blockId=poly_shadow_point3
    //% block="x: $x y: $y z: $z"
    //% blockHidden
    export function point3Shadow(x: number, y: number, z: number) { return new shadowPoint3(x, y, z) }

    export class shadowOffsetFace { constructor(public oface?: number) { } }
    //% blockId=poly_shadow_offsetface
    //% block="||offset face of $oface"
    //% oface.defl=0
    //% blockHidden
    export function offsetFaceShadow(oface?: number) { return new shadowOffsetFace(oface) }

    export class shadowBillSize { constructor(public scale?: number) { } }
    //% blockId=poly_shadow_billscale
    //% block="||bill size of $scale"
    //% scale.defl=1
    //% blockHidden
    export function billSizeShadow(scale?: number) { return new shadowBillSize(scale) }

}
