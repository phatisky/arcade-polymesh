
namespace Polymesh {

    export function updatePhysic(motion: Motion3, deltaG: number) {
        // Acceleration angle of camera
        if (motion.ax !== 0) angle.vx += angle.ax * deltaG
        if (motion.ay !== 0) angle.vy += angle.ay * deltaG
        if (motion.az !== 0) angle.vz += angle.az * deltaG

        // Friction angle of camera
        if (angle.fx !== 0) angle.vx *= (1 - angle.fx) * deltaG
        if (angle.fy !== 0) angle.vy *= (1 - angle.fy) * deltaG
        if (angle.fz !== 0) angle.vz *= (1 - angle.fz) * deltaG

        // Velocity angle of camera
        if (angle.vx !== 0) angle.x += angle.vx * deltaG
        if (angle.vy !== 0) angle.y += angle.vy * deltaG
        if (angle.vz !== 0) angle.z += angle.vz * deltaG
    }

    control.eventContext().registerFrameHandler(scene.PRE_RENDER_UPDATE_PRIORITY, () => {
        const deltaG = control.eventContext().deltaTime

        // Acceleration angle of camera
        if (angle.ax !== 0) angle.vx += angle.ax * deltaG
        if (angle.ay !== 0) angle.vy += angle.ay * deltaG
        if (angle.az !== 0) angle.vz += angle.az * deltaG

        // Friction angle of camera
        if (angle.fx !== 0) angle.vx = angle.vx < 0 ? Math.min(angle.vx + Math.abs(angle.fx) * deltaG, 0) : Math.max(angle.vx - Math.abs(angle.fx) * deltaG, 0)
        if (angle.fy !== 0) angle.vy = angle.vy < 0 ? Math.min(angle.vy + Math.abs(angle.fy) * deltaG, 0) : Math.max(angle.vy - Math.abs(angle.fy) * deltaG, 0)
        if (angle.fz !== 0) angle.vz = angle.vz < 0 ? Math.min(angle.vz + Math.abs(angle.fz) * deltaG, 0) : Math.max(angle.vz - Math.abs(angle.fz) * deltaG, 0)

        // Velocity angle of camera
        if (angle.vx !== 0) angle.x += angle.vx * deltaG
        if (angle.vy !== 0) angle.y += angle.vy * deltaG
        if (angle.vz !== 0) angle.z += angle.vz * deltaG

        // Acceleration​ position of camera
        if (cam.ax !== 0) cam.vx += cam.ax * deltaG
        if (cam.ay !== 0) cam.vy += cam.ay * deltaG
        if (cam.az !== 0) cam.vz += cam.az * deltaG

        // Friction position of camera
        if (cam.fx !== 0) cam.vx = cam.vx < 0 ? Math.min(cam.vx + Math.abs(cam.fx) * deltaG, 0) : Math.max(cam.vx - Math.abs(cam.fx) * deltaG, 0)
        if (cam.fy !== 0) cam.vy = cam.vy < 0 ? Math.min(cam.vy + Math.abs(cam.fy) * deltaG, 0) : Math.max(cam.vy - Math.abs(cam.fy) * deltaG, 0)
        if (cam.fz !== 0) cam.vz = cam.vz < 0 ? Math.min(cam.vz + Math.abs(cam.fz) * deltaG, 0) : Math.max(cam.vz - Math.abs(cam.fz) * deltaG, 0)

        // Velocity position of camera
        if (cam.vx !== 0) cam.x += cam.vx * deltaG
        if (cam.vy !== 0) cam.y += cam.vy * deltaG
        if (cam.vz !== 0) cam.z += cam.vz * deltaG
    })

    //% blockId=poly_camera_setpos
    //% block="set camera position to x: $x y: $y z: $z"
    //% group="main camera"
    //% weight=3
    export function setCamPosition(x: number, y: number, z: number) { [cam.x, cam.y, cam.z] = [x, y, z] }

