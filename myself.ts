
namespace Polymesh {

    forever(() => {
        const deltaG = control.eventContext().deltaTime

        // Acceleration angle of camera
        if (aax !== 0) avx += aax * deltaG
        if (aay !== 0) avy += aay * deltaG
        if (aaz !== 0) avz += aaz * deltaG

        // Friction angle of camera
        if (afx !== 0) avx = avx < 0 ? Math.min(avx + Math.abs(afx) * deltaG, 0) : Math.max(avx - Math.abs(afx) * deltaG, 0)
        if (afy !== 0) avy = avy < 0 ? Math.min(avy + Math.abs(afy) * deltaG, 0) : Math.max(avy - Math.abs(afy) * deltaG, 0)
        if (afz !== 0) avz = avz < 0 ? Math.min(avz + Math.abs(afz) * deltaG, 0) : Math.max(avz - Math.abs(afz) * deltaG, 0)

        // Velocity angle of camera
        if (avx !== 0) ax += avx * deltaG
        if (avy !== 0) ay += avy * deltaG
        if (avz !== 0) az += avz * deltaG

        // Acceleration​ position of camera
        if (camax !== 0) camvx += camax * deltaG
        if (camay !== 0) camvy += camay * deltaG
        if (camaz !== 0) camvz += camaz * deltaG

        // Friction position of camera
        if (camfx !== 0) camvx = camvx < 0 ? Math.min(camvx + Math.abs(camfx) * deltaG, 0) : Math.max(camvx - Math.abs(camfx) * deltaG, 0)
        if (camfy !== 0) camvy = camvy < 0 ? Math.min(camvy + Math.abs(camfy) * deltaG, 0) : Math.max(camvy - Math.abs(camfy) * deltaG, 0)
        if (camfz !== 0) camvz = camvz < 0 ? Math.min(camvz + Math.abs(camfz) * deltaG, 0) : Math.max(camvz - Math.abs(camfz) * deltaG, 0)

        // Velocity position of camera
        if (camvx !== 0) camx += camvx * deltaG
        if (camvy !== 0) camy += camvy * deltaG
        if (camvz !== 0) camz += camvz * deltaG
    })

    //% blockId=poly_camera_setpos
    //% block="set camera position to x: $x y: $y z: $z"
    //% group="main camera"
    //% weight=3
    export function setCamPosition(x: number, y: number, z: number) { [camx, camy, camz] = [x, y, z] }

    //% blockId=poly_angle_change
    //% block="change $choice by $x"
    //% group="main angle"
    //% weight=5
    export function changeAngle(choice: PolyAngle, x: number) {
        switch (choice) {
            case 0x0: if (ax  !== ax  + x) ax  += x; break
            case 0x1: if (ay  !== ay  + x) ay  += x; break
            case 0x2: if (az  !== az  + x) az  += x; break
            case 0x3: if (avx !== avx + x) avx += x; break
            case 0x4: if (avy !== avy + x) avy += x; break
            case 0x5: if (avz !== avz + x) avz += x; break
            case 0x6: if (aax !== aax + x) aax += x; break
            case 0x7: if (aay !== aay + x) aay += x; break
            case 0x8: if (aaz !== aaz + x) aaz += x; break
            case 0x9: if (afx !== afx + x) afx += x; break
            case 0xA: if (afy !== afy + x) afy += x; break
            case 0xB: if (afz !== afz + x) afz += x; break
        }
    }
    //% blockId=poly_camera_change
    //% block="change $choice by $x"
    //% group="main camera"
    //% weight=5
    export function changeCam(choice: PolyCam, x: number) {
        switch (choice) {
            case 0x0: default: if (zoom    !== zoom    + x) zoom    += x; break
            case 0x1:          if (dist    !== dist    + x) dist    += x; break
            case 0x2:          if (fardist !== fardist + x) fardist += x; break
            case 0x3:          if (camx    !== camx    + x) camx    += x; break
            case 0x4:          if (camy    !== camy    + x) camy    += x; break
            case 0x5:          if (camz    !== camz    + x) camz    += x; break
            case 0x6:          if (camvx   !== camvx   + x) camvx   += x; break
            case 0x7:          if (camvy   !== camvy   + x) camvy   += x; break
            case 0x8:          if (camvz   !== camvz   + x) camvz   += x; break
            case 0x9:          if (camax   !== camax   + x) camax   += x; break
            case 0xA:          if (camay   !== camay   + x) camay   += x; break
            case 0xB:          if (camaz   !== camaz   + x) camaz   += x; break
            case 0xC:          if (camfx   !== camfx   + x) camfx   += x; break
            case 0xD:          if (camfy   !== camfy   + x) camfy   += x; break
            case 0xE:          if (camfz   !== camfz   + x) camfz   += x; break
        }
    }
    //% blockId=poly_angle_set
    //% block="set $choice to $x"
    //% group="main angle"
    //% weight=10
    export function setAngle(choice: PolyAngle, x: number) {
        switch (choice) {
            case 0x0: if (ax  !== x) ax  = x; break
            case 0x1: if (ay  !== x) ay  = x; break
            case 0x2: if (az  !== x) az  = x; break
            case 0x3: if (avx !== x) avx = x; break
            case 0x4: if (avy !== x) avy = x; break
            case 0x5: if (avz !== x) avz = x; break
            case 0x6: if (aax !== x) aax = x; break
            case 0x7: if (aay !== x) aay = x; break
            case 0x8: if (aaz !== x) aaz = x; break
            case 0x9: if (afx !== x) afx = x; break
            case 0xA: if (afy !== x) afy = x; break
            case 0xB: if (afz !== x) afz = x; break
        }
    }
    //% blockId=poly_camera_set
    //% block="set $choice to $x"
    //% group="main camera"
    //% weight=10
    export function setCam(choice: PolyCam, x: number) {
        switch (choice) {
            case 0x0: default: if (zoom    !== x) zoom    = x; break
            case 0x1:          if (dist    !== x) dist    = x; break
            case 0x2:          if (fardist !== x) fardist = x; break
            case 0x3:          if (camx    !== x) camx    = x; break
            case 0x4:          if (camy    !== x) camy    = x; break
            case 0x5:          if (camz    !== x) camz    = x; break
            case 0x6:          if (camvx   !== x) camvx   = x; break
            case 0x7:          if (camvy   !== x) camvy   = x; break
            case 0x8:          if (camvz   !== x) camvz   = x; break
            case 0x9:          if (camax   !== x) camax   = x; break
            case 0xA:          if (camay   !== x) camay   = x; break
            case 0xB:          if (camaz   !== x) camaz   = x; break
            case 0xC:          if (camfx   !== x) camfx   = x; break
            case 0xD:          if (camfy   !== x) camfy   = x; break
            case 0xE:          if (camfz   !== x) camfz   = x; break
        }
    }

    //% blockId=poly_angle_get
    //% block="$choice"
    //% group="main angle"
    //% weight=4
    export function getAngle(choice: PolyAngle) {
        switch (choice) {
            case 0x0: return ax
            case 0x1: return ay
            case 0x2: return az
            case 0x3: return avx
            case 0x4: return avy
            case 0x5: return avz
            case 0x6: return aax
            case 0x7: return aay
            case 0x8: return aaz
            case 0x9: return afx
            case 0xA: return afy
            case 0xB: return afz
        }
        return NaN
    }

    //% blockId=poly_camera_get
    //% block="$choice"
    //% group="main camera"
    //% weight=4
    export function getCam(choice: PolyCam) {
        switch (choice) {
            case 0x0: default: return zoom
            case 0x1:          return dist
            case 0x2:          return fardist
            case 0x3:          return camx
            case 0x4:          return camy
            case 0x5:          return camz
            case 0x6:          return camvx
            case 0x7:          return camvy
            case 0x8:          return camvz
            case 0x9:          return camax
            case 0xA:          return camay
            case 0xB:          return camaz
            case 0xC:          return camfx
            case 0xD:          return camfy
            case 0xE:          return camfz
        }
        return NaN
    }

}
