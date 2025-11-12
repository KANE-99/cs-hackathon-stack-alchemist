import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/index";
import Blog from "./pages/blog";
import BlogPost from "./pages/blog-post";
import Error from "./pages/error";
import "./styles/third-party.css";
import "./styles/style.css";
import "./styles/modal.css";
import "react-loading-skeleton/dist/skeleton.css";
import { EntryProps } from "../src/typescript/layout";
import AllFields from "./pages/data";
import TestPage from "./pages/test-page";
import DecoderTest from "./pages/decoder-test";

function App() {
  const [getEntry, setEntry] = useState({} as EntryProps);

  function getPageRes(response: EntryProps) {
    setEntry(response);
  }

  return (
    <div className="App" data-testid="app">
      <Routes>
        {/* Standalone decoder test page (no layout) */}
        <Route path="/decoder-test" element={<DecoderTest />} />
        <Route
          path="/locale/:locale"
          element={<Layout entry={getEntry} data-testid="layout" />}
        >
          <Route
            index
            element={<Home entry={getPageRes} data-testid="home" />}
          />
          <Route
            path="/locale/:locale/:page"
            element={<Home entry={getPageRes} data-testid="home" />}
          />
          <Route
            path="/locale/:locale/blog"
            element={<Blog entry={getPageRes} data-testid="blog" />}
          />
          <Route
            path="/locale/:locale/blog/:blogId"
            element={<BlogPost entry={getPageRes} data-testid="blog-post" />}
          />
          <Route path="/locale/:locale/e2e/:testCtUid" element={<TestPage />} />
          <Route
            path="/locale/:locale/data/:contentTypeUid/:entryUrl"
            element={<AllFields />}
          />
          <Route
            path="/locale/:locale/404"
            element={<Error data-testid="error" />}
          ></Route>
          <Route
            path="/locale/:locale/*"
            element={<Error data-testid="error" />}
          ></Route>
        </Route>
        <Route
          path="/e2e"
          element={<Layout entry={getEntry} data-testid="layout" />}
        >
          <Route index element={<div>test</div>} />
          <Route path="/e2e/:testCtUid" element={<TestPage />} />
        </Route>
        <Route
          path="/"
          element={<Layout entry={getEntry} data-testid="layout" />}
        >
          <Route
            index
            element={<Home entry={getPageRes} data-testid="home" />}
          />
          <Route
            path="/:page"
            element={<Home entry={getPageRes} data-testid="home" />}
          />
          <Route
            path="/blog"
            element={<Blog entry={getPageRes} data-testid="blog" />}
          />
          <Route
            path="/blog/:blogId"
            element={<BlogPost entry={getPageRes} data-testid="blog-post" />}
          />
          <Route
            path="/data/:contentTypeUid/:entryUrl"
            element={<AllFields />}
          />
          <Route path="/404" element={<Error data-testid="error" />}></Route>
          <Route path="*" element={<Error data-testid="error" />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
