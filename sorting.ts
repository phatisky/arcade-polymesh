
namespace Polymesh {

    const mid = (lo: number, hi: number) => lo + ((hi - lo) >> 1) + ((hi - lo) & 1)

    const duoPartition = <T>(arr: T[], cmp: (a: T, b: T) => number, lo: number, hi: number) => {
        const mi = zigzum(0, arr.length - 1, mid(lo, hi)); swap(arr, mi, hi);
        if (cmp(arr[lo], arr[hi]) > 0) swap(arr, lo, hi);
        const p = arr[lo], q = arr[hi]; 
        let lp = lo + 1, rp = hi - 1;
        for (let k = lp; k <= rp; k++) {
            if (cmp(arr[k], p) < 0) swap(arr, k, lp++);
            else if (cmp(arr[k], q) > 0) {
                while (cmp(arr[rp], q) > 0 && k < rp) rp--;
                swap(arr, k, rp--);
                if (cmp(arr[k], p) < 0) swap(arr, k, lp++);
            }
        }
        swap(arr, lo, --lp), swap(arr, hi, ++rp);
        return [lp, rp];
    }

    // --- duoQuickSort ---
    export function duoQuickSort<T>(arr: T[], cmp: (a: T, b: T) => number) {
        const stack: number[][] = [[0, arr.length - 1]];
        while (stack.length > 0) {
            let [lo, hi] = stack.pop();
            while (lo < hi) {
                const [lp, rp] = duoPartition(arr, cmp, lo, hi);
                // Middle Subarray (lp+1 to rp-1)
                if (lp <= rp) stack.push([lp + 1, rp - 1]); 
                // Tail recursion optimization: push subarray small first
                if (lp - lo < hi - rp) stack.push([lo, lp - 1]), lo = rp + 1;
                else stack.push([rp + 1, hi]), hi = lp - 1;
            }
        }
    }

    const partition = <T>(arr: T[], cmp: (a: T, b: T) => number, lo: number, hi: number) => {
        const mi = zigzum(0, arr.length-1, mid(lo, hi)), pivot = arr[mi];
        let i = lo; swap(arr, mi, hi);
        for (let j = lo; j < hi; j++) if (cmp(arr[j], pivot) < 0) swap(arr, i++, j);
        swap(arr, i, hi); return i;
    };

    export function quickSort<T>(arr: T[], cmp: (a: T, b: T) => number) {
        // Stack 2D: [lo, hi]
        const stack: number[][] = [[0, arr.length - 1]];
        while (stack.length > 0) {
            let [lo, hi] = stack.pop();
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
