
namespace Polymesh {

    export function introSort<T>(arr: T[], cmp: (a: T, b: T) => number) {
        if (isSorted(arr, cmp)) return;

        // Stack 2D: [lo, hi, depth]
        const stack: number[][] = [[0, arr.length - 1, blog(arr.length) << 1]];

        while (stack.length > 0) {
            const prop = stack.pop(); if (!prop) continue;
            const lo = prop[0], hi = prop[1], depth = prop[2], size = hi - lo + 1;

            if (size <= 16) {
                insertionSort(arr, cmp, lo, hi);
                continue;
            }

            if (depth <= 0) {
                heapSort(arr, cmp, lo, hi);
                continue;
            }

            // Partition for iterative
            const p = partition(arr, cmp, lo, hi);
            // Push subarrays
            if (p - 1 > lo) stack.push([lo, p - 1, depth - 1]);
            if (p + 1 < hi) stack.push([p + 1, hi, depth - 1]);
        }
    }

}
