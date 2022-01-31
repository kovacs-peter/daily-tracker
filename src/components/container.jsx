import { useRef, useState, useEffect } from "react";
import s from "./container.module.scss";
import "../helpers/date";
import { calcWindowSizes, calcVmin, convertRemToPixels } from "../helpers/size";
import { monthsAbbrev, today, initMonths, isToday, calcActivedays, calculatePercent, currentDate } from "../helpers/time";
import Circle from "./circle";
import YearProgress from "./year-progress";

const initSizes = calcWindowSizes();
const alreadyActive = calcActivedays()[today.getMonth()][today.getDate() - 1];
const Container = () => {
    const [initState, setInitState] = useState(!alreadyActive);
    const [freeScroll, setFreeScroll] = useState(false);
    const [currentTransform, setCurrentTransform] = useState({ x: 0, y: 0 });
    const [windowSizes, setWindowSizes] = useState(calcWindowSizes());
    const [todayPos, setTodayPos] = useState({ x: 0, y: 0 });
    const [activeDays, setActiveDays] = useState({});
    const [activeDayCount, setActiveDayCount] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        if (alreadyActive) {
            setActiveDays(calcActivedays());
            setFreeScroll(true);
        }
        const handleResize = () => setWindowSizes(calcWindowSizes());
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const sum = Object.values(activeDays).reduce((acc, curr) => {
            acc += Object.keys(curr).length;
            return acc;
        }, 0);
        setActiveDayCount(sum);
    }, [activeDays]);

    useEffect(() => {
        if (!freeScroll) return;
        setTimeout(() => {
            setActiveDays(calcActivedays());
        }, 1000);
        setTimeout(() => {
            window.scroll({
                top: document.body.scrollHeight,
                behavior: "smooth",
            });
        }, 2500);
    }, [freeScroll]);

    useEffect(() => {
        if (!initState || !containerRef.current || !windowSizes.x || !todayPos.x) return;

        const xTranslate = currentTransform.x + (windowSizes.x / 2 - todayPos.x);
        const yTranslate = currentTransform.y + (windowSizes.y / 2 - todayPos.y);
        setCurrentTransform({
            x: xTranslate,
            y: yTranslate,
        });
        containerRef.current.style.transform = `translate(${xTranslate}px, ${yTranslate}px)`;
    }, [todayPos, containerRef, initState]);

    const handleClick = () => {
        if (!initState) return;
        setActiveDays(calcActivedays());

        const scale = calcVmin(windowSizes.x, windowSizes.y, 80) / convertRemToPixels(3);

        containerRef.current.style.transition = `transform 1.5s ease-in-out`;
        containerRef.current.style.transform = `scale(${scale}) translate(${currentTransform.x}px, ${currentTransform.y}px)`;
        setTimeout(() => {
            containerRef.current.style.transform = ``;
            setFreeScroll(true);
        }, 1500);
        setInitState(false);
    };

    return (
        <>
            <div id={s.title}>TRACK</div>
            <div
                ref={containerRef}
                className={`${s.container} ${freeScroll && s.freeScroll}`}
                style={{
                    width: freeScroll ? "100vw" : initSizes.x + "px",
                    height: freeScroll ? "100vh" : initSizes.y + "px",
                    transformOrigin: `${windowSizes.x / 2}px ${windowSizes.y / 2}px`,
                }}
            >
                <div className={`${s.month} ${freeScroll && s.freeScroll}`}>
                    {initMonths().map((monthLength, monthIndex) =>
                        [...Array(monthLength).keys()].map((dayIndex) => (
                            <Circle
                                key={dayIndex}
                                windowResized={windowSizes}
                                today={isToday(monthIndex, dayIndex)}
                                onCenterChange={(pos) => setTodayPos(pos)}
                                onClick={handleClick}
                                monthIndex={monthIndex}
                                dayIndex={dayIndex}
                                initState={initState}
                                freeScroll={freeScroll}
                                alreadyActive={activeDays?.[monthIndex]?.[dayIndex]}
                            >
                                {dayIndex === 0 ? monthsAbbrev[monthIndex] : dayIndex + 1}
                            </Circle>
                        ))
                    )}
                </div>
            </div>
            <YearProgress
                progress={calculatePercent(activeDayCount)}
                yearPercentage={freeScroll ? calculatePercent(today.getDOY()) : 0}
            />
        </>
    );
};

export default Container;