    //% blockId=poly_angle_change
    //% block="change $choice by $x"
    //% group="main angle"
    //% weight=5
    export function changeAngle(choice: PolyAngle, x: number) {
        switch (choice) {
            case 0x0: if (angle.x  !== angle.x  + x) angle.x  += x; break
            case 0x1: if (angle.y  !== angle.y  + x) angle.y  += x; break
            case 0x2: if (angle.z  !== angle.z  + x) angle.z  += x; break
            case 0x3: if (angle.vx !== angle.vx + x) angle.vx += x; break
            case 0x4: if (angle.vy !== angle.vy + x) angle.vy += x; break
            case 0x5: if (angle.vz !== angle.vz + x) angle.vz += x; break
            case 0x6: if (angle.ax !== angle.ax + x) angle.ax += x; break
            case 0x7: if (angle.ay !== angle.ay + x) angle.ay += x; break
            case 0x8: if (angle.az !== angle.az + x) angle.az += x; break
            case 0x9: if (angle.fx !== angle.fx + x) angle.fx += x; break
            case 0xA: if (angle.fy !== angle.fy + x) angle.fy += x; break
            case 0xB: if (angle.fz !== angle.fz + x) angle.fz += x; break
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
            case 0x3:          if (cam.x   !== cam.x   + x) cam.x   += x; break
            case 0x4:          if (cam.y   !== cam.y   + x) cam.y   += x; break
            case 0x5:          if (cam.z   !== cam.z   + x) cam.z   += x; break
            case 0x6:          if (cam.vx  !== cam.vx  + x) cam.vx  += x; break
            case 0x7:          if (cam.vy  !== cam.vy  + x) cam.vy  += x; break
            case 0x8:          if (cam.vz  !== cam.vz  + x) cam.vz  += x; break
            case 0x9:          if (cam.ax  !== cam.ax  + x) cam.ax  += x; break
            case 0xA:          if (cam.ay  !== cam.ay  + x) cam.ay  += x; break
            case 0xB:          if (cam.az  !== cam.az  + x) cam.az  += x; break
            case 0xC:          if (cam.fx  !== cam.fx  + x) cam.fx  += x; break
            case 0xD:          if (cam.fy  !== cam.fy  + x) cam.fy  += x; break
            case 0xE:          if (cam.fz  !== cam.fz  + x) cam.fz  += x; break
        }
    }
    //% blockId=poly_angle_set
    //% block="set $choice to $x"
    //% group="main angle"
    //% weight=10
    export function setAngle(choice: PolyAngle, x: number) {
        switch (choice) {
            case 0x0: if (angle.x  !== x) angle.x  = x; break
            case 0x1: if (angle.y  !== x) angle.y  = x; break
            case 0x2: if (angle.z  !== x) angle.z  = x; break
            case 0x3: if (angle.vx !== x) angle.vx = x; break
            case 0x4: if (angle.vy !== x) angle.vy = x; break
            case 0x5: if (angle.vz !== x) angle.vz = x; break
            case 0x6: if (angle.ax !== x) angle.ax = x; break
            case 0x7: if (angle.ay !== x) angle.ay = x; break
            case 0x8: if (angle.az !== x) angle.az = x; break
            case 0x9: if (angle.fx !== x) angle.fx = x; break
            case 0xA: if (angle.fy !== x) angle.fy = x; break
            case 0xB: if (angle.fz !== x) angle.fz = x; break
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
            case 0x3:          if (cam.x   !== x) cam.x   = x; break
            case 0x4:          if (cam.y   !== x) cam.y   = x; break
            case 0x5:          if (cam.z   !== x) cam.z   = x; break
            case 0x6:          if (cam.vx  !== x) cam.vx  = x; break
            case 0x7:          if (cam.vy  !== x) cam.vy  = x; break
            case 0x8:          if (cam.vz  !== x) cam.vz  = x; break
            case 0x9:          if (cam.ax  !== x) cam.ax  = x; break
            case 0xA:          if (cam.ay  !== x) cam.ay  = x; break
            case 0xB:          if (cam.az  !== x) cam.az  = x; break
            case 0xC:          if (cam.fx  !== x) cam.fx  = x; break
            case 0xD:          if (cam.fy  !== x) cam.fy  = x; break
            case 0xE:          if (cam.fz  !== x) cam.fz  = x; break
        }
    }

    //% blockId=poly_angle_get
    //% block="$choice"
    //% group="main angle"
    //% weight=4
    export function getAngle(choice: PolyAngle) {
        switch (choice) {
            case 0x0: return angle.x
            case 0x1: return angle.y
            case 0x2: return angle.z
            case 0x3: return angle.vx
            case 0x4: return angle.vy
            case 0x5: return angle.vz
            case 0x6: return angle.ax
            case 0x7: return angle.ay
            case 0x8: return angle.az
            case 0x9: return angle.fx
            case 0xA: return angle.fy
            case 0xB: return angle.fz
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
            case 0x3:          return cam.x
            case 0x4:          return cam.y
            case 0x5:          return cam.z
            case 0x6:          return cam.vx
            case 0x7:          return cam.vy
            case 0x8:          return cam.vz
            case 0x9:          return cam.ax
            case 0xA:          return cam.ay
            case 0xB:          return cam.az
            case 0xC:          return cam.fx
            case 0xD:          return cam.fy
            case 0xE:          return cam.fz
        }
        return NaN
    }

}
