import s from "./year-progress.module.scss";
const YearProgress = ({ yearPercentage, progress }) => {
    return (
        <div className={s.year}>
            <span className={s.text}>THIS YEAR</span>

            <div
                style={{
                    top: yearPercentage + "%",
                    visibility: yearPercentage ? "" : "hidden",
                }}
                className={s.line}
            ></div>

            <div className={s.progress} style={{ height: progress + "%" }}></div>
        </div>
    );
};

export default YearProgress;
