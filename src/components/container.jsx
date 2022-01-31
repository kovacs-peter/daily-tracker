import { useRef, useState, useEffect } from "react";
import { getActiveDays } from "../helpers/storage";
import "../helpers/date";
import s from "./container.module.scss";
import Circle from "./circle";
import YearProgress from "./year-progress";

const monthAbbrev = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
];
const today = new Date();
console.log(today);
const calendar = () => {
    let janFeb = [31];
    today.isLeapYear() ? janFeb.push(29) : janFeb.push(28);
    return [...janFeb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
};
let firstMonths = null;
const initMonths = () => {
    if (firstMonths) return firstMonths;
    const thisMonth = today.getMonth();
    const nMonths = calendar().slice(0, thisMonth + 1);
    nMonths[thisMonth] = today.getDate();
    firstMonths = nMonths;
    return firstMonths;
};
const calcWindowSizes = () => ({
    x: window.innerWidth,
    y: window.innerHeight,
});
const initSizes = calcWindowSizes();

const calcVmin = (width, height, amount) => {
    return (width > height ? height : width) * (amount / 100);
};
const convertRemToPixels = (rem) => {
    return (
        rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
};

const Container = () => {
    const [initState, setInitState] = useState(true);
    const [freeScroll, setFreeScroll] = useState(false);
    const [currentTransform, setCurrentTransform] = useState({ x: 0, y: 0 });
    const [windowSizes, setWindowSizes] = useState(calcWindowSizes());
    const [todayPos, setTodayPos] = useState({ x: 0, y: 0 });
    const [activeDays, setActiveDays] = useState({});
    const [activeDayCount, setActiveDayCount] = useState(0);
    const containerRef = useRef(null);

    const isToday = (monthIndex, dayIndex) => {
        return (
            initMonths().length === monthIndex + 1 &&
            dayIndex + 1 === today.getDate()
        );
    };
    useEffect(() => {
        const sum = Object.values(activeDays).reduce((acc, curr) => {
            acc += Object.keys(curr).length;
            return acc;
        }, 0);
        setActiveDayCount(sum);
    }, [activeDays]);

    useEffect(() => {
        const handleResize = () => setWindowSizes(calcWindowSizes());
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (
            !initState ||
            !containerRef.current ||
            !windowSizes.x ||
            !todayPos.x
        )
            return;

        const xTranslate =
            currentTransform.x + (windowSizes.x / 2 - todayPos.x);
        const yTranslate =
            currentTransform.y + (windowSizes.y / 2 - todayPos.y);
        setCurrentTransform({
            x: xTranslate,
            y: yTranslate,
        });
        containerRef.current.style.transform = `translate(${xTranslate}px, ${yTranslate}px)`;
    }, [todayPos, containerRef]);
    const calcActivedays = () => {
        let delay = 1;

        let actives = {};
        const initActive = getActiveDays();
        initActive.forEach((month, monthIndex) => {
            month.forEach((day) => {
                actives = {
                    ...actives,
                    [monthIndex]: {
                        ...actives[monthIndex],
                        [day]: delay,
                    },
                };
                delay += 50;
            });
        });
        setActiveDays(actives);
    };
    useEffect(() => {
        if (!freeScroll) return;
        setTimeout(() => {
            calcActivedays();
        }, 1000);
        setTimeout(() => {
            window.scroll({
                top: document.body.scrollHeight,
                behavior: "smooth",
            });
        }, 2500);
    }, [freeScroll]);
    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    fontSize: "3rem",
                    fontWeight: 700,
                }}
            >
                TRACK
            </div>
            <div
                ref={containerRef}
                className={`${s.container} ${freeScroll && s.freeScroll}`}
                style={{
                    width: freeScroll ? "100vw" : initSizes.x + "px",
                    height: freeScroll ? "100vh" : initSizes.y + "px",
                    transformOrigin: `${windowSizes.x / 2}px ${
                        windowSizes.y / 2
                    }px`,
                }}
            >
                <div className={`${s.month} ${freeScroll && s.freeScroll}`}>
                    {initMonths().map((monthLength, monthIndex) =>
                        [...Array(monthLength).keys()].map((dayIndex) => (
                            <Circle
                                windowSizes={windowSizes}
                                today={isToday(monthIndex, dayIndex)}
                                onCenterChange={(pos) => setTodayPos(pos)}
                                key={dayIndex}
                                onClick={() => {
                                    calcActivedays();
                                    if (!initState) return;
                                    containerRef.current.style.transition = `transform 1.5s ease-in-out`;
                                    const scale =
                                        calcVmin(
                                            windowSizes.x,
                                            windowSizes.y,
                                            80
                                        ) / convertRemToPixels(3);
                                    containerRef.current.style.transform = `scale(${scale}) translate(${currentTransform.x}px, ${currentTransform.y}px)`;

                                    setTimeout(() => {
                                        containerRef.current.style.transform = ``;
                                        setFreeScroll(true);
                                    }, 1500);
                                    setInitState(false);
                                }}
                                monthIndex={monthIndex}
                                dayIndex={dayIndex}
                                initState={initState}
                                alreadyActive={
                                    activeDays?.[monthIndex]?.[dayIndex]
                                }
                            >
                                {dayIndex === 0
                                    ? monthAbbrev[monthIndex]
                                    : dayIndex + 1}
                            </Circle>
                        ))
                    )}
                </div>
            </div>
            <YearProgress
                progress={activeDayCount / (today.isLeapYear() ? 366 : 365)}
                yearPercentage={
                    freeScroll
                        ? today.getDOY() / (today.isLeapYear() ? 366 : 365)
                        : 0
                }
            />
        </>
    );
};

export default Container;
