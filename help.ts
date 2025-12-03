
namespace Polymesh {

    export const gcd = (a: number, b: number): number => {
        if ((!a || !b) || ((a && b) && (a < 0 || b < 0))) return NaN
        if (b <= 1) return a;
        if (a <= 1) return b;
        while (b !== 0) { // [b, a] = [a % b, b]
            const tmp = b
            b = a % b
            a = tmp
        }
        return a;
    }

    export const hashImage = (img: Image): string => {
        if (!img) return ""
        let htxt = "F0"
        const imgBuf = control.createBuffer(img.height)
        const hashBuf = control.createBuffer(4)
        for (let x = 0; x < img.width; x++) {
            img.getRows(x, imgBuf)
            hashBuf.setNumber(NumberFormat.UInt32LE, 0, imgBuf.hash(img.width * 2))
            htxt += `${hashBuf.toHex().toUpperCase()}${x < img.width - 1 ? "0FF0" : "0F"}`
        }
        return htxt;
    }

    export const rotatePoint3D = (point: Vector3, pivot: Vector3, angle: Vector3): Vector3 => {
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

    const normalLen3 = (n: number) => Math.sqrt((n * n) + (n * n) + (n * n))

    export const rotatePointLen3D = (len: number, pivot: Vector3, angle: Vector3, code: Buffer): Vector3 =>
        rotatePoint3D({ x: pivot.x + (code[0] ? normalLen3(len) : 0), y: pivot.y + (code[1] ? -normalLen3(len) : 0), z: pivot.z + (code[2] ? normalLen3(len) : 0)}, pivot, angle);

    const computeNormal = (v0: Vector3_, v1: Vector3_, v2: Vector3_): Vector3 => {
        // make vector from triangle
        const u = {
            x: v1.x_ - v0.x_,
            y: v1.y_ - v0.y_,
            z: v1.z_ - v0.z_
        };
        const v = {
            x: v2.x_ - v0.x_,
            y: v2.y_ - v0.y_,
            z: v2.z_ - v0.z_
        };

        // cross product เพื่อหาทิศทางตั้งฉาก
        const normal = {
            x: (u.y * v.z) - (u.z * v.y),
            y: (u.z * v.x) - (u.x * v.z),
            z: (u.x * v.y) - (u.y * v.x)
        };

        // normalize ให้มีความยาว = 1
        const length = Math.sqrt((normal.x * normal.x) + (normal.y * normal.y) + (normal.z * normal.z));
        return {
            x: normal.x / length,
            y: normal.y / length,
            z: normal.z / length
        };
    }

    const dot3 = (a: Vector3, b: Vector3): number =>
        (a.x + a.y + a.z) !== 0
            ? (a.x + a.y + a.z)
        : (b.x + b.y + b.z) !== 0
            ? (b.x + b.y + b.z)
        : ((a.x * b.x) + (a.y * b.y) + (a.z * b.z));

    export function shouldRenderFace(rotated: Vector3_[], inds: number[], cam: Vector3, offset: number): boolean {
        if (inds.length !== 3) return false;
        const normal = computeNormal(rotated[inds[0]], rotated[inds[1]], rotated[inds[2]]);
        const threshold = 0

        if (offset > 0) {
            const sum = dot3(normal, cam);
            // show outside face
            return (sum >= -threshold);
        } else if (offset < 0) {
            const sum = dot3(normal, cam);
            // show inside face
            return (sum <= threshold);
        }
        // offset == 0 -> show two side
        return true;
    }

    const calcMode7 = (a: number, b: number) => a + 0.5 * b

    const mode7img = (from: Image, to: Image, H_scroll: number, V_scroll: number, A: number, B: number, C: number, D: number) => {
        let Center_x = calcMode7(H_scroll, to.width)
        let Center_y = calcMode7(V_scroll, to.height)
        let color = 0
        for (let y = 0; y < to.height; y++) {
            for (let x = 0; x < to.width; x++) {
                color = from.getPixel(Math.trunc(Center_x + (0.00390625 * A * (x + (H_scroll - Center_x)) + 0.00390625 * B * (y + (V_scroll - Center_y)))), Math.trunc(Center_y + (0.00390625 * C * (x + (H_scroll - Center_x)) + 0.00390625 * D * (y + (V_scroll - Center_y)))))
                to.setPixel(x, y, color)
            }
        }
    }

    export function resizeImage(from: Image, to: Image, center?: boolean) {
        if (isEmptyImage(from)) return;

        // ถ้าขนาดเท่ากันก็ copy ตรง ๆ
        if (from.width === to.width && from.height === to.height) {
            to.drawTransparentImage(from.clone(), 0, 0);
            return;
        }

        // คำนวณอัตราส่วนการขยาย
        const scaleX = from.width  / to.width;
        const scaleY = from.height / to.height;

        // คำนวณ offset ถ้าต้องการให้อยู่ตรงกลาง
        let H_scroll = 0;
        let V_scroll = 0;
        if (center) {
            H_scroll = ((to.width  - from.width)  * scaleX) / 2;
            V_scroll = ((to.height - from.height) * scaleY) / 2;
        }

        // เรียก mode7img โดยใช้ scale factor
        // A = scaleX * 256, D = scaleY * 256 (เพราะใน mode7img มีตัวหาร 1/256)
        mode7img(from, to, -H_scroll, -V_scroll, scaleX * 256, 0, 0, scaleY * 256);
    }


    export const swap = <T>(arr: T[], i: number, j: number) => { const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; };

    export function isOutOfRange(x: number, range: number, scale?: number) { return (scale ? x < -(range * scale) || x >= range + (range * scale) : x < 0 || x >= range); }

    export function isOutOfArea(x: number, y: number, width: number, height: number, scale?: number) { return (isOutOfRange(x, width, scale) || isOutOfRange(y, height, scale)); }

    export function avgZ(rot: Vector3[], inds: number[]) { return (inds.reduce((s, i) => s + rot[i].z, 0) / inds.length); }

    export function avgZs(rot: Vector3[][], n: number, inds: number[]) { return (inds.reduce((s, i) => s + rot[i][n].z, 0) / inds.length); }

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

    const zigzet = (l: number, r: number, n: number, c?: boolean) => {
        if (l + n > r) return NaN;
        const size = (r - l);
        const n2 = Math.idiv(n, 2);
        const half = (c ? 0.5 : 0)
        if (n % 2 > 0) return l + (n2 + half);
        return l + (size - n2 - half);
    }
    // main distortImage function
    export function distortImageUtil(
        from: Image, to: Image,
        p0: Pt, p1: Pt, p2: Pt, p3?: Pt,
        center?: boolean) {
        if (Polymesh.isEmptyImage(from)) return;
        if (!p3) p3 = { x: p2.x + (p1.x - p0.x), y: p2.y + (p1.y - p0.y) };
        const w = from.width, h = from.height;
        const w_ = (1 / w), h_ = (1 / h);
        for (let sx = 0; sx < w; sx++) {
            const ix = zigzet(0, w-1, sx, center)
            const u0 = (ix * w_), u1 = ((ix + 1) * w_);
            const qu = [u0, u1].map(u => ({
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
                const qv = [v0, v0, v1, v1].map((v, i) => ({
                    x: Math.trunc(qu[i % 2].x0 + (qu[i % 2].x1 - qu[i % 2].x0) * v),
                    y: Math.trunc(qu[i % 2].y0 + (qu[i % 2].y1 - qu[i % 2].y0) * v)
                }))
                if (isOutOfAreaOnAvg(qv, to.width, to.height)) if (qv.every(v => isOutOfArea(v.x, v.y, to.width, to.height))) continue; // skipped if out of screen
                // stamp 2 triangles by pixel
                helpers.imageFillTriangle(to, qv[1].x, qv[1].y, qv[0].x, qv[0].y, qv[3].x, qv[3].y, color);
                helpers.imageFillTriangle(to, qv[2].x, qv[2].y, qv[0].x, qv[0].y, qv[3].x, qv[3].y, color);
                //helpers.imageFillPolygon4(to, qd[3].x, qd[3].y, qd[2].x, qd[2].y, qd[0].x, qd[0].y, qd[1].x, qd[1].y, colorIdx);
            }
        }
    }

    export function distortImage(from: Image, to: Image,
        x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3?: number, y3?: number,
        center?: boolean) {
        distortImageUtil(from, to, { x: x0, y: y0 }, { x: x1, y: y1 }, { x: x2, y: y2 },(isNaN(x3) || isNaN(y3)) ? null : { x: x3, y: y3 }, center)
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

    export const meshDepthZ = (plm: polymesh) => {
        if (plm.isDel()) return NaN;
        return rotatePoint3D(plm.pos, cam, angle).z;
    }

    export const meshDistZ = (plm: polymesh) => (Math.abs(dist) / (Math.abs(dist) + meshDepthZ(plm)))

}
