
namespace Polymesh {

    const rotatePoint3D = (point: Vector3, pivot: Vector3, angle: Vector3) => {
        let tmp = 0
        const cosX = Math.cos(angle.x), sinX = Math.sin(angle.x);
        const cosY = Math.cos(angle.y), sinY = Math.sin(angle.y);
        const cosZ = Math.cos(angle.z), sinZ = Math.sin(angle.z);
        // move point with pivot to 1st place
        let dx  = point.x - pivot.x;
        let dy  = point.y - pivot.y;
        let dz  = point.z - pivot.z;

        // --- rotate around x ---
        tmp = dy * cosX - dz * sinX;
        dz = dy * sinX + dz * cosX;
        dy = tmp;

        // --- rotate around y ---
        tmp = dx * cosY + dz * sinY;
        dz = -dx * sinY + dz * cosY;
        dx = tmp;

        // --- rotate around z ---
        tmp = dx * cosZ - dy * sinZ;
        dy = dx * sinZ + dy * cosZ;
        dx = tmp;

        // move back to real position
        return {
            x: dx + pivot.x,
            y: dy + pivot.y,
            z: dz + pivot.z
        };
    };

    //% blockId=poly_rendermesh_all
    //% block=" render all mesh of kind $id=poly_kind_shadow to $output=screen_image_picker|| as line render color? $linecolor=colorindexpicker"
    //% group="render"
    //% weight=9
    export function renderAll(id: number, output: Image, linecolor?: number) {
        if ((id == null || isNaN(id)) || !output) return;
        const sorted = Polymesh.__mesh[id].filter( msh => msh != null || (msh && !msh.isDel())).map(msh => ({ mesh: msh, depth: meshDepthZ(msh) }));
        if (sorted.length <= 0) return;
        switch (sort) {
            case 0x0: sorted.sort(         (a, b) => b.depth - a.depth); break;
            case 0x1: quickSort(   sorted, (a, b) => b.depth - a.depth); break;
            case 0x2:
            default:  duoQuickSort(sorted, (a, b) => b.depth - a.depth); break;
        }
        for (const m of sorted) if (!m.mesh.flag.invisible) render(m.mesh, output, linecolor);
    }

