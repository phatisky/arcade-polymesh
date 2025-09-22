
namespace Polymesh {

    export function quickSort<T>(arr: T[], compare: (a: T, b: T) => number) {
        if (arr.length <= 1 || isSorted(arr, compare)) return;
        const stack: { low: number, high: number }[] = [{ low: 0, high: arr.length - 1 }];

        while (stack.length) {
            const { low, high } = stack.pop();
            if (low >= high) continue;

            let tmp: T;
            const pivot = arr[high];
            let i = low;

            for (let j = low; j < high; j++) {
                if (compare(arr[j], pivot) < 0) { // into ascending (near -> far)
                    tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
                    i++;
                }
            }
            tmp = arr[i]; arr[i] = arr[high]; arr[high] = tmp; // place pivot

            // push item left to stack
            if (i - low < high - i) {
                stack.push({ low, high: i - 1 });
                stack.push({ low: i + 1, high });
            } else {
                stack.push({ low: i + 1, high });
                stack.push({ low, high: i - 1 });
            }
        }
    }

}
