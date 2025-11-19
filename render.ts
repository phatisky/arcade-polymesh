
namespace Polymesh {

    //% blockId=poly_rendermesh_all
    //% block=" render all mesh of kind $id=poly_kind_shadow to $output=screen_image_picker|| form line render $lineren=toggleYesNo"
    //% group="rendeer"
    //% weight=9qee
    export function renderAll(id: number, output: Image, lineren?: boolean) {
        if ((id == null || isNaN(id)) || !output) return;
        const sorted = meshAll(id).map(msh => ({ mesh: msh, depth: msh.zDepth() }))
        if (sorted.length <= 0) return;
        switch (sort) {
            case 0x0: sorted.sort((a, b) => b.depth - a.depth); break;
            case 0x1: quickSort(sorted, (a, b) => b.depth - a.depth); break;
            case 0x2:
            default: duoQuickSort(sorted, (a, b) => b.depth - a.depth); break;
        }
        for (const m of sorted) if (!m.mesh.flag.invisible) render(m.mesh, output, lineren);
    }

    //% blockId=poly_rendermesh
    //% block=" $msh render to $output=screen_image_picker|| as line render $lineren=toggleYesNo"
    //% msh.shadow=variables_get msh.defl=myMesh
    //% group="render"
    //% weight=10
    export function render(msh: polymesh, output: Image, lineren?: boolean) {
        if (msh.isDel()) return;
        if (!msh || !output || msh.points.length <= 0 || msh.faces.length <= 0) return;
        if (msh.flag.invisible) return;

        const centerX = Math.idiv(output.width, 2), centerY = Math.idiv(output.height, 2);

        let tmp = 0
        const cosX = Math.cos(angle.x), sinX = Math.sin(angle.x);
        const cosY = Math.cos(angle.y), sinY = Math.sin(angle.y);
        const cosZ = Math.cos(angle.z), sinZ = Math.sin(angle.z);

        // Transform vertices
        const rotated = msh.pointCam((v) => {
            let x = v.x - cam.x;
            let y = v.y - cam.y;
            let z = v.z - cam.z;
            tmp = x * cosY + z * sinY, z = -x * sinY + z * cosY, x = tmp; // --- rotate around y ---
            tmp = y * cosX - z * sinX, z =  y * sinX + z * cosX, y = tmp; // --- rotate around x ---
            tmp = x * cosZ - y * sinZ, y =  x * sinZ + y * cosZ, x = tmp; // --- rotate around z ---

            const vsum = 0.1 / Math.sqrt((x * x) + (y * y) + (z * z))
            // camera offset
            x += (x === 0 ? 0 : vsum);
            y += (y === 0 ? 0 : vsum);
            z += (z === 0 ? 0 : vsum);
            // Perspective
            const scale = Math.abs(dist) / (Math.abs(dist) + z);
            return {
                x: centerX + x * scale * zoom,
                y: centerY + y * scale * zoom,
                z: z,
                x_: v.x,
                y_: v.y,
                z_: v.z,
            };
        }) as Vector3_[];

        // Sort triangles
        const tris = msh.faces.slice();
        switch (sort) {
            case 0x0: tris.sort((a, b) => avgZ(rotated, b.indices) - avgZ(rotated, a.indices)); break;
            case 0x1: quickSort(tris, (a, b) => avgZ(rotated, b.indices) - avgZ(rotated, a.indices)); break;
            case 0x2:
            default: duoQuickSort(tris, (a, b) => avgZ(rotated, b.indices) - avgZ(rotated, a.indices)); break;
        }

        // Render
        let cx: number, cy: number, range: number, square: number, im: Image
        for (const t of tris) {
            const inds = t.indices;
            const inds_ = [];
            if (inds.length > 2) inds_[0] = [t.indices[0], t.indices[1], t.indices[2]];
            if (inds.length > 3) inds_[1] = [t.indices[3], t.indices[1], t.indices[2]];
            const scale = (Math.abs(dist) / (Math.abs(dist) + avgZ(rotated, t.indices)));
            if (inds.some(i => rotated[i].z < -Math.abs(dist) || (fardist > 0 && rotated[i].z > Math.abs(fardist)))) continue;
            // LOD calculating?
            if (t.img) {
                im = t.img.clone();
                if (msh.flag.lod) {
                    const scaleD = (scale * zoom);
                    const imi = t.imgs[Math.clamp(0, t.imgs.length - 1, Math.trunc((Math.sqrt(scaleD / 1.5) * PHI) * (t.imgs.length - 1)))]
                    if (imi) im = imi.clone();
                }
            }
            if (t.indices.length === 1) {
                const idx = t.indices[0];
                const pt = rotated[idx];

                // center image
                cx = pt.x;
                cy = pt.y;

                const bq = [
                    { x: cx, y: cy },
                    { x: cx, y: cy },
                    { x: cx, y: cy },
                    { x: cx, y: cy },
                ]

                square = 1.5 * scale * t.scale * zoom
                if (im) {
                    // set scale image from camera distance
                    const baseW = im.width;
                    const baseH = im.height;
                    const halfW = (baseW / 3) * scale * t.scale * zoom;
                    const halfH = (baseH / 3) * scale * t.scale * zoom;

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

            const culling = (!msh.flag.noncull || t.offset !== 0)

            // Backface culling
            if (culling)
                if ((inds_[0] && !shouldRenderFace(rotated, inds_[0], cam, t.offset)) &&
                    (inds_[1] && !shouldRenderFace(rotated, inds_[1], cam, t.offset))) continue;

            const idx = t.indices[0];
            const pt = rotated[idx];
            // center image
            cx = pt.x;
            cy = pt.y;

            square = 1.5 * scale * t.scale * zoom

            let halfW = 0;
            let halfH = 0;

            if (t.img) {
                // set scale image from camera distance
                const baseW = im.width;
                const baseH = im.height;

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

                halfW /= 1.1;
                halfH /= 1.1;

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
            if (lineren) {
                helpers.imageDrawLine(output, rotated[inds[0]].x, rotated[inds[0]].y, rotated[inds[1]].x, rotated[inds[1]].y, t.color);
                if (inds.length < 3) continue;
                helpers.imageDrawLine(output, rotated[inds[0]].x, rotated[inds[0]].y, rotated[inds[2]].x, rotated[inds[2]].y, t.color);
                if (inds.length > 3) helpers.imageDrawLine(output, rotated[inds[3]].x, rotated[inds[3]].y, rotated[inds[1]].x, rotated[inds[1]].y, t.color), helpers.imageDrawLine(output, rotated[inds[3]].x, rotated[inds[3]].y, rotated[inds[2]].x, rotated[inds[2]].y, t.color);
                else helpers.imageDrawLine(output, rotated[inds[1]].x, rotated[inds[1]].y, rotated[inds[2]].x, rotated[inds[2]].y, t.color);
                continue;
            }
            if (t.color > 0) {
                // Draw line when no shape
                if (inds.length < 3) {
                    helpers.imageDrawLine(output,
                        rotated[inds[0]].x, rotated[inds[0]].y,
                        rotated[inds[1]].x, rotated[inds[1]].y,
                        t.color
                    );
                }
                if (inds.length > 2) {
                    // Draw solid when is vertice shape
                    helpers.imageFillTriangle(output,
                        rotated[inds[0]].x, rotated[inds[0]].y,
                        rotated[inds[1]].x, rotated[inds[1]].y,
                        rotated[inds[2]].x, rotated[inds[2]].y,
                        t.color
                    );
                    if (inds.length > 3) {
                        helpers.imageFillTriangle(output,
                            rotated[inds[3]].x, rotated[inds[3]].y,
                            rotated[inds[1]].x, rotated[inds[1]].y,
                            rotated[inds[2]].x, rotated[inds[2]].y,
                            t.color
                        );
                    }
                }
            }

            if ((t.img && isEmptyImage(t.img)) || !t.img) continue;

            // Draw texture over
            if (inds.length > 2) {
                distortImage(im, output,
                    rotated[inds[3]].x, rotated[inds[3]].y,
                    rotated[inds[2]].x, rotated[inds[2]].y,
                    rotated[inds[0]].x, rotated[inds[0]].y,
                    rotated[inds[1]].x, rotated[inds[1]].y
                );
            } else if (inds.length > 3) {
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
