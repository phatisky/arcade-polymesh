
//% block="Poly mesh" color="#279139" icon="\uf1b2" groups='["Create","Controls","Styling"]'
namespace Polymesh {

    export const inProcess: boolean[] = [false, false]

    /** Fast inverse square root **/
    export function fisqrt(x: number): number {
        if (x <= 0) return 0;
        const buf = pins.createBuffer(4);
        buf.setNumber(NumberFormat.Float32LE, 0, x);
        let i = buf.getNumber(NumberFormat.Int32LE, 0);
        i = 0x5f3759df - (i >> 1);
        buf.setNumber(NumberFormat.Int32LE, 0, i);
        let y = buf.getNumber(NumberFormat.Float32LE, 0);
        // One iteration Newton-Raphson
        y = y * (1.5 - (0.5 * x * y * y));
        return y;
    }

    export let ax = 0, az = 0, ay = 0, avx = 0, avy = 0, avz = 0, aax = 0, aay = 0, aaz = 0, afx = 0, afy = 0, afz = 0
    export let camx = 0, camy = 0, camz = 0, camvx = 0, camvy = 0, camvz = 0, camax = 0, camay = 0, camaz = 0, camfx = 0, camfy = 0, camfz = 0
    export let zoom = 1, sort = 0, dist = 150

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
    export function changeCam(choice: PolyCamera, x: number) {
        switch (choice) {
            case 0: default: zoom += x; break
            case 1: dist += x; break
            case 2: camx += x; break
            case 3: camy += x; break
            case 4: camz += x; break
            case 5: camvx += x; break
            case 6: camvy += x; break
            case 7: camvz += x; break
            case 8: camax += x; break
            case 9: camay += x; break
            case 10: camaz += x; break
            case 11: camfx += x; break
            case 12: camfy += x; break
            case 13: camfz += x; break
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
    export function setCam(choice: PolyCamera, x: number) {
        switch (choice) {
            case 0: default: zoom = x; break
            case 1: dist = x; break
            case 2: camx = x; break
            case 3: camy = x; break
            case 4: camz = x; break
            case 5: camvx = x; break
            case 6: camvy = x; break
            case 7: camvz = x; break
            case 8: camax = x; break
            case 9: camay = x; break
            case 10: camaz = x; break
            case 11: camfx = x; break
            case 12: camfy = x; break
            case 13: camfz = x; break
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
    export function getCam(choice: PolyCamera) {
        switch (choice) {
            case 0: default: return zoom
            case 1: return dist
            case 2: return camx
            case 3: return camy
            case 4: return camz
            case 5: return camvx
            case 6: return camvy
            case 7: return camvz
            case 8: return camax
            case 9: return camay
            case 10: return camaz
            case 11: return camfx
            case 12: return camfy
            case 13: return camfz
        }
        return NaN
    }

    //% blockId=poly_camera_setpos
    //% block="set camera position to x: $x y: $y z: $z"
    //% group="main camera"
    //% weight=3
    export function setCamPosition(x: number, y: number, z: number) { [camx, camy, camz] = [x, y, z] }

    //% blockId=poly_sorttype
    //% block="set sorting method to $method"
    //% group="sorting"
    //% weight=10
    export function sortingMethod(method: SortingMethods) {
        sort = method
    }

    //% blockId=poly_newmesh
    //% block="create new mesh"
    //% blockSetVariable=myMesh
    //% group="create"
    //% weight=10
    export function newmesh() { return new polymesh() }

    export function introSort<T>(
        arr: T[],
        compare: (a: T, b: T) => number
    ): void {
        const maxDepth = 2 * Math.floor(Math.log(arr.length) / Math.log(2));
        introsortUtil(arr, 0, arr.length - 1, maxDepth, compare);
    }

    function introsortUtil<T>(
        arr: T[],
        start: number,
        end: number,
        depthLimit: number,
        compare: (a: T, b: T) => number
    ): void {
        const size = end - start + 1;
        if (size <= 16) { insertionSort(arr, start, end, compare);
        return; }

        if (depthLimit === 0) { heapSort(arr, start, end, compare);
        return; }

        const pivot = medianOfThree(arr, start, start + ((end - start) >> 1), end, compare);
        const p = partition(arr, start, end, pivot, compare);
        introsortUtil(arr, start, p - 1, depthLimit - 1, compare);
        introsortUtil(arr, p + 1, end, depthLimit - 1, compare);
    }

    function insertionSort<T>(arr: T[], start: number, end: number, compare: (a: T, b: T) => number) {
        for (let i = start + 1; i <= end; i++) {
            const key = arr[i];
            let j = i - 1;
            while (j >= start && compare(arr[j], key) > 0) arr[j + 1] = arr[j], j--;
            arr[j + 1] = key;
        }
    }

    function heapSort<T>(arr: T[], start: number, end: number, compare: (a: T, b: T) => number) {
        const size = end - start + 1;

        function siftDown(i: number, max: number) {
            let largest = i;
            while (true) {
                const left = 2 * i + 1, right = 2 * i + 2;
                if (left < max && compare(arr[start + left], arr[start + largest]) > 0) largest = left;
                if (right < max && compare(arr[start + right], arr[start + largest]) > 0) largest = right;
                if (largest === i) break;
                [arr[start + i], arr[start + largest]] = [arr[start + largest], arr[start + i]]
                i = largest, largest = i;
            }
        }

        for (let i = Math.floor(size / 2) - 1; i >= 0; i--) siftDown(i, size);

        for (let i = size - 1; i > 0; i--) [arr[start], arr[start + i]] = [arr[start + i], arr[start]], siftDown(0, i);
    }

    function partition<T>(
        arr: T[],
        low: number,
        high: number,
        pivot: T,
        compare: (a: T, b: T) => number
    ): number {
        while (low <= high) {
            while (compare(arr[low], pivot) < 0) low++;
            while (compare(arr[high], pivot) > 0) high--;
            if (low <= high) [arr[low], arr[high]] = [arr[high], arr[low]], low++, high--;
        }
        return low;
    }

    function medianOfThree<T>(
        arr: T[],
        a: number,
        b: number,
        c: number,
        compare: (a: T, b: T) => number
    ): T {
        if (compare(arr[a], arr[b]) < 0) {
            if (compare(arr[b], arr[c]) < 0) return arr[b];
            else if (compare(arr[a], arr[c]) < 0) return arr[c];
            else return arr[a];
        } else {
            if (compare(arr[a], arr[c]) < 0) return arr[a];
            else if (compare(arr[b], arr[c]) < 0) return arr[c];
            else return arr[b];
        }
    }

    export function avgZ(rot: { z: number }[], inds: number[]): number { return inds.reduce((s, i) => s + rot[i].z, 0) / inds.length; }

    function gapAround(n: number, r: number, g: number) { n -= Math.round(r / 2), n /= g, n += Math.round(r / 2); return Math.round(n) }
    
    function allAroundValue(x: number, r: number, g: number) {
        x -= Math.round(r / 2)
        x = Math.round(x / g)
        x += Math.round(r / 2)
        return x
    }

    export function pixelessImage(from: Image, srink: number) {
        if (srink <= 1) return from
        srink = Math.max(srink, 1)
        const to = image.create(Math.max(1, Math.floor(from.width / srink)), Math.max(1, Math.floor(from.height / srink)))
        if (to.width <= 1 || to.height <= 1) {
            const col = from.getPixel(Math.floor(from.width / 2), Math.floor(from.width / 2))
            to.fill(col)
            return to
        }
        for (let xi = 0;xi < to.width;xi++) {
            const xj = allAroundValue(xi, from.width, srink)
            for (let yi = 0;yi < to.height;yi++) {
                const yj = allAroundValue(yi, from.height, srink)
                const col = from.getPixel(xj, yj)
                if (col > 0) to.setPixel(xi, yi, col)
            }
        }
        return to
    }

    export function distortImage(src: Image, dest: Image,
        x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
        srink: number, revX?: boolean, revY?: boolean) {
        let p0 = { x: x0, y: y0 }, p1 = { x: x1, y: y1 }, p2 = { x: x2, y: y2 }, p3 = { x: x3, y: y3 }
        distortImageUtil(pixelessImage(src.clone(), srink), dest, p0, p1, p2, p3, revX, revY)
    }

    interface Pt { x: number; y: number; }

    // check if two points is cross
    export function segmentsIntersect(p1: Pt, p2: Pt, p3: Pt, p4: Pt): boolean {
        function ccw(a: Pt, b: Pt, c: Pt): boolean {
            return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
        }
        return ccw(p1, p3, p4) != ccw(p2, p3, p4) &&
            ccw(p1, p2, p3) != ccw(p1, p2, p4);
    }

    // fix quad if intersect
    export function fixQuad(p0: Pt, p1: Pt, p2: Pt, p3: Pt): [Pt, Pt, Pt, Pt] {
        if (segmentsIntersect(p0, p1, p2, p3) || segmentsIntersect(p1, p2, p3, p0)) {
            // get swapped
            return [p3, p2, p0, p1];
        }
        return [p2, p3, p1, p0];
    }

    // Bilinear interpolation on quad
    export function lerpQuad(p0: Pt, p1: Pt, p2: Pt, p3: Pt, u: number, v: number): Pt {
        const x0 = p0.x + (p1.x - p0.x) * u;
        const y0 = p0.y + (p1.y - p0.y) * u;
        const x1 = p3.x + (p2.x - p3.x) * u;
        const y1 = p3.y + (p2.y - p3.y) * u;
        return {
            x: x0 + (x1 - x0) * v,
            y: y0 + (y1 - y0) * v
        };
    }

    // main distortImage function
    export function distortImageUtil(
        src: Image, dest: Image,
        p0: Pt, p1: Pt, p2: Pt, p3: Pt,
        revX?: boolean, revY?: boolean
    ) {
        // fix quad of intersect
        [p0, p1, p2, p3] = fixQuad(p0, p1, p2, p3);

        const w = src.width;
        const h = src.height;

        const srcBuf = pins.createBuffer(src.height)

        for (let sx = 0; sx < w; sx++) {
            src.getRows(sx, srcBuf)
            if (srcBuf.toArray(NumberFormat.UInt8LE).every(v => v === 0)) continue;
            const u0 = (sx / w);
            const u1 = ((sx + 1) / w);

            for (let sy = 0; sy < h; sy++) {
                const v0 = (sy / h);
                const v1 = ((sy + 1) / h);

                let colorIdx = src.getPixel(revX ? w - sx - 1 : sx, revY ? h - sy - 1 : sy);

                if (colorIdx === 0) continue; // transparent

                // Map quad on 1 pixel
                const q = [
                    lerpQuad(p0, p1, p2, p3, u0, v0),
                    lerpQuad(p0, p1, p2, p3, u1, v0),
                    lerpQuad(p0, p1, p2, p3, u0, v1),
                    lerpQuad(p0, p1, p2, p3, u1, v1),
                ]

                const qt = q.map( v => ({ x: Math.trunc(v.x), y: Math.trunc(v.y) }))
                
                if (isOutOfAreaOnAvg(qt, dest.width, dest.height)) if (qt.every(v => isOutOfArea(v.x, v.y, dest.width, dest.height))) continue; // skipped if out of screen
                // stamp 2 triangles by pixel
                //helpers.imageFillTriangle(dest, qt[1].x, qt[1].y, qt[0].x, qt[0].y, qt[3].x, qt[3].y, colorIdx);
                //helpers.imageFillTriangle(dest, qt[2].x, qt[2].y, qt[0].x, qt[0].y, qt[3].x, qt[3].y, colorIdx);
                helpers.imageFillPolygon4(dest, qt[3].x, qt[3].y, qt[2].x, qt[2].y, qt[0].x, qt[0].y, qt[1].x, qt[1].y, colorIdx);
            }
        }
    }

    export function minPosArr(xyarr: { x: number, y: number}[]) {
        return { x: xyarr.reduce((cur, val) => Math.min(cur, val.x), xyarr[0].x), y: xyarr.reduce((cur, val) => Math.min(cur, val.y), xyarr[0].y)}
    }

    export function maxPosArr(xyarr: { x: number, y: number }[]) {
        return { x: xyarr.reduce((cur, val) => Math.max(cur, val.x), xyarr[0].x), y: xyarr.reduce((cur, val) => Math.max(cur, val.y), xyarr[0].y) }
    }

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
    //% blockHidden
    export function offsetFaceShadow(oface?: number) { return new shadowOffsetFace(oface) }

    export class shadowBillSize { constructor(public scale?: number) { } }
    //% blockId=poly_shadow_billscale
    //% block="||bill size of $scale"
    //% blockHidden
    export function billSizeShadow(scale?: number) { return new shadowBillSize(scale) }
}
