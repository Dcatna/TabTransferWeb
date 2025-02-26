import { useNavigate, useRouteError } from "react-router-dom";
import { Button } from "./ui/button";

export default function ErrorPage() {
    //tslint:disable-next-line
    //ts-ignore
    const error: any = useRouteError();
    const navigate = useNavigate();
  
    return (
      <div className="flex flex-col items-center justify-center w-full bg-background text-foreground min-h-screen">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <Button onClick={() => navigate("/home")}>Home</Button>
      </div>
    );
}
