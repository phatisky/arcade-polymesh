
namespace Polymesh {

    const swap = <T>(arr: T[], i: number, j: number) => { const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; };

    const median3 = <T>(arr: T[], cmp: (a: T, b: T) => number, l: number, r: number) => {
        const m = (l + r) >> 1;
        if (cmp(arr[l], arr[m]) > 0) swap(arr, l, m);
        if (cmp(arr[l], arr[r]) > 0) swap(arr, l, r);
        if (cmp(arr[m], arr[r]) > 0) swap(arr, m, r);
        return m;
    };

    const partition = <T>(arr: T[], cmp: (a: T, b: T) => number, l: number, r: number) => {
        const piv = median3(arr, cmp, l, r), pivot = arr[piv]; let i = l; swap(arr, piv, r);
        for (let j = l; j < r; j++) if (cmp(arr[j], pivot) < 0) swap(arr, i++, j);
        swap(arr, i, r); return i;
    };

    const insertionSort = <T>(arr: T[], cmp: (a: T, b: T) => number, l: number, r: number) => {
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

    const heapSort = <T>(arr: T[], cmp: (a: T, b: T) => number, lo: number, hi: number) => {
        // Build heap
        for (let i = (lo + ((hi - lo + 1) >> 1)) - 1; i >= (!lo ? 0 : lo); i--) heapify(arr, cmp, i, hi);
        // Heap sort
        for (let end = hi; end > lo; end--) swap(arr, lo, end), heapify(arr, cmp, lo, end - 1);
    }

    export function introSort<T>(arr: T[], cmp: (a: T, b: T) => number, quick?: boolean) {
        if (isSorted(arr, cmp)) return;
        // Stack 2D: [lo, hi, depth]
        const stack: number[][] = [[0, arr.length - 1, logb(arr.length) << 1]];
        while (stack.length > 0) {
            const prop = stack.pop(); if (!prop) continue;
            let lo = prop[0], hi = prop[1], depth = prop[2], size = hi - lo + 1;
            while (lo < hi) {
                if (!quick) { if (size <= 16) { insertionSort(arr, cmp, lo, hi); break; }; if (depth <= 0) { heapSort(arr, cmp, lo, hi); break; }; };
                // Partition for iterative
                const p = partition(arr, cmp, lo, hi); depth--;
                // Push subarrays
                if (p - lo < hi - p) stack.push([lo, p - 1, depth]), lo = p + 1;
                else                 stack.push([p + 1, hi, depth]), hi = p - 1;
            }
        }
    }

}

