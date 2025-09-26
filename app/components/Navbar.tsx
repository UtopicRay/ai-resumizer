import { Link } from "react-router";

export default function Navbar(){
    return (
        <nav className="navbar">
            <Link to="/" className="text-gradient text-2xl font-bold">Resumizer</Link>
            <Link to="/upload" className="primary-button w-fit">Upload your resume</Link>
        </nav>
    )
}