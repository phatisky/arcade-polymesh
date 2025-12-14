
namespace Polymesh {

    export function updateMotion(motion: Motion3, delta: number) {
        // Acceleration of motion
        if (motion.ax !== 0) motion.vx += motion.ax * delta
        if (motion.ay !== 0) motion.vy += motion.ay * delta
        if (motion.az !== 0) motion.vz += motion.az * delta

        // Friction of motion
        if (motion.fx !== 0) motion.vx *= (1 - motion.fx) * delta
        if (motion.fy !== 0) motion.vy *= (1 - motion.fy) * delta
        if (motion.fz !== 0) motion.vz *= (1 - motion.fz) * delta

        // Velocity of motion
        if (motion.vx !== 0) motion.x += motion.vx * delta
        if (motion.vy !== 0) motion.y += motion.vy * delta
        if (motion.vz !== 0) motion.z += motion.vz * delta
    }

    export function changeMotion(motion: Motion3, choice: number, x: number) {
        switch (choice) {
            case 0x0: if (motion.x  !== motion.x  + x) motion.x  += x; break
            case 0x1: if (motion.y  !== motion.y  + x) motion.y  += x; break
            case 0x2: if (motion.z  !== motion.z  + x) motion.z  += x; break
            case 0x3: if (motion.vx !== motion.vx + x) motion.vx += x; break
            case 0x4: if (motion.vy !== motion.vy + x) motion.vy += x; break
            case 0x5: if (motion.vz !== motion.vz + x) motion.vz += x; break
            case 0x6: if (motion.ax !== motion.ax + x) motion.ax += x; break
            case 0x7: if (motion.ay !== motion.ay + x) motion.ay += x; break
            case 0x8: if (motion.az !== motion.az + x) motion.az += x; break
            case 0x9: if (motion.fx !== motion.fx + x) motion.fx += x; break
            case 0xA: if (motion.fy !== motion.fy + x) motion.fy += x; break
            case 0xB: if (motion.fz !== motion.fz + x) motion.fz += x; break
        }
    }

    export function setMotion(motion: Motion3, choice: number, x: number) {
        switch (choice) {
            case 0x0: if (motion.x  !== x) motion.x  = x; break
            case 0x1: if (motion.y  !== x) motion.y  = x; break
            case 0x2: if (motion.z  !== x) motion.z  = x; break
            case 0x3: if (motion.vx !== x) motion.vx = x; break
            case 0x4: if (motion.vy !== x) motion.vy = x; break
            case 0x5: if (motion.vz !== x) motion.vz = x; break
            case 0x6: if (motion.ax !== x) motion.ax = x; break
            case 0x7: if (motion.ay !== x) motion.ay = x; break
            case 0x8: if (motion.az !== x) motion.az = x; break
            case 0x9: if (motion.fx !== x) motion.fx = x; break
            case 0xA: if (motion.fy !== x) motion.fy = x; break
            case 0xB: if (motion.fz !== x) motion.fz = x; break
        }
    }

    export function getMotion(motion: Motion3, choice: number) {
        switch (choice) {
            case 0x0: return motion.x;
            case 0x1: return motion.y;
            case 0x2: return motion.z;
            case 0x3: return motion.vx;
            case 0x4: return motion.vy;
            case 0x5: return motion.vz;
            case 0x6: return motion.ax;
            case 0x7: return motion.ay;
            case 0x8: return motion.az;
            case 0x9: return motion.fx;
            case 0xA: return motion.fy;
            case 0xB: return motion.fz;
        } return NaN
    }

    control.eventContext().registerFrameHandler(scene.PRE_RENDER_UPDATE_PRIORITY, () => {
        const delta = control.eventContext().deltaTime
        updateMotion(camRot, delta); updateMotion(camPos, delta);
    })

    //% blockId=poly_camera_setpos
    //% block="set camera position to x: $x y: $y z: $z"
    //% group="main camera"
    //% weight=3
    export function setCamPosition(x: number, y: number, z: number) { [camPos.x, camPos.y, camPos.z] = [x, y, z] }

    //% blockId=poly_angle_change
    //% block="change $choice by $x"
    //% group="main angle"
    //% weight=5
    export function changeAngle(choice: PolyAngle, x: number) {
        changeMotion(camRot, choice, x)
    }
    //% blockId=poly_camera_change
    //% block="change $choice by $x"
    //% group="main camera"
    //% weight=5
    export function changeCam(choice: PolyCam, x: number) {
        switch (choice) {
            case 0xC: if (zoom    !== zoom    + x) zoom    += x; return
            case 0xD: if (dist    !== dist    + x) dist    += x; return
            case 0xE: if (fardist !== fardist + x) fardist += x; return
        }
        changeMotion(camPos, choice, x)
    }
    //% blockId=poly_angle_set
    //% block="set $choice to $x"
    //% group="main angle"
    //% weight=10
    export function setAngle(choice: PolyAngle, x: number) {
        setMotion(camRot, choice, x)
    }
    //% blockId=poly_camera_set
    //% block="set $choice to $x"
    //% group="main camera"
    //% weight=10
    export function setCam(choice: PolyCam, x: number) {
        switch (choice) {
            case 0xC: if (zoom    !== x) zoom    = x; return
            case 0xD: if (dist    !== x) dist    = x; return
            case 0xE: if (fardist !== x) fardist = x; return
        }
        setMotion(camPos, choice, x)
    }

    //% blockId=poly_angle_get
    //% block="$choice"
    //% group="main angle"
    //% weight=4
    export function getAngle(choice: PolyAngle) {
        return getMotion(camRot, choice)
    }

    //% blockId=poly_camera_get
    //% block="$choice"
    //% group="main camera"
    //% weight=4
    export function getCam(choice: PolyCam) {
        switch (choice) {
            case 0xC: return zoom
            case 0xD: return dist
            case 0xE: return fardist
        }
        return getMotion(camPos, choice)
    }

}
