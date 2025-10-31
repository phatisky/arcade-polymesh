
namespace Polymesh {

    export const rotatePoint3D = (point: Vector3, pivot: Vector3, angle: Vector3) => {
        let tmp = 0
        const cosX = Math.cos(angle.x), sinX = Math.sin(angle.x);
        const cosY = Math.cos(angle.y), sinY = Math.sin(angle.y);
        const cosZ = Math.cos(angle.z), sinZ = Math.sin(angle.z);
        // move point with pivot to 1st place
        let dx = point.x - pivot.x;
        let dy = point.y - pivot.y;
        let dz = point.z - pivot.z;

        tmp = dy * cosX - dz * sinX; dz =  dy * sinX + dz * cosX; dy = tmp; // --- rotate around x ---
        tmp = dx * cosY + dz * sinY; dz = -dx * sinY + dz * cosY; dx = tmp; // --- rotate around y ---
        tmp = dx * cosZ - dy * sinZ; dy =  dx * sinZ + dy * cosZ; dx = tmp; // --- rotate around z ---

        // move back to real position
        return {
            x: dx + pivot.x,
            y: dy + pivot.y,
            z: dz + pivot.z
        };
    };

    export const swap = <T>(arr: T[], i: number, j: number) => { const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; };

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

    const zigzet = (l: number, r: number, n: number, c?: boolean) =>
        +((l + n - 1) < r) * (
            (+((n & 1) > 0) * (l + (n >> 1) + ((+(c) | 0) * 0.5))) +
            (+((n & 1) < 1) * (l + ((r - l) - (n >> 1) - ((+(c) | 0) * 0.5))))
        ) / +((l + n - 1) < r);

    // main distortImage function
    export function distortImageUtil(
        from: Image, to: Image,
        p0: Pt, p1: Pt, p2: Pt, p3?: Pt,
        center?: boolean) {
        if (!p3) p3 = { x: p2.x + (p1.x - p0.x), y: p2.y + (p1.y - p0.y) };
        const w = from.width, h = from.height;
        const w_ = 1 / w, h_ = 1 / h;
        for (let sx = 0; sx < w; sx++) {
            const ix = zigzet(0, w-1, sx, center)
            const u0 = (ix * w_), u1 = ((ix + 1) * w_);
            const qc = [u0, u1].map(u => ({
                x0: p0.x + (p1.x - p0.x) * u,
                y0: p0.y + (p1.y - p0.y) * u,
                x1: p3.x + (p2.x - p3.x) * u,
                y1: p3.y + (p2.y - p3.y) * u,
            }))
            for (let sy = 0; sy < h; sy++) {
                const iy = zigzet(0, h-1, sy, center)
                const color = from.getPixel(w - ix - 1, iy);
                if (color === 0) continue; // transparent
                const v0 = (iy * h_), v1 = ((iy + 1) * h_);
                // Map quad on 1 pixel
                const qd = [v0, v0, v1, v1].map((v, i) => ({
                    x: Math.trunc(qc[i % qc.length].x0 + (qc[i % qc.length].x1 - qc[i % qc.length].x0) * v),
                    y: Math.trunc(qc[i % qc.length].y0 + (qc[i % qc.length].y1 - qc[i % qc.length].y0) * v)
                }))
                if (isOutOfAreaOnAvg(qd, to.width, to.height)) if (qd.every(v => isOutOfArea(v.x, v.y, to.width, to.height))) continue; // skipped if out of screen
                // stamp 2 triangles by pixel
                helpers.imageFillTriangle(to, qd[1].x, qd[1].y, qd[0].x, qd[0].y, qd[3].x, qd[3].y, color);
                helpers.imageFillTriangle(to, qd[2].x, qd[2].y, qd[0].x, qd[0].y, qd[3].x, qd[3].y, color);
                //helpers.imageFillPolygon4(to, qd[3].x, qd[3].y, qd[2].x, qd[2].y, qd[0].x, qd[0].y, qd[1].x, qd[1].y, colorIdx);
            }
        }
    }

    export function distortImage(from: Image, to: Image,
        x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3?: number, y3?: number,
        center?: boolean) {
        distortImageUtil(from, to, { x: x0, y: y0 }, { x: x1, y: y1 }, { x: x2, y: y2 },(isNaN(x3) || isNaN(y3)) ? null : { x: x3, y: y3 }, center)
    }

    export function resizeImage(from: Image, to: Image, center?: boolean) {
        if (isEmptyImage(from)) return;
        if (from.width === to.width && from.height === to.height) { to.drawTransparentImage(from.clone(), 0, 0); return; }
        distortImage(from, to, to.width, 0, 0, 0, 0, to.height, to.width, to.height, center)
    }

    export function fillCircleImage(dest: Image, x: number, y: number, r: number, c: number) {
        const src = image.create(Math.max(r * 2, 1), Math.max(r * 2, 1))
        if (r > 1) helpers.imageFillCircle(src, r, r, r, c)
        else { src.fill(c), dest.drawTransparentImage(src, x, y); return; }
        const src0 = src.clone()
        src0.flipX(), src.drawTransparentImage(src0.clone(), 0, 0)
        src0.flipY(), src.drawTransparentImage(src0.clone(), 0, 0)
        src0.flipX(), src.drawTransparentImage(src0.clone(), 0, 0)
        dest.drawTransparentImage(src, x - r, y - r)
    }

    const isCull = (b: boolean, x: number, y: number) => (b ? x < y : x > y)

    export function isFaceVisible(rotated: { x: number, y: number, z: number }[], indices: number[], oface: number, w?: number, h?: number): boolean {
        // Simple normal calculation for culling
        if (indices.length > 0) {
            if (oface < 1 && oface > -1) if (w || h) return (indices.every(i => isOutOfArea(rotated[i].x, rotated[i].y, w, h)));
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

    export const meshDepthZ = (plm: polymesh) => {
        if (plm.isDel()) return NaN;
        return rotatePoint3D(plm.pos, cam, angle).z;
    }

    export const meshDistZ = (plm: polymesh) => (Math.abs(dist) / (Math.abs(dist) + meshDepthZ(plm)))

}
