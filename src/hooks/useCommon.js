export default function useCommon() {
    const americanFormatNumber = (num, digits = 0) => {
        const lookup = [
            {value: 1, symbol: ""},
            {value: 1e3, symbol: "k"},
            {value: 1e6, symbol: "M"},
            // { value: 1e9, symbol: "G" },
            // { value: 1e12, symbol: "T" },
            // { value: 1e15, symbol: "P" },
            // { value: 1e18, symbol: "E" }
        ];

        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        const item = lookup?.slice()?.reverse()?.find((item) => num >= item?.value);
        return item
            ? Intl.NumberFormat('en-US').format((num / item?.value).toFixed(digits)).replace(rx, "$1") + item.symbol
            : Intl.NumberFormat('en-US').format((+num).toFixed(digits));
    }

    const addCommasToNumber = (num, fixed = null) => {
        if (typeof num === "number") {
            const value = fixed ? +num?.toFixed(fixed) : +num;
            return new Intl.NumberFormat('en-US').format(value);
        }
        return 0
    }


    return {americanFormatNumber, addCommasToNumber};
};