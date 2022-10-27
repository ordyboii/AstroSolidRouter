import {
  A,
  Route,
  Router,
  Routes,
  useIsRouting,
  useRouteData
} from "@solidjs/router";
import {
  createResource,
  createSignal,
  ErrorBoundary,
  For,
  Show,
  Suspense
} from "solid-js";
import { client } from "utils/trpc";

const [block, setBlock] = createSignal(false);
const delay = () => new Promise(resolve => setTimeout(resolve, 1000));

const NestedComponent = () => {
  const [example] = createResource(async () => {
    await delay();
    return client.example.query();
  });

  return (
    <Suspense fallback={<p>Loading Nested Fetch...</p>}>
      <p>Data fetched from server using Solid Query {example()}</p>
    </Suspense>
  );
};

const protectedRouteData = () =>
  createResource(async () => {
    await client.me.query();
    return { protected: "jake" };
  });

const Protected = () => {
  const [data] = useRouteData<typeof protectedRouteData>();
  return (
    <Suspense fallback={<p>Authorizing...</p>}>
      <ErrorBoundary fallback={err => err.message}>
        <p>This is protected content, {data()?.protected}</p>
      </ErrorBoundary>
    </Suspense>
  );
};

const AppRoute = () => {
  const [data] = useRouteData<typeof fetchRouteData>();

  return (
    <Show when={data()}>
      <h1>
        This is the app rendered in solid using Suspense to block and Astro for
        ssr
      </h1>
      <h2>Data from API:</h2>
      <A class='underline' href='/count'>
        Go to counter
      </A>
      <A class='underline' href='/protected'>
        Go to protected
      </A>
      <ul>
        <For each={data()}>{data => <li>{data.title}</li>}</For>
      </ul>
    </Show>
  );
};

const Counter = () => {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <h2>{count()}</h2>
      <div class='space-x-4'>
        <button onClick={() => setCount(count() + 1)}>Increment</button>
        <button onClick={() => setBlock(true)}>Block UI</button>
        <A class='underline' href='/'>
          Return home
        </A>
        <NestedComponent />
      </div>
    </>
  );
};

const fetchRouteData = () =>
  createResource(async () => {
    await delay();
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    return (await res.json()) as { id: number; title: string }[];
  });

const App = () => {
  const isRouting = useIsRouting();

  return (
    <Suspense fallback={<p>Loading app...</p>}>
      <Show when={isRouting() || block()}>
        <div class='bg-black/30 h-screen fixed inset-0 z-50 select-none text-white grid place-items-center'>
          <h1>Blocking...</h1>
        </div>
      </Show>
      <Routes>
        <Route path='/' element={AppRoute} data={fetchRouteData}></Route>
        <Route path='/count' element={Counter}></Route>
        <Route
          path='/protected'
          element={Protected}
          data={protectedRouteData}
        ></Route>
      </Routes>
    </Suspense>
  );
};

export default function AppRouter({ ssrRoute }: { ssrRoute: string }) {
  return (
    <Router base='/app' url={ssrRoute}>
      <App />
    </Router>
  );
}
