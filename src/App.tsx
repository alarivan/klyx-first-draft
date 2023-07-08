import type { Component } from "solid-js";

import { Routes, Route, useParams, A } from "@solidjs/router";

import styles from "./App.module.css";
import logo from "./logo.svg";

const Home = () => (
  <div class={styles.App}>
    <header class={styles.header}>
      <img src={logo} class={styles.logo} alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <A href="/123">list id</A>
      <A href="/123/play/456">item id</A>
      <a
        class={styles.link}
        href="https://github.com/solidjs/solid"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn Solid
      </a>
    </header>
  </div>
);

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
    <Routes>
      <Route path="/" component={Home} />
      <Route path="/:listId" component={List} />
      <Route path="/:listId/play/:itemId" component={Play} />
    </Routes>
  );
};

export default App;
