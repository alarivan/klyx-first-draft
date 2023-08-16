import type { Component } from "solid-js";

import { Routes, Route } from "@solidjs/router";

import styles from "./App.module.css";
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
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/list/new" component={NewList} />
        <Route path="/list/:listId" component={ListView} />
        <Route path="/list/:listId/edit" component={ListEdit} />
        <Route
          path="/list/:listId/item/:itemId/edit"
          component={ListItemEdit}
        />
        <Route path="/list/:listId/play" component={Play} />
        <Route path="/list/:listId/play/done" component={PlayDone} />
        <Route path="/list/:listId/play/:itemId" component={Play} />
        <Route path="/list/:listId/item/new" component={NewItem} />
      </Routes>
    </div>
  );
};

export default App;
