
namespace Polymesh {

    export function quickSort<T>(arr: T[], cmp: (a: T, b: T) => number) {
        if (isSorted(arr, cmp)) return;

        const stack: number[][] = [[0, arr.length - 1]];
        while (stack.length) {
            const range = stack.pop(); if (!range) continue;
            let lo = range[0], hi = range[1];
            const p = partition(arr, cmp, lo, hi);
            if (p - 1 > lo) stack.push([lo, p - 1]);
            if (p + 1 < hi) stack.push([p + 1, hi]);
        }
    }

}
