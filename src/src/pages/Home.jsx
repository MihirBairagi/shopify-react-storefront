import Slider from "../components/Slider";
import { Link } from "react-router-dom";

function Home({ pageData }) {

  return (

    <main className="page">


      <section className="page-header">

        <h1>
          {pageData.heading}
        </h1>

        <p>
          {pageData.description}
        </p>

        <Link to="/edit">
          Edit Homepage
        </Link>

      </section>


      <section className="slider-section">

        <h2>
          Our Slides
        </h2>

        <Slider
          slides={pageData.slides}
        />

      </section>

    </main>

  );

}

export default Home;