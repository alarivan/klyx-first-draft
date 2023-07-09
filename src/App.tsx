import type { Component } from "solid-js";

import { Routes, Route, useParams, A } from "@solidjs/router";

import styles from "./App.module.css";
import { Home } from "./pages/Home";

const List: Component = () => {
  const params = useParams();

  return <div>Play {params.listId}</div>;
};

const Play: Component = () => {
  const params = useParams();

  return (
    <>
      <div>Play {params.itemId}</div>
      <div>Play {params.listId}</div>
    </>
  );
};

const App: Component = () => {
  return (
    <div class={styles.container}>
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/:listId" component={List} />
        <Route path="/:listId/play/:itemId" component={Play} />
      </Routes>
    </div>
  );
};

export default App;
