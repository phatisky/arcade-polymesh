
namespace Polymesh {

    // --- Shell Sort ---
    export const shellSort = <T>(arr: T[], cmp: (a: T, b: T) => number, lo?: number, hi?: number) => {
        if (!lo) lo = 0; if (!hi) hi = arr.length - 1;
        const n = hi - lo + 1; let gap = n >> 1;
        while (gap > 0) {
            for (let i = lo + gap; i <= hi; i++) {
                const tmp = arr[i]; let j = i;
                while (j >= lo + gap && cmp(arr[j - gap], tmp) > 0) arr[j] = arr[j - gap], j -= gap;
                arr[j] = tmp;
            }
            gap >>= 1
        }
    }

    // --- Smooth Sort (simplified, iterative) ---
    export const smoothSort = <T>(arr: T[], cmp: (a: T, b: T) => number, lo?: number, hi?: number) => {
        if (!lo) lo = 0; if (!hi) hi = arr.length - 1;
        const n = hi - lo + 1, L: number[] = [1, 1];
        for (let i = 2; i <= n; i++) L[i] = L[i - 1] + L[i - 2] + 1;

        const heapSizes: number[] = [];
        for (let i = lo; i <= hi; i++) {
            let size = 1;
            if (heapSizes.length >= 2 && heapSizes[heapSizes.length - 2] === heapSizes[heapSizes.length - 1] + 1) size = heapSizes.pop() + 1, heapSizes.pop();
            heapSizes.push(size);

            // Heapify root
            let root = i, sz = size;
            while (sz >= 2) {
                const left = root - L[sz - 2], right = root - 1;
                let largest = root;
                if (cmp(arr[left], arr[largest]) > 0) largest = left;
                if (cmp(arr[right], arr[largest]) > 0) largest = right;
                if (largest === root) break; swap(arr, root, largest);
                if (largest === left) root = left, sz -= 2;
                else root = right, sz -= 1;
            }
        }
    }

    // TypeScript Dual-Pivot QuickSort with Tail Recursion Optimization and Median-of-3/4
    const median3 = <T>(arr: T[], a: number, b: number, c: number, cmp: (x: T, y: T) => number) => {
        // Return index of median element
        if (cmp(arr[a], arr[b]) > 0) swap(arr, a, b);
        if (cmp(arr[a], arr[c]) > 0) swap(arr, a, c);
        if (cmp(arr[b], arr[c]) > 0) swap(arr, b, c);
        return b; // middle value after swaps
    }

    const partition = <T>(arr: T[], low: number, high: number, cmp: (a: T, b: T) => number) => {
        const mid = (low + high) >> 1, lpIdx = median3(arr, low, mid, high, cmp);
        swap(arr, low, lpIdx);
        let p = arr[low], q = arr[high];
        if (cmp(p, q) > 0) swap(arr, low, high), p = arr[low], q = arr[high];
        let j = low + 1, g = high - 1, k = low + 1;
        while (k <= g) {
            if (cmp(arr[k], p) < 0) {
                swap(arr, k, j++);
            } else if (cmp(arr[k], q) >= 0) {
                while (cmp(arr[g], q) > 0 && k < g) g--;
                swap(arr, k, g--);
                if (cmp(arr[k], p) < 0) swap(arr, k, j++);
            }
            k++;
        }
        swap(arr, low, --j), swap(arr, high, ++g);
        return [j, g];
    }

    // --- duoQuickSort ---
    export function duoQuickSort<T>(arr: T[], cmp: (a: T, b: T) => number) {
        const stack: number[][] = [[0, arr.length - 1]];
        while (stack.length > 0) {
            const [low, high] = stack.pop();
 
            if (low < high) {
                const [lp, rp] = partition(arr, low, high, cmp);
                // Push larger segment first to optimize tail recursion
                if (lp - low < high - rp) {
                    if (lp <= rp) stack.push([lp + 1, rp - 1]);
                    stack.push([low, lp - 1]);
                    stack.push([rp + 1, high]);
                } else {
                    stack.push([rp + 1, high]);
                    if (lp <= rp) stack.push([lp + 1, rp - 1]);
                    stack.push([low, lp - 1]);
                }
            }
        }
    }

}
