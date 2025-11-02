
namespace Polymesh {

    export function updateMotion(motion: Motion3, delta: number) {
        // Acceleration angle of camera
        if (motion.ax !== 0) motion.vx += motion.ax * delta
        if (motion.ay !== 0) motion.vy += motion.ay * delta
        if (motion.az !== 0) motion.vz += motion.az * delta

        // Friction angle of camera
        if (motion.fx !== 0) motion.vx *= (1 - motion.fx) * delta
        if (motion.fy !== 0) motion.vy *= (1 - motion.fy) * delta
        if (motion.fz !== 0) motion.vz *= (1 - motion.fz) * delta

        // Velocity angle of camera
        if (motion.vx !== 0) motion.x += motion.vx * delta
        if (motion.vy !== 0) motion.y += motion.vy * delta
        if (motion.vz !== 0) motion.z += motion.vz * delta
    }

    control.eventContext().registerFrameHandler(scene.PRE_RENDER_UPDATE_PRIORITY, () => {
        const delta = control.eventContext().deltaTime
        updateMotion(angle, delta); updateMotion(cam, delta);
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
