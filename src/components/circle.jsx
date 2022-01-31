import { useEffect, useState, useRef } from "react";
import s from "./circle.module.scss";
import { getActiveDays, setLocalStorage } from "../helpers/storage";

const Circle = ({
    children,
    today,
    onClick,
    onCenterChange,
    windowSizes,
    initState,
    alreadyActive,
    dayIndex,
    monthIndex,
}) => {
    console.log(alreadyActive);
    const circleRef = useRef();
    const [active, setActive] = useState(!!alreadyActive);

    useEffect(() => {
        if (!circleRef.current || !today) return;

        const position = calculateMiddle(circleRef.current);
        onCenterChange(position);
    }, [windowSizes, circleRef]);

    useEffect(() => {
        // shows and hides the date
        if (alreadyActive) {
            setTimeout(() => {
                setActive(true);
                setCircleColor("white");
                setTimeout(() => {
                    setCircleColor("");
                }, 1000);
            }, alreadyActive + 2000);
        }
    }, [alreadyActive]);

    const calculateMiddle = (element) => {
        const box = element.getBoundingClientRect();
        const xCenter = (box.left + box.right) / 2;
        const yCenter = (box.top + box.bottom) / 2;
        return { x: xCenter, y: yCenter };
    };

    const setCircleColor = (colorString) =>
        (circleRef.current.style.color = colorString);

    const handleClick = () => {
        if (today) setCircleColor("white");
        let activeDays = getActiveDays(true);

        //add or remove todays index
        activeDays[monthIndex] = activeDays[monthIndex].includes(dayIndex)
            ? activeDays[monthIndex].filter((day) => day !== dayIndex)
            : [...activeDays[monthIndex], dayIndex].sort((a, b) => a - b);

        setLocalStorage(activeDays);
        setActive((prev) => !prev);
        //propagate
        onClick();
    };

    return (
        <div
            id={today ? s.today : ""}
            ref={circleRef}
            onClick={handleClick}
            className={[
                s.circle,
                today && s.today,
                active && s.active,
                initState && !today && s.hidden,
                dayIndex === 0 ? s.firstOf : s.transparent,
            ].join(" ")}
        >
            {today && initState ? "" : children}
        </div>
    );
};

export default Circle;
