
namespace Polymesh {

    export const swap = <T>(arr: T[], i: number, j: number) => { const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; };

    // export function sortedChance<T>( arr: T[], cmp: (a: T, b: T) => number, lo?: number, hi?: number ): number {
    //     if (!lo) lo = 0; if (!hi) hi = arr.length;
    //     if (hi - lo < 2) return 15; // single item is sorted
    //     const count = arr.reduce((cur, _, idx) => cur + ((idx > lo && idx < hi && cmp(arr[idx - 1], arr[idx]) <= 0) ? 1 : 0), 0);
    //     const fraction = count / (hi - lo);
    //     return Math.floor(fraction * 15); // 0-15
    // }

    export function isOutOfRange(x: number, range: number, scale?: number) { return (scale ? x < -(range * scale) || x >= range + (range * scale) : x < 0 || x >= range); }

    export function isOutOfArea(x: number, y: number, width: number, height: number, scale?: number) { return (isOutOfRange(x, width, scale) || isOutOfRange(y, height, scale)); }

    export function avgZ(rot: { z: number }[], inds: number[]) { return (inds.reduce((s, i) => s + rot[i].z, 0) / inds.length); }

    export function isEmptyImage(img: Image) { return img.equals(image.create(img.width, img.height)); }

    export function isOutOfAreaOnFace(rotated: { x: number, y: number }[], ind: number[], width: number, height: number) {
        const avgXYs = { x: ind.reduce((cur, i) => cur + rotated[i].x, 0) / ind.length, y: ind.reduce((cur, i) => cur + rotated[i].y, 0) / ind.length }
        return isOutOfArea(avgXYs.x, avgXYs.y, width, height, 5)
    }

    export function isOutOfAreaOnAvg (point2s: { x: number, y: number }[], width: number, height: number) {
        const avgXYs = { x: point2s.reduce((cur, val) => cur + val.x, 0) / point2s.length, y: point2s.reduce((cur, val) => cur + val.y, 0) / point2s.length }
        return isOutOfArea(avgXYs.x, avgXYs.y, width, height, 5)
    }

    interface Pt { x: number; y: number; }

    // Bilinear interpolation on quad
    export function lerpQuad(p0: Pt, p1: Pt, p2: Pt, p3: Pt, u: number, v: number): Pt {
        const x0 = p0.x + (p1.x - p0.x) * u;
        const y0 = p0.y + (p1.y - p0.y) * u;
        const x1 = p3.x + (p2.x - p3.x) * u;
        const y1 = p3.y + (p2.y - p3.y) * u;
        return {
            x: Math.trunc(x0 + (x1 - x0) * v),
            y: Math.trunc(y0 + (y1 - y0) * v)
        };
    }

    // main distortImage function
    export function distortImageUtil(
        from: Image, to: Image,
        p0: Pt, p1: Pt, p2: Pt, p3: Pt,
        revX?: boolean, revY?: boolean
    ) {

        const w = from.width;
        const h = from.height;

        const fromBuf = pins.createBuffer(from.height)

        for (let sx = 0; sx < w; sx++) {
            from.getRows(sx, fromBuf)
            if (fromBuf.toArray(NumberFormat.UInt8LE).every(v => v === 0)) continue;
            const u0 = (sx / w), u1 = ((sx + 1) / w);

            for (let sy = 0; sy < h; sy++) {
                const color = from.getPixel(revX ? w - sx - 1 : sx, revY ? h - sy - 1 : sy);
                if (color === 0) continue; // transparent

                const v0 = (sy / h), v1 = ((sy + 1) / h);

                // fix quad of intersect
                const tmp = p3; p3 = p1, p1 = p2, p2 = p0, p0 = tmp; // [p0, p1, p2, p3] = [p3, p2, p0, p1];

                // Map quad on 1 pixel
                const qd = [
                    lerpQuad(p0, p1, p2, p3, u0, v0),
                    lerpQuad(p0, p1, p2, p3, u1, v0),
                    lerpQuad(p0, p1, p2, p3, u0, v1),
                    lerpQuad(p0, p1, p2, p3, u1, v1),
                ]

                if (isOutOfAreaOnAvg(qd, to.width, to.height)) if (qd.every(v => isOutOfArea(v.x, v.y, to.width, to.height))) continue; // skipped if out of screen
                // stamp 2 triangles by pixel
                helpers.imageFillTriangle(to, qd[1].x, qd[1].y, qd[0].x, qd[0].y, qd[3].x, qd[3].y, color);
                helpers.imageFillTriangle(to, qd[2].x, qd[2].y, qd[0].x, qd[0].y, qd[3 ].x, qd[3].y, color);
                //helpers.imageFillPolygon4(to, qd[3].x, qd[3].y, qd[2].x, qd[2].y, qd[0].x, qd[0].y, qd[1].x, qd[1].y, colorIdx);
            }
        }
    }

