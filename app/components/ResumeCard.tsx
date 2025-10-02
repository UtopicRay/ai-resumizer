import { Link } from "react-router";
import ScoreCircle from "./CircularScore";

export default function ResumeCard({ resume: { id, imagePath, companyName, jobTitle, feedback,resumePath } }: { resume: Resume }) {
    return (
        <Link to={`/resume/${id}`} className="resume-card fade-in animate-in duration-100">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    <h2 className="!text-black text-xl font-bold">{companyName}</h2>
                    <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
                </div>
                <div className="flex shrink-0">
                    <ScoreCircle score={feedback.overallScore}></ScoreCircle>
                </div>
            </div>
            <div className="gradient-border animate-in fade-in duration-1000 w-full">
                <div className="w-full h-full">
                <img src={imagePath} alt="resume" className="max-sm:h-[200px] w-full h-[350px] object-cover object-top" />
                </div>
            </div>
        </Link>
    )
}