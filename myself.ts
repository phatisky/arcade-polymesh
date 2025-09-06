
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
            case 0: ax += x; break
            case 1: ay += x; break
            case 2: az += x; break
            case 3: avx += x; break
            case 4: avy += x; break
            case 5: avz += x; break
            case 6: aax += x; break
            case 7: aay += x; break
            case 8: aaz += x; break
            case 9: afx += x; break
            case 10: afy += x; break
            case 11: afz += x; break
        }
    }
    //% blockId=poly_camera_change
    //% block="change $choice by $x"
    //% group="main camera"
    //% weight=5
    export function changeCam(choice: PolyCam, x: number) {
        switch (choice) {
            case 0: default: zoom += x; break
            case 1: dist += x; break
            case 2: fardist += x; break
            case 3: camx += x; break
            case 4: camy += x; break
            case 5: camz += x; break
            case 6: camvx += x; break
            case 7: camvy += x; break
            case 8: camvz += x; break
            case 9: camax += x; break
            case 10: camay += x; break
            case 11: camaz += x; break
            case 12: camfx += x; break
            case 13: camfy += x; break
            case 14: camfz += x; break
        }
    }
    //% blockId=poly_angle_set
    //% block="set $choice to $x"
    //% group="main angle"
    //% weight=10
    export function setAngle(choice: PolyAngle, x: number) {
        switch (choice) {
            case 0: ax = x; break
            case 1: ay = x; break
            case 2: az = x; break
            case 3: avx = x; break
            case 4: avy = x; break
            case 5: avz = x; break
            case 6: aax = x; break
            case 7: aay = x; break
            case 8: aaz = x; break
            case 9: afx = x; break
            case 10: afy = x; break
            case 11: afz = x; break
        }
    }
    //% blockId=poly_camera_set
    //% block="set $choice to $x"
    //% group="main camera"
    //% weight=10
    export function setCam(choice: PolyCam, x: number) {
        switch (choice) {
            case 0: default: zoom = x; break
            case 1: dist = x; break
            case 2: fardist = x; break
            case 3: camx = x; break
            case 4: camy = x; break
            case 5: camz = x; break
            case 6: camvx = x; break
            case 7: camvy = x; break
            case 8: camvz = x; break
            case 9: camax = x; break
            case 10: camay = x; break
            case 11: camaz = x; break
            case 12: camfx = x; break
            case 13: camfy = x; break
            case 14: camfz = x; break
        }
    }

    //% blockId=poly_angle_get
    //% block="$choice"
    //% group="main angle"
    //% weight=4
    export function getAngle(choice: PolyAngle) {
        switch (choice) {
            case 0: return ax
            case 1: return ay
            case 2: return az
            case 3: return avx
            case 4: return avy
            case 5: return avz
            case 6: return aax
            case 7: return aay
            case 8: return aaz
            case 9: return afx
            case 10: return afy
            case 11: return afz
        }
        return NaN
    }

    //% blockId=poly_camera_get
    //% block="$choice"
    //% group="main camera"
    //% weight=4
    export function getCam(choice: PolyCam) {
        switch (choice) {
            case 0: default: return zoom
            case 1: return dist
            case 2: return fardist
            case 3: return camx
            case 4: return camy
            case 5: return camz
            case 6: return camvx
            case 7: return camvy
            case 8: return camvz
            case 9: return camax
            case 10: return camay
            case 11: return camaz
            case 12: return camfx
            case 13: return camfy
            case 14: return camfz
        }
        return NaN
    }

}
