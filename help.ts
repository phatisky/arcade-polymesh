
namespace Polymesh {

    export function isEmptyImage(img: Image) { return img.equals(image.create(img.width, img.height)) }

    export function isOutOfArea(x: number, y: number, width: number, height: number, scale?: number) {
        return (isOutOfRange(x, width, scale) || isOutOfRange(y, height, scale))
    }

    export function isOutOfAreaOnFace(rotated: { x: number, y: number }[], ind: number[], width: number, height: number) {
        const avgXYs = { x: ind.reduce((cur, i) => cur + rotated[i].x, 0) / ind.length, y: ind.reduce((cur, i) => cur + rotated[i].y, 0) / ind.length }
        return isOutOfArea(avgXYs.x, avgXYs.y, width, height, 5)
    }

    export function isOutOfAreaOnAvg(point2s: { x: number, y: number }[], width: number, height: number) {
        const avgXYs = { x: point2s.reduce((cur, val) => cur + val.x, 0) / point2s.length, y: point2s.reduce((cur, val) => cur + val.y, 0) / point2s.length }
        return isOutOfArea(avgXYs.x, avgXYs.y, width, height, 5)
    }

    export function isOutOfRange(x: number, range: number, scale?: number) { return scale ? x < -(range * scale) || x >= range + (range * scale) : x < 0 || x >= range }
    
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

    export function avgZ(rot: { z: number }[], inds: number[]): number { return inds.reduce((s, i) => s + rot[i].z, 0) / inds.length; }

    function gapAround(n: number, r: number, g: number) {
        n -= Math.round(r / 2), n /= g, n += Math.round(r / 2);
        return Math.round(n)
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
        for (let xi = 0; xi < to.width; xi++) {
            const xj = gapAround(xi, from.width, srink)
            for (let yi = 0; yi < to.height; yi++) {
                const yj = gapAround(yi, from.height, srink)
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
        [p0, p1, p2, p3] = [p3, p2, p0, p1];

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

                const qt = q.map(v => ({ x: Math.trunc(v.x), y: Math.trunc(v.y) }))

                if (isOutOfAreaOnAvg(qt, dest.width, dest.height)) if (qt.every(v => isOutOfArea(v.x, v.y, dest.width, dest.height))) continue; // skipped if out of screen
                // stamp 2 triangles by pixel
                //helpers.imageFillTriangle(dest, qt[1].x, qt[1].y, qt[0].x, qt[0].y, qt[3].x, qt[3].y, colorIdx);
                //helpers.imageFillTriangle(dest, qt[2].x, qt[2].y, qt[0].x, qt[0].y, qt[3].x, qt[3].y, colorIdx);
                helpers.imageFillPolygon4(dest, qt[3].x, qt[3].y, qt[2].x, qt[2].y, qt[0].x, qt[0].y, qt[1].x, qt[1].y, colorIdx);
            }
        }
    }

    export function minPosArr(xyarr: { x: number, y: number }[]) {
        return { x: xyarr.reduce((cur, val) => Math.min(cur, val.x), xyarr[0].x), y: xyarr.reduce((cur, val) => Math.min(cur, val.y), xyarr[0].y) }
    }

    export function maxPosArr(xyarr: { x: number, y: number }[]) {
        return { x: xyarr.reduce((cur, val) => Math.max(cur, val.x), xyarr[0].x), y: xyarr.reduce((cur, val) => Math.max(cur, val.y), xyarr[0].y) }
    }

    export function fillCircleImage(dest: Image, x: number, y: number, r: number, c: number) {
        let src = image.create(Math.max(r * 2, 1), Math.max(r * 2, 1))
        if (r > 1) helpers.imageFillCircle(src, r, r, r, c)
        else {
            src.fill(c)
            dest.drawTransparentImage(src, x, y)
            return
        }
        let src0 = src.clone()
        src0.flipX(), src.drawTransparentImage(src0.clone(), 0, 0)
        src0.flipY(), src.drawTransparentImage(src0.clone(), 0, 0)
        src0.flipX(), src.drawTransparentImage(src0.clone(), 0, 0)
        dest.drawTransparentImage(src, x - r, y - r)
    }

    function isCull(b: boolean, x: number, y: number) { return b ? x < y : x > y }

    export function isFaceVisible(rotated: { x: number, y: number, z: number }[], indices: number[], oface: number): boolean {
        // Simple normal calculation for culling
        if (indices.length > 0) {
            const xyzs = indices.map(ind => rotated[ind])

            // Average depth comparison
            const avgZ = xyzs.reduce((sum, v) => sum + v.z, 0) / xyzs.length;
            // const avgY = xyzs.reduce((sum, v) => sum + v.y, 0) / xyzs.length;
            // const avgX = xyzs.reduce((sum, v) => sum + v.x, 0) / xyzs.length;

            const otherXYZs: { xs: number[], ys: number[], zs: number[] } = { xs: [], ys: [], zs: [] }
            // otherXYZs.xs = rotated.filter((_, i) => indices.indexOf(i) < 0).map(v => v.x);
            // otherXYZs.ys = rotated.filter((_, i) => indices.indexOf(i) < 0).map(v => v.y);
            otherXYZs.zs = rotated.filter((_, i) => indices.indexOf(i) < 0).map(v => v.z);

            if (otherXYZs.xs.length <= 0 || otherXYZs.ys.length <= 0 || otherXYZs.zs.length <= 0) return true;
            // const otherAvgX = otherXYZs.xs.reduce((sum, x) => sum + x, 0) / otherXYZs.xs.length;
            // const otherAvgY = otherXYZs.ys.reduce((sum, y) => sum + y, 0) / otherXYZs.ys.length;
            const otherAvgZ = otherXYZs.zs.reduce((sum, z) => sum + z, 0) / otherXYZs.zs.length;

            if (oface < 0) return avgZ < otherAvgZ
            if (oface > 0) return avgZ > otherAvgZ
            return true
            // return (inner ? avgZ < otherAvgZ && (avgX !== otherAvgX && avgY !== otherAvgY) : avgZ > otherAvgZ && (avgX === otherAvgX && avgY === otherAvgY));
        }
        return true;
    }

}
