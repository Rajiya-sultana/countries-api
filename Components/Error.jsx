import { useRouteError } from "react-router-dom";

export default function Error() {
  const error = useRouteError();

  return <div>something went wrong.{error.status}</div>;
}
