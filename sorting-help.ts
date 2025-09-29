
namespace Polymesh {

    export const swap = <T>(arr: T[], i: number, j: number) => {
        const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    };

    export const partition = <T>(arr: T[], cmp: (a: T, b: T) => number, l: number, r: number) => {
        const pivot = arr[r]; let i = l, j = r - 1;
        while (i <= j) {
            while (i <= j && cmp(arr[i], pivot) < 0) i++;
            while (i <= j && cmp(arr[j], pivot) > 0) j--;
            if (i <= j) { swap(arr, i, j); i++; j--; }
        }
        swap(arr, i, r); return i;
    };

    export const insertionSort = <T>(arr: T[], cmp: (a: T, b: T) => number, l: number, r: number) => {
        for (let i = l + 1; i <= r; i++) {
            const key = arr[i]; let j = i - 1;
            while (j >= l && cmp(arr[j], key) > 0) { arr[j + 1] = arr[j]; j--; }
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
        for (let i = (lo + ((hi - lo + 1) >> 1)) - 1; i >= lo; i--) heapify(arr, cmp, i, hi);
        // Heap sort
        for (let end = hi; end > lo; end--) { swap(arr, lo, end); heapify(arr, cmp, lo, end - 1); }
    }

}
