import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import "./index.css";
import Layout from "./Layout";
import About from "./routes/About";
import Create from "./routes/Create";
import Home from "./routes/Home";
import ViewPoll from "./routes/ViewPoll";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/create",
        element: <Create />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/poll/:pollId",
        element: <ViewPoll />,
      },
    ],
  },
]);

const theme = extendTheme({
  components: {
    Heading: {
      baseStyle: {
        color: "#373332",
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "#FAFAFA",
      },
    },
  },
  colors: {
    primary: {
      main: "teal",
    },
    secondary: {
      main: "beige",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </ChakraProvider>
  </React.StrictMode>
);