    export function distortImage(from: Image, to: Image,
        x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
        revX?: boolean, revY?: boolean) {
        let p0 = { x: x0, y: y0 }, p1 = { x: x1, y: y1 }, p2 = { x: x2, y: y2 }, p3 = { x: x3, y: y3 }
        distortImageUtil(from, to, p0, p1, p2, p3, revX, revY)
    }

    export function resizeImage(from: Image, to: Image, revX?: boolean, revY?: boolean) {
        if (isEmptyImage(from)) return;
        if (from.width === to.width && from.height === to.height) { to.drawTransparentImage(from.clone(), 0, 0); return; }
        distortImage(from, to, 0, 0, to.width, 0, 0, to.height, to.width, to.height, revX, revY)
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

    const isCull = (b: boolean, x: number, y: number) => (b ? x < y : x > y)

    export function isFaceVisible(rotated: { x: number, y: number, z: number }[], indices: number[], oface: number, w?: number, h?: number): boolean {
        // Simple normal calculation for culling
        if (indices.length > 0) {
            if (oface === 0) if (w && h) return (indices.every(i => isOutOfArea(rotated[i].x, rotated[i].y, w, h)));
            const xyzs = indices.map(ind => rotated[ind])

            // Average depth comparison
            const avgZ = xyzs.reduce((sum, v) => sum + v.z, 0) / xyzs.length;
            // const avgY = xyzs.reduce((sum, v) => sum + v.y, 0) / xyzs.length;
            // const avgX = xyzs.reduce((sum, v) => sum + v.x, 0) / xyzs.length;

            const otherXYZs: { xs: number[], ys: number[], zs: number[] } = { xs: [], ys: [], zs: [] }
            // otherXYZs.xs = rotated.filter((_, i) => indices.indexOf(i) < 0).map(v => v.x);
            // otherXYZs.ys = rotated.filter((_, i) => indices.indexOf(i) < 0).map(v => v.y);
            otherXYZs.zs = rotated.filter((_, i) => indices.indexOf(i) < 0).map(v => v.z);

            // if (otherXYZs.xs.length <= 0 || otherXYZs.ys.length <= 0 || otherXYZs.zs.length <= 0) return false;
            if (otherXYZs.zs.length <= 0) return true;
            // const otherAvgX = otherXYZs.xs.reduce((sum, x) => sum + x, 0) / otherXYZs.xs.length;
            // const otherAvgY = otherXYZs.ys.reduce((sum, y) => sum + y, 0) / otherXYZs.ys.length;
            const otherAvgZ = otherXYZs.zs.reduce((sum, z) => sum + z, 0) / otherXYZs.zs.length;

            if (oface < 0) return avgZ < 0
            if (oface > 0) return avgZ > otherAvgZ
            return false;
            // return (inner ? avgZ < otherAvgZ && (avgX !== otherAvgX && avgY !== otherAvgY) : avgZ > otherAvgZ && (avgX === otherAvgX && avgY === otherAvgY));
        }
        return true;
    }

    export const logb = (x: number) => {
        let r = 0;
        while (x >>= 1) r++;
        return r;
    };

    /** Fast inverse square root **/
    export const q_rsqrt = (x: number) => {
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

    export const meshDepthZ = (plm: polymesh) => {
        if (plm.isDel()) return NaN;
        let x = plm.pos.x - camx;
        let y = plm.pos.y - camy;
        let z = plm.pos.z - camz;

        // rotate camera
        let tx = x * Math.cos(ay) + z * Math.sin(ay);
        z = -x * Math.sin(ay) + z * Math.cos(ay);
        x = tx;

        let ty = y * Math.cos(ax) - z * Math.sin(ax);
        z = y * Math.sin(ax) + z * Math.cos(ax);
        y = ty;

        tx = x * Math.cos(az) - y * Math.sin(az);
        y = x * Math.sin(az) + y * Math.cos(az);
        x = tx;

        return z;
    }

    export const meshDistZ = (plm: polymesh) => (Math.abs(dist) / (Math.abs(dist) + meshDepthZ(plm)))

}
