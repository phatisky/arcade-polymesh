
namespace Polymesh {

    function rotatePoint3D(point: { x: number, y: number, z: number }, pivot: { x: number, y: number, z: number }, angle: { x: number, y: number, z: number }) {

        // move point with pivot to 1st place
        let dx = point.x - pivot.x;
        let dy = point.y - pivot.y;
        let dz = point.z - pivot.z;

        // --- rotate around x ---
        let dy1 = dy * Math.cos(angle.x) - dz * Math.sin(angle.x);
        let dz1 = dy * Math.sin(angle.x) + dz * Math.cos(angle.x);
        dy = dy1;
        dz = dz1;

        // --- rotate around y ---
        let dx1 = dx * Math.cos(angle.y) + dz * Math.sin(angle.y);
        dz1 = -dx * Math.sin(angle.y) + dz * Math.cos(angle.y);
        dx = dx1;
        dz = dz1;

        // --- rotate around z ---
        dx1 = dx * Math.cos(angle.z) - dy * Math.sin(angle.z);
        dy1 = dx * Math.sin(angle.z) + dy * Math.cos(angle.z);
        dx = dx1;
        dy = dy1;

        // move back to real position
        return {
            x: dx + pivot.x,
            y: dy + pivot.y,
            z: dz + pivot.z
        };
    }

    //% blockId=poly_rendermesh_all
    //% block=" $plms render all meshes to $output=screen_image_picker|| as line render color? $linecolor=colorindexpicker"
    //% plms.shadow=variables_get plms.defl=myMeshes
    //% group="render"
    //% weight=9
    export function renderAll(plms: polymesh[], output: Image, linecolor?: number) {
        if (!plms || !output || plms.length <= 0) return;
        if (inProcess[1]) return;
        inProcess[1] = true
        const depths = plms.map(plm => meshDepthZ(plm));
        const sorted = plms.map((m, i) => ({ mesh: m, depth: depths[i] }));
        switch (sort) {
            case 0: sorted.sort((a, b) => b.depth - a.depth); break
            case 1: introSort(sorted, (a, b) => b.depth - a.depth); break
        }
        for (const m of sorted) if (!m.mesh.flag.invisible) render(m.mesh, output, linecolor);
        inProcess[1] = false
    }

