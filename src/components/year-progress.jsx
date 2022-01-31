import s from "./year-progress.module.scss";
const YearProgress = ({ yearPercentage, progress }) => {
    return (
        <div className={s.year}>
            <span className={s.text}>THIS YEAR</span>

            <div
                style={{
                    top: yearPercentage * 100 + "%",
                    visibility: yearPercentage ? "" : "hidden",
                }}
                className={s.line}
            ></div>

            <div className={s.progress} style={{ height: progress * 100 + "%" }}></div>
        </div>
    );
};

export default YearProgress;
