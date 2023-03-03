import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Redirect()
{
    const navigate = useNavigate()
    navigate('/login')
}