    //% blockId=poly_rendermesh
    //% block=" $plm render to $output=screen_image_picker|| as line render color? $linecolor=colorindexpicker"
    //% plm.shadow=variables_get plm.defl=myMesh
    //% group="render"
    //% weight=10
    export function render(plm: polymesh, output: Image, linecolor?: number) {
        if (!plm || !output || plm.points.length <= 0 || plm.faces.length <= 0) return;
        if (plm.flag.invisible) return;

        if (inProcess[0]) return;
        inProcess[0] = true

        const centerX = output.width >> 1;
        const centerY = output.height >> 1;

        const cosX = Math.cos(ax), sinX = Math.sin(ax);
        const cosY = Math.cos(ay), sinY = Math.sin(ay);
        const cosZ = Math.cos(az), sinZ = Math.sin(az);

        // Transform vertices
        const rotated = plm.points.map(v => {
            const vpoint: { x: number, y: number, z: number } = { x: plm.pos.x + v.x, y: plm.pos.y + v.y, z: plm.pos.z + v.z }
            const vpivot: { x: number, y: number, z: number } = { x: plm.pos.x + plm.pivot.x, y: plm.pos.y + plm.pivot.y, z: plm.pos.z + plm.pivot.z }
            const vpos: { x: number, y: number, z: number } = rotatePoint3D(vpoint, vpivot, plm.rot)
            // camera offset
            let x = vpos.x - camx;
            let y = vpos.y - camy;
            let z = vpos.z - camz;

            // rotate camera
            let tx = x * cosY + z * sinY;
            z = -x * sinY + z * cosY;
            x = tx;

            let ty = y * cosX - z * sinX;
            z = y * sinX + z * cosX;
            y = ty;

            tx = x * cosZ - y * sinZ;
            y = x * sinZ + y * cosZ;
            x = tx;

            // Perspective
            const scale = Math.abs(dist) / (Math.abs(dist) + z);
            return {
                scale: scale,
                x: centerX + x * scale * zoom,
                y: centerY + y * scale * zoom,
                z: z,
            };
        })

        const maxDist = Math.abs(dist) / (Math.abs(dist) + (zoom / Math.PI))

        // Sort triangles
        const tris = plm.faces.slice();
        switch (sort) {
            case 0: tris.sort((a, b) => avgZ(rotated, b.indices) - avgZ(rotated, a.indices)); break
            case 1: default: introSort(tris, (a, b) => avgZ(rotated, b.indices) - avgZ(rotated, a.indices)); break
        }

        // Render
        for (const t of tris) {
            const inds = t.indices;
            if (inds.some(i => rotated[i].z < -Math.abs(dist) || rotated[i].z > Math.abs(dist ** 1.42 / zoom))) continue;
            let idx: number, pt: { scale: number, x: number, y: number, z: number }, cx: number, cy: number, scale: number, range: number, baseW: number, baseH: number, halfW: number, halfH: number, square: number, im: Image
            // LOD calculating?
            let mydist = Math.abs(dist * Math.E / 2) / (Math.abs(dist) - avgZ(rotated, inds))
            if (t.indices.length === 1) {
                idx = t.indices[0];
                pt = rotated[idx];

                im = pixelessImage(t.img, plm.flag.lod ? mydist : 1)

                // center image
                cx = pt.x;
                cy = pt.y;

                const bq = [
                    { x: cx, y: cy },
                    { x: cx, y: cy },
                    { x: cx, y: cy },
                    { x: cx, y: cy },
                ]

                scale = pt.scale;
                square = 1.5 * scale * t.scale * zoom
                if (im) {
                    // set scale image from camera distance
                    baseW = im.width;
                    baseH = im.height;

                    halfW = (baseW / 3) * scale * t.scale * zoom;
                    halfH = (baseH / 3) * scale * t.scale * zoom;
                    bq[0].x += halfW, bq[0].y += halfH
                    bq[1].x -= halfW, bq[1].y += halfH
                    bq[2].x += halfW, bq[2].y -= halfH
                    bq[3].x -= halfW, bq[3].y -= halfH
                    if (bq.every(v => (isOutOfArea(v.x, v.y, output.width, output.height)))) continue;
                } else {
                    bq[0].x += square, bq[0].y += square
                    bq[1].x -= square, bq[1].y += square
                    bq[2].x += square, bq[2].y -= square
                    bq[3].x -= square, bq[3].y -= square
                    if (bq.every(v => (isOutOfArea(v.x, v.y, output.width, output.height)))) continue;
                }
            } else if (isOutOfAreaOnFace(rotated, inds, output.width, output.height)) if (inds.every(i => isOutOfArea(rotated[i].x, rotated[i].y, output.width, output.height))) continue;

            // Backface culling
            if (!plm.flag.noncull) if (isFaceVisible(rotated, inds, t.offset)) continue;

            idx = t.indices[0];
            pt = rotated[idx];
            scale = pt.scale;
            // center image
            cx = pt.x;
            cy = pt.y;

            square = 1.5 * scale * t.scale * zoom

            if (t.img) {
                im = pixelessImage(t.img, plm.flag.lod ? mydist : 1)
                // set scale image from camera distance
                baseW = im.width;
                baseH = im.height;

                halfW = (baseW / 3) * scale * t.scale * zoom;
                halfH = (baseH / 3) * scale * t.scale * zoom;

                square = Math.min(halfW, halfH)
            }
            // when have 2D image billboard (indices.length == 1 and img)
            if (t.indices.length === 1) {
                if (pt.z < -Math.abs(dist)) continue;

                // when no image
                if (!t.img) {
                    fillCircleImage(output, cx, cy, scale * zoom / 2.2, t.color)
                    continue;
                }

                // fill circle if image is empty
                if (isEmptyImage(t.img)) {
                    fillCircleImage(output, cx, cy, Math.floor(square), t.color)
                    continue;
                }

                halfW /= 1.1
                halfH /= 1.1

                // Draw Simple 2D image (billboard) as quad pixel on image
                // use distortImage or drawing without perspective distortion
                // I will use distortImage draw as vertex quad
                distortImage(im.clone(), output,
                    cx - halfW, cy - halfH,
                    cx + halfW, cy - halfH,
                    cx - halfW, cy + halfH,
                    cx + halfW, cy + halfH,
                    1, true, true);
                continue;
            }

            if (inds.length < 2) continue;
            mydist = (Math.abs(dist) / (Math.abs(dist) - Math.floor((avgZ(rotated, inds) + Math.abs((Math.abs(dist / 0.8) + 0.6180339887))) / Math.abs(dist * scale / zoom))))
            // Draw line canvas when have line color index
            if (linecolor && linecolor > 0) {
                helpers.imageDrawLine(output, rotated[inds[0]].x, rotated[inds[0]].y, rotated[inds[1]].x, rotated[inds[1]].y, linecolor);
                if (inds.length < 3) continue;
                helpers.imageDrawLine(output, rotated[inds[0]].x, rotated[inds[0]].y, rotated[inds[2]].x, rotated[inds[2]].y, linecolor);
                if (inds.length > 3) helpers.imageDrawLine(output, rotated[inds[3]].x, rotated[inds[3]].y, rotated[inds[1]].x, rotated[inds[1]].y, linecolor), helpers.imageDrawLine(output, rotated[inds[3]].x, rotated[inds[3]].y, rotated[inds[2]].x, rotated[inds[2]].y, linecolor);
                else helpers.imageDrawLine(output, rotated[inds[1]].x, rotated[inds[1]].y, rotated[inds[2]].x, rotated[inds[2]].y, linecolor);
                continue;
            }

            // Draw line when no shape
            helpers.imageDrawLine(output,
                rotated[inds[0]].x, rotated[inds[0]].y,
                rotated[inds[1]].x, rotated[inds[1]].y,
                t.color
            );
            // Draw solid when is vertice shape
            if (inds.length > 3) {
                /*
                helpers.imageFillTriangle( output,
                    rotated[inds[3]].x, rotated[inds[3]].y,
                    rotated[inds[1]].x, rotated[inds[1]].y,
                    rotated[inds[2]].x, rotated[inds[2]].y,
                    t.color
                );
                */
                helpers.imageFillPolygon4(output,
                    rotated[inds[3]].x, rotated[inds[3]].y,
                    rotated[inds[2]].x, rotated[inds[2]].y,
                    rotated[inds[0]].x, rotated[inds[0]].y,
                    rotated[inds[1]].x, rotated[inds[1]].y,
                    t.color
                );
            } else if (inds.length > 2) {
                helpers.imageFillTriangle(output,
                    rotated[inds[0]].x, rotated[inds[0]].y,
                    rotated[inds[1]].x, rotated[inds[1]].y,
                    rotated[inds[2]].x, rotated[inds[2]].y,
                    t.color
                );
            }

            // Draw texture over
            if (inds.length === 4 && t.img) {
                distortImage(t.img.clone(), output,
                    rotated[inds[0]].x, rotated[inds[0]].y,
                    rotated[inds[1]].x, rotated[inds[1]].y,
                    rotated[inds[2]].x, rotated[inds[2]].y,
                    rotated[inds[3]].x, rotated[inds[3]].y,
                    plm.flag.lod ? mydist : 1, false, false
                );
            }

        }

        inProcess[0] = false
    }

    function fillCircleImage(dest: Image, x: number, y: number, r: number, c: number) {
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

    function isCull(b: boolean, x: number, y: number) { return b ? x < y : x > y }

    function isFaceVisible(rotated: { x: number, y: number, z: number }[], indices: number[], oface: number): boolean {
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

    export function meshDepthZ(plm: polymesh): number {
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
}