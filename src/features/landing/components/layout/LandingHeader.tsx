export function LandingHeader() {
  return (
    <header className="studio-header">
      <a className="studio-brand" href="#" aria-label="トップへ">
        <span>
          <strong>Yoshitaka Sano</strong>
          <small>Frontend Engineer</small>
        </span>
      </a>

      <div className="studio-status">
        <span className="studio-status-dot" />
        Open to new opportunities
      </div>
    </header>
  );
}
