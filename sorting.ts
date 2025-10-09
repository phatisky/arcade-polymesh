
namespace Polymesh {

    const duoPartition = <T>(arr: T[], cmp: (a: T, b: T) => number, lo: number, hi: number) => {
        let p = arr[lo], q = arr[hi];
        if (cmp(p, q) > 0) swap(arr, lo, hi), p = arr[lo], q = arr[hi];
        let j = lo + 1, g = hi - 1;
        for (let k = lo + 1; k < g; k++) {
            if (cmp(arr[k], p) < 0) swap(arr, k, j++);
            else if (cmp(arr[k], q) >= 0) {
                while (cmp(arr[g], q) > 0 && k < g) g--;
                swap(arr, k, g--);
                if (cmp(arr[k], p) < 0) swap(arr, k, j++);
            }
        }
        swap(arr, lo, --j), swap(arr, hi, ++g);
        return [j, g];
    }

    // --- duoQuickSort ---
    export function duoQuickSort<T>(arr: T[], cmp: (a: T, b: T) => number) {
        const stack: number[][] = [[0, arr.length - 1]];
        while (stack.length > 0) {
            let [lo, hi] = stack.pop();
 
            while (lo < hi) {
                const [lp, rp] = duoPartition(arr, cmp, lo, hi);
                // Push larger segment first to optimize tail recursion
                if (lp - lo < hi - rp) {
                    lo = rp + 1;
                    stack.push([lo, lp - 1]);
                    if (lp <= rp) stack.push([lp + 1, rp - 1]);
                } else {
                    if (lp <= rp) stack.push([lp + 1, rp - 1]);
                    stack.push([rp + 1, hi]);
                    hi = lp - 1;
                }
            }
        }
    }

    const median3 = <T>(arr: T[], cmp: (a: T, b: T) => number, l: number, r: number) => {
        const m = (l + r) >> 1;
        if (cmp(arr[l], arr[m]) > 0) swap(arr, l, m);
        if (cmp(arr[l], arr[r]) > 0) swap(arr, l, r);
        if (cmp(arr[m], arr[r]) > 0) swap(arr, m, r);
        return m;
    };

    const partition = <T>(arr: T[], cmp: (a: T, b: T) => number, l: number, r: number) => {
        const pivot = arr[r]; let i = l;
        for (let j = l; j < r; j++) if (cmp(arr[j], pivot) < 0) swap(arr, i++, j);
        swap(arr, i, r); return i;
    };

    export function quickSort<T>(arr: T[], cmp: (a: T, b: T) => number) {
        // Stack 2D: [lo, hi, depth]
        const stack: number[][] = [[0, arr.length - 1]];
        while (stack.length > 0) {
            let [lo, hi] = stack.pop(), size = hi - lo + 1;
            while (lo < hi) {
                // Partition for iterative
                const p = partition(arr, cmp, lo, hi);
                // Push subarrays
                if (p - lo < hi - p) stack.push([lo, p - 1]), lo = p + 1;
                else stack.push([p + 1, hi]), hi = p - 1;
            }
        }
    }


}
