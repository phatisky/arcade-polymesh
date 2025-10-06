
namespace Polymesh {

    const rotatePoint3D = (point: { x: number, y: number, z: number }, pivot: { x: number, y: number, z: number }, angle: { x: number, y: number, z: number }) => {

        // move point with pivot to 1st place
        let dx  = point.x - pivot.x;
        let dy  = point.y - pivot.y;
        let dz  = point.z - pivot.z;

        // --- rotate around x ---
        let dy1 = dy * Math.cos(angle.x) - dz * Math.sin(angle.x);
        let dz1 = dy * Math.sin(angle.x) + dz * Math.cos(angle.x);
            dy  = dy1;
            dz  = dz1;

        // --- rotate around y ---
        let dx1 = dx * Math.cos(angle.y) + dz * Math.sin(angle.y);
            dz1 = -dx * Math.sin(angle.y) + dz * Math.cos(angle.y);
            dx  = dx1;
            dz  = dz1;

        // --- rotate around z ---
            dx1 = dx * Math.cos(angle.z) - dy * Math.sin(angle.z);
            dy1 = dx * Math.sin(angle.z) + dy * Math.cos(angle.z);
            dx  = dx1;
            dy  = dy1;

        // move back to real position
        return {
            x: dx + pivot.x,
            y: dy + pivot.y,
            z: dz + pivot.z
        };
    };

    //% blockId=poly_rendermesh_all
    //% block=" $plms render all meshes to $output=screen_image_picker|| as line render color? $linecolor=colorindexpicker"
    //% plms.shadow=variables_get plms.defl=myMeshes
    //% group="render"
    //% weight=9
    export function renderAll(plms: polymesh[], output: Image, linecolor?: number) {
        if (!plms || !output || plms.length <= 0) return;
        if (inProcess[1]) return;
        inProcess[1] = true
        const sorted = plms.filter( plm => !plm || !plm.isDel() ).map(plm => ({ mesh: plm, depth: meshDepthZ(plm) }));
        switch (sort) {
            case 0x0: sorted.sort(         (a, b) => b.depth - a.depth); break;
            case 0x1: smoothSort(  sorted, (a, b) => b.depth - a.depth);
                      shellSort(   sorted, (a, b) => b.depth - a.depth); break;
            case 0x2:
            default:  duoQuickSort(sorted, (a, b) => b.depth - a.depth); break;
        }
        for (const m of sorted) if (!m.mesh.isDel() || !m.mesh.flag.invisible) render(m.mesh, output, linecolor);
        inProcess[1] = false
    }

