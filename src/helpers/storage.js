export const getActiveDays = (buildEmpty = false) => {
    const localStorageData = JSON.parse(localStorage.getItem("activeDays"));
    if (buildEmpty)
        return (
            localStorageData || [[], [], [], [], [], [], [], [], [], [], [], []]
        );
    return localStorageData;
};

export const setLocalStorage = (data) => {
    localStorage.setItem("activeDays", JSON.stringify(data));
};
