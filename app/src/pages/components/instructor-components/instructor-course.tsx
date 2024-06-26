import type { NextPage } from 'next';
import Link from "next/link";
import style from "../../../styles/instructor-components.module.css";

const InstructorCourseCard: NextPage = () => {
    return (
        <div className={style.outerCard}>
            <div className={style.innerCard}>
                <h2>Course Name</h2>
                <h5><i>Institution</i></h5>
            </div>
        </div>
            );
}

export default InstructorCourseCard