    //% blockId=poly_rendermesh
    //% block=" $plm render to $output=screen_image_picker|| as line render color? $linecolor=colorindexpicker"
    //% plm.shadow=variables_get plm.defl=myMesh
    //% group="render"
    //% weight=10
    export function render(plm: polymesh, output: Image, linecolor?: number) {
        if (plm.isDel()) return;
        if (!plm || !output || plm.points.length <= 0 || plm.faces.length <= 0) return;
        if (plm.flag.invisible) return;

        if (inProcess[0]) return;
        inProcess[0] = true

        const centerX = output.width  >> 1;
        const centerY = output.height >> 1;

        const cosX = Math.cos(ax), sinX = Math.sin(ax);
        const cosY = Math.cos(ay), sinY = Math.sin(ay);
        const cosZ = Math.cos(az), sinZ = Math.sin(az);

        // Transform vertices
        const rotated = plm.points.map(v => {
            const vpoint = { x: plm.pos.x + v.x, y: plm.pos.y + v.y, z: plm.pos.z + v.z }
            const vpivot = { x: plm.pos.x + plm.pivot.x, y: plm.pos.y + plm.pivot.y, z: plm.pos.z + plm.pivot.z }
            const vpos   = rotatePoint3D(vpoint, vpivot, plm.rot)
            // camera offset
            let x  = vpos.x - camx;
            let y  = vpos.y - camy;
            let z  = vpos.z - camz;

            // rotate camera
            let tx = x * cosY + z * sinY;
                z  = -x * sinY + z * cosY;
                x  = tx;

            let ty = y * cosX - z * sinX;
                z  = y * sinX + z * cosX;
                y  = ty;

                tx = x * cosZ - y * sinZ;
                y  = x * sinZ + y * cosZ;
                x  = tx;

            // Perspective
            const scale = Math.abs(dist) / (Math.abs(dist) + z);
            return {
                scale: scale,
                x: centerX + x * scale * zoom,
                y: centerY + y * scale * zoom,
                z: z,
            };
        })

        // Sort triangles
        const tris = plm.faces.slice();
        switch (sort) {
            case 0x0: tris.sort(         (a, b) => avgZ(rotated, b.indices) - avgZ(rotated, a.indices)); break;
            case 0x1: smoothSort(  tris, (a, b) => avgZ(rotated, b.indices) - avgZ(rotated, a.indices));
                      shellSort(   tris, (a, b) => avgZ(rotated, b.indices) - avgZ(rotated, a.indices)); break;
            case 0x2:
            default:  duoQuickSort(tris, (a, b) => avgZ(rotated, b.indices) - avgZ(rotated, a.indices)); break;
        }

        // Render
        for (const t of tris) {
            const inds = t.indices;
            if (inds.some(i => rotated[i].z < -Math.abs(dist) || (fardist > 0 && rotated[i].z > Math.abs(fardist)))) continue;
            let idx: number, pt: { scale: number, x: number, y: number, z: number }, cx: number, cy: number, scale: number, range: number, baseW: number, baseH: number, halfW: number, halfH: number, square: number, im: Image
            // LOD calculating?
            if (t.img) {
                im = t.img.clone();
                if (plm.flag.lod) {
                    let scaleD = Math.abs(dist) / (Math.abs(dist) + avgZ(rotated, inds))
                        scaleD = ((scaleD * zoom) / SDIST)
                    im = image.create(Math.clamp(1, t.img.width, scaleD * t.img.width), Math.clamp(1, t.img.height, scaleD * t.img.height))
                    resizeImage(t.img.clone(), im, true, true)
                }
            }
            if (t.indices.length === 1) {
                idx = t.indices[0];
                pt  = rotated[idx];

                // center image
                cx  = pt.x;
                cy  = pt.y;

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
                    baseW    = im.width;
                    baseH    = im.height;

                    halfW    = (baseW / 3) * scale * t.scale * zoom;
                    halfH    = (baseH / 3) * scale * t.scale * zoom;
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

            idx   = t.indices[0];
            pt    = rotated[idx];
            scale = pt.scale;
            // center image
            cx    = pt.x;
            cy    = pt.y;

            square = 1.5 * scale * t.scale * zoom

            if (t.img) {
                // set scale image from camera distance
                baseW  = im.width;
                baseH  = im.height;

                halfW  = (baseW / 3) * scale * t.scale * zoom;
                halfH  = (baseH / 3) * scale * t.scale * zoom;

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
                distortImage(im, output,
                    cx - halfW, cy - halfH,
                    cx + halfW, cy - halfH,
                    cx - halfW, cy + halfH,
                    cx + halfW, cy + halfH,
                    true, true);
                continue;
            }

            if (inds.length < 2) continue;
            // Draw line canvas when have line color index
            if (linecolor && linecolor > 0) {
                helpers.imageDrawLine(output, rotated[inds[0]].x, rotated[inds[0]].y, rotated[inds[1]].x, rotated[inds[1]].y, linecolor);
                if (inds.length < 3) continue;
                helpers.imageDrawLine(output, rotated[inds[0]].x, rotated[inds[0]].y, rotated[inds[2]].x, rotated[inds[2]].y, linecolor);
                if (inds.length > 3) helpers.imageDrawLine(output, rotated[inds[3]].x, rotated[inds[3]].y, rotated[inds[1]].x, rotated[inds[1]].y, linecolor), helpers.imageDrawLine(output, rotated[inds[3]].x, rotated[inds[3]].y, rotated[inds[2]].x, rotated[inds[2]].y, linecolor);
                else helpers.imageDrawLine(output, rotated[inds[1]].x, rotated[inds[1]].y, rotated[inds[2]].x, rotated[inds[2]].y, linecolor);
                continue;
            }
            if (t.color > 0) {
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
            }

            // Draw texture over
            if (inds.length === 4 && t.img) {
                distortImage(im, output,
                    rotated[inds[0]].x, rotated[inds[0]].y,
                    rotated[inds[1]].x, rotated[inds[1]].y,
                    rotated[inds[2]].x, rotated[inds[2]].y,
                    rotated[inds[3]].x, rotated[inds[3]].y,
                    false, false
                );
            }

        }

        inProcess[0] = false
    }
    
}
