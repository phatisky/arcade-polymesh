
namespace Polymesh {

    export const swap = <T>(arr: T[], i: number, j: number) => { const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; };

    export const partition = <T>(arr: T[], cmp: (a: T, b: T) => number, l: number, r: number) => {
        let pivot = arr[r], i = l;
        for (let j = l; j < r; j++) if (cmp(arr[j], pivot) < 0) swap(arr, i++, j);
        swap(arr, i, r); return i;
    };

    export function quickSort<T>(arr: T[], cmp: (a: T, b: T) => number) {
        if (isSorted(arr, cmp)) return;
        const stack: number[][] = [[0, arr.length - 1]];
        while (stack.length) {
            const range = stack.pop(); if (!range) continue;
            let lo = range[0], hi = range[1];
            while (lo < hi) {
                const p = partition(arr, cmp, lo, hi);
                if (p - lo < hi - p) stack.push([lo, p - 1]), lo = p + 1;
                else stack.push([p + 1, hi]), hi = p - 1;
            }
        }
    }

    export const insertionSort = <T>(arr: T[], cmp: (a: T, b: T) => number, l: number, r: number) => {
        for (let i = l + 1; i <= r; i++) {
            const key = arr[i]; let j = i - 1;
            while (j >= l && cmp(arr[j], key) > 0) arr[j + 1] = arr[j], j--;
            arr[j + 1] = key;
        }
    };

    const heapify = <T>(arr: T[], cmp: (a: T, b: T) => number, start: number, end: number) => {
        let root = start;
        while ((root << 1) + 1 <= end) {
            let child = (root << 1) + 1, swapIdx = root;
            if (cmp(arr[swapIdx], arr[child]) < 0) swapIdx = child;
            if (child + 1 <= end && cmp(arr[swapIdx], arr[child + 1]) < 0) swapIdx = child + 1;
            if (swapIdx === root) return;
            swap(arr, root, swapIdx); root = swapIdx;
        }
    };

    export const heapSort = <T>(arr: T[], cmp: (a: T, b: T) => number, lo: number, hi: number) => {
        // Build heap
        for (let i = (lo + ((hi - lo + 1) >> 1)) - 1; i >= (!lo ? 0 : lo); i--) heapify(arr, cmp, i, hi);
        // Heap sort
        for (let end = hi; end > lo; end--) swap(arr, lo, end), heapify(arr, cmp, lo, end - 1);
    }

    export function introSort<T>(arr: T[], cmp: (a: T, b: T) => number) {
        if (isSorted(arr, cmp)) return;
        // Stack 2D: [lo, hi, depth]
        const stack: number[][] = [[0, arr.length - 1, logb(arr.length) << 1]];
        while (stack.length > 0) {
            const prop = stack.pop(); if (!prop) continue;
            let lo = prop[0], hi = prop[1], depth = prop[2], size = hi - lo + 1;
            if (size <= 16) { insertionSort(arr, cmp, lo, hi); continue; }
            if (depth <= 0) { heapSort(arr, cmp, lo, hi); continue; }
            while (lo < hi) {
                // Partition for iterative
                const p = partition(arr, cmp, lo, hi); depth--;
                // Push subarrays
                if (p - lo < hi - p) stack.push([lo, p - 1]), lo = p + 1;
                else stack.push([p + 1, hi]), hi = p - 1;
            }
        }
    }

}

