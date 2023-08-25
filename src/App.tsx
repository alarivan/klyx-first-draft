import type { Component } from "solid-js";

import { Routes, Route } from "@solidjs/router";

import styles from "./App.module.css";
import { ListGuardProvider } from "./components/ListGuard";
import { ListItemGuardProvider } from "./components/ListItemGuard";
import { PageHeader } from "./components/PageHeader";
import { Home } from "./pages/Home";
import { ListEdit } from "./pages/ListEdit";
import { ListItemEdit } from "./pages/ListItemEdit";
import { ListView } from "./pages/ListView";
import { NewItem } from "./pages/NewItem/NewItem";
import { NewList } from "./pages/NewList";
import { Play } from "./pages/Play";
import { PlayDone } from "./pages/PlayDone";

const App: Component = () => {
  return (
    <div class={styles.container}>
      <PageHeader />
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/list/new" component={NewList} />
        <Route path="/list/:listId" component={ListGuardProvider}>
          <Route path="/" component={ListView} />
          <Route path="/edit" component={ListEdit} />
          <Route path="/item/new" component={NewItem} />
        </Route>
        <Route path="/list/:listId/play" component={ListItemGuardProvider}>
          <Route path="/" component={Play} />
          <Route path="/done" component={PlayDone} />
          <Route path="/:itemId" component={Play} />
        </Route>
        <Route
          path="/list/:listId/item/:itemId"
          component={ListItemGuardProvider}
        >
          <Route path="/edit" component={ListItemEdit} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
