import { useEffect, useState, useRef } from "react";
import s from "../styles/Home3.module.scss";
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

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
    const size = "3rem";
    const circleRef = useRef();
    const [active, setActive] = useState(!!alreadyActive);
    useEffect(() => {
        if (!circleRef.current || !today) return;

        const box = circleRef.current.getBoundingClientRect();
        const xCenter = (box.left + box.right) / 2;
        const yCenter = (box.top + box.bottom) / 2;
        const pos = { x: xCenter, y: yCenter };

        onCenterChange(pos);
    }, [windowSizes, circleRef, size]);

    useEffect(() => {
        if (alreadyActive) {
            setTimeout(() => {
                setActive(true);
                circleRef.current.style.color = "white";

                setTimeout(() => {
                    circleRef.current.style.color = "";
                }, 2000);
            }, alreadyActive);
        }
    }, [alreadyActive]);

    return (
        <div
            id={today ? s.today : ""}
            ref={circleRef}
            style={{
                width: size,
                height: size,
            }}
            onClick={() => {
                if (today) circleRef.current.style.color = "white";
                setActive((prev) => {
                    let activeDays = JSON.parse(
                        localStorage.getItem("activeDays")
                    ) || [[], [], [], [], [], [], [], [], [], [], [], []];
                    prev
                        ? (activeDays[monthIndex] = activeDays[
                              monthIndex
                          ].filter((day) => day !== dayIndex))
                        : activeDays[monthIndex].push(dayIndex);
                    activeDays[monthIndex] = activeDays[monthIndex]
                        .filter(onlyUnique)
                        .sort((a, b) => a - b);
                    localStorage.setItem(
                        "activeDays",
                        JSON.stringify(activeDays)
                    );
                    return !prev;
                });
                onClick();
            }}
            className={`${s.circle} ${initState && !today && s.hidden} ${
                today && s.today
            } ${dayIndex !== 0 && s.transparent} ${active && s.active} ${
                dayIndex === 0 && s.firstOf
            }`}
        >
            {today && initState ? "" : children}
        </div>
    );
};

export default Circle;
