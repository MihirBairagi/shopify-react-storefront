import {
  useEffect,
  useState
} from "react";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import Edit from "./pages/Edit";

import {
  getPageData
} from "./services/api";

import "./App.css";


const defaultPageData = {

  heading: "My Basic Page",

  description:
    "Loading page content...",

  slides: []

};


function App() {

  const [
    pageData,
    setPageData
  ] = useState(defaultPageData);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState(null);


  // Load page data from MongoDB

  useEffect(() => {

    const loadPageData = async () => {

      try {

        const data =
          await getPageData();

        setPageData(data);

      } catch (error) {

        console.error(error);

        setError(
          "Unable to load page data."
        );

      } finally {

        setLoading(false);

      }

    };


    loadPageData();

  }, []);


  if (loading) {

    return (
      <h2>
        Loading...
      </h2>
    );

  }


  if (error) {

    return (
      <h2>
        {error}
      </h2>
    );

  }


  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Home
              pageData={pageData}
            />
          }
        />


        <Route
          path="/edit"
          element={
            <Edit
              pageData={pageData}
              setPageData={setPageData}
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;