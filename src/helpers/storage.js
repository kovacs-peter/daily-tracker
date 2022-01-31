export const getActiveDays = () => {
    const localStorageData = JSON.parse(localStorage.getItem("activeDays"));
    return localStorageData || [[], [], [], [], [], [], [], [], [], [], [], []];
};

export const setLocalStorage = (data) => {
    localStorage.setItem("activeDays", JSON.stringify(data));
};
