export const calcWindowSizes = () => ({
    x: window.innerWidth,
    y: window.innerHeight,
});
export const calcVmin = (width, height, amount) => {
    return (width > height ? height : width) * (amount / 100);
};
export const convertRemToPixels = (rem) => {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};
