namespace PolyKind {

    let kindid: number;

    export function create() { if (!(kindid)) kindid = 0; return kindid++; }

    //% isKind
    export const obj = create()

    //% isKind
    export const mesh = create()

}

namespace Polymesh {

    //% shim=KIND_GET
    //% kindMemberName=mesh
    //% blockId=poly_kind_get
    //% block="$arg"
    //% kindNamespace=PolyKind 
    //% kindPromptHint="enter your mesh group"
    //% group="mesh kind"
    //% weight=15
    export function getKind(arg: number) { return arg }

}
