import { useSession } from "./hooks/useSession";
import { PageLayout } from "./Layout";

export function Home() {
  const {
    viewer: { name },
  } = useSession();

  return <PageLayout title="Home">Welcome, {name}!</PageLayout>;
}
