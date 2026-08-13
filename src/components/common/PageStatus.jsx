function PageStatus({ className = "", message, title }) {
  const sectionClassName = ["page-status", className].filter(Boolean).join(" ");

  return (
    <main>
      <section className={sectionClassName}>
        <div className="container">
          <h1>{title}</h1>

          {message && <p>{message}</p>}
        </div>
      </section>
    </main>
  );
}

export default PageStatus;
