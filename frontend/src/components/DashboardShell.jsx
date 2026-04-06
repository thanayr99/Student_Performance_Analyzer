export default function DashboardShell({
  brandSubtitle,
  sidebarProfile,
  navItems,
  activeTab,
  onTabChange,
  sidebarFooter,
  searchPlaceholder,
  profileTitle,
  profileSubtitle,
  profileInitials,
  pageTitle,
  pageDescription,
  pageActions,
  children
}) {
  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand">
            <div className="brand-badge">SP</div>
            <div className="brand-copy">
              <strong>Performance Analyzer</strong>
              <span>{brandSubtitle}</span>
            </div>
          </div>
        </div>

        {sidebarProfile}

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-link ${activeTab === item.id ? "active" : ""}`}
              onClick={() => onTabChange(item.id)}
              type="button"
            >
              <span>{item.label}</span>
              <span>{item.meta}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">{sidebarFooter}</div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="search-shell">
            <span className="search-icon">Sr</span>
            <input placeholder={searchPlaceholder} />
          </div>

          <div className="header-actions">
            <button className="icon-btn" type="button" aria-label="Notifications">
              N
            </button>
            <button className="icon-btn" type="button" aria-label="Settings">
              S
            </button>
            <div className="profile-chip">
              <div>
                <strong>{profileTitle}</strong>
                <div className="field-help">{profileSubtitle}</div>
              </div>
              <div className="avatar-chip">{profileInitials}</div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="page-intro-row">
            <div className="page-intro">
              <h1>{pageTitle}</h1>
              <p>{pageDescription}</p>
            </div>
            <div className="header-actions">{pageActions}</div>
          </section>
          {children}
        </div>
      </div>
    </div>
  );
}