    //% blockId=poly_rendermesh
    //% block=" $msh render to $output=screen_image_picker|| as line render color? $linecolor=colorindexpicker"
    //% msh.shadow=variables_get msh.defl=myMesh
    //% group="render"
    //% weight=10
    export function render(msh: polymesh, output: Image, linecolor?: number) {
        if (msh.isDel()) return;
        if (!msh || !output || msh.points.length <= 0 || msh.faces.length <= 0) return;
        if (msh.flag.invisible) return;
        let tmp = 0

        const centerX = output.width >> 1, centerY = output.height >> 1;

        const cosX = Math.cos(angle.x), sinX = Math.sin(angle.x);
        const cosY = Math.cos(angle.y), sinY = Math.sin(angle.y);
        const cosZ = Math.cos(angle.z), sinZ = Math.sin(angle.z);

        // Transform vertices
        const rotated = msh.points.map(v => {
            const vpoint = { x: msh.pos.x + v.x, y: msh.pos.y + v.y, z: msh.pos.z + v.z }
            const vpivot = { x: msh.pos.x + msh.pivot.x, y: msh.pos.y + msh.pivot.y, z: msh.pos.z + msh.pivot.z }
            const vpos = rotatePoint3D(vpoint, vpivot, msh.rot)
            // camera offset
            let x = vpos.x - cam.x;
            let y = vpos.y - cam.y;
            let z = vpos.z - cam.z;

            // --- rotate around x ---
            tmp = y * cosX - z * sinX;
            z = y * sinX + z * cosX;
            y = tmp;

            // --- rotate around y ---
            tmp = x * cosY + z * sinY;
            z = -x * sinY + z * cosY;
            x = tmp;

            // --- rotate around z ---
            tmp = x * cosZ - y * sinZ;
            y = x * sinZ + y * cosZ;
            x = tmp;

            // Perspective
            const scale = Math.abs(dist) / (Math.abs(dist) + z);
            return {
                x: centerX + x * scale * zoom,
                y: centerY + y * scale * zoom,
                z: z,
            };
        })

        // Sort triangles
        const tris = msh.faces.slice();
        switch (sort) {
            case 0x0: tris.sort(         (a, b) => avgZ(rotated, b.indices) - avgZ(rotated, a.indices)); break;
            case 0x1: quickSort(   tris, (a, b) => avgZ(rotated, b.indices) - avgZ(rotated, a.indices)); break;
            case 0x2:
            default:  duoQuickSort(tris, (a, b) => avgZ(rotated, b.indices) - avgZ(rotated, a.indices)); break;
        }

        // Render
        let idx: number, pt: Vector3, cx: number, cy: number, scale: number, range: number, baseW: number, baseH: number, halfW: number, halfH: number, square: number, im: Image
        for (const t of tris) {
            const inds = t.indices;
            if (inds.some(i => rotated[i].z < -Math.abs(dist) || (fardist > 0 && rotated[i].z > Math.abs(fardist)))) continue;
            // LOD calculating?
            if (t.img) {
                im = t.img.clone();
                if (msh.flag.lod) {
                    const scaleD = ((Math.abs(dist) / (Math.abs(dist) + avgZ(rotated, inds))) * zoom) / LOD_DIST
                    im = image.create(Math.clamp(1, t.img.width, scaleD * t.img.width), Math.clamp(1, t.img.height, scaleD * t.img.height))
                    resizeImage(t.img.clone(), im, true)
                }
            }
            if (t.indices.length === 1) {
                idx = t.indices[0];
                pt = rotated[idx];

                // center image
                cx = pt.x;
                cy = pt.y;

                const bq = [
                    { x: cx, y: cy },
                    { x: cx, y: cy },
                    { x: cx, y: cy },
                    { x: cx, y: cy },
                ]

                scale = (Math.abs(dist) / (Math.abs(dist) + pt.z));
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
            if (!msh.flag.noncull) if (isFaceVisible(rotated, inds, t.offset)) continue;

            idx = t.indices[0];
            pt = rotated[idx];
            scale = (Math.abs(dist) / (Math.abs(dist) + pt.z));
            // center image
            cx = pt.x;
            cy = pt.y;

            square = 1.5 * scale * t.scale * zoom

            if (t.img) {
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
                if (!t.img) { fillCircleImage(output, cx, cy, scale * zoom / 2.2, t.color); continue; }

                // fill circle if image is empty
                if (isEmptyImage(t.img)) { fillCircleImage(output, cx, cy, Math.floor(square), t.color); continue; }

                halfW /= 1.1
                halfH /= 1.1

                // Draw Simple 2D image (billboard) as quad pixel on image
                // use distortImage or drawing without perspective distortion
                // I will use distortImage draw as vertex quad
                distortImage(im, output,
                    cx + halfW, cy - halfH,
                    cx - halfW, cy - halfH,
                    cx - halfW, cy + halfH,
                    cx + halfW, cy + halfH
                );
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
                if (inds.length > 2) {
                    // Draw solid when is vertice shape
                    helpers.imageFillTriangle(output,
                        rotated[inds[0]].x, rotated[inds[0]].y,
                        rotated[inds[1]].x, rotated[inds[1]].y,
                        rotated[inds[2]].x, rotated[inds[2]].y,
                        t.color
                    );
                    if (inds.length > 3) {
                        helpers.imageFillTriangle( output,
                            rotated[inds[3]].x, rotated[inds[3]].y,
                            rotated[inds[1]].x, rotated[inds[1]].y,
                            rotated[inds[2]].x, rotated[inds[2]].y,
                            t.color
                        );
                    }
                }
            }

            // Draw texture over
            if (inds.length === 4 && t.img) {
                distortImage(im, output,
                    rotated[inds[3]].x, rotated[inds[3]].y,
                    rotated[inds[2]].x, rotated[inds[2]].y,
                    rotated[inds[0]].x, rotated[inds[0]].y,
                    rotated[inds[1]].x, rotated[inds[1]].y
                );
            }

        }

    }
    
}
