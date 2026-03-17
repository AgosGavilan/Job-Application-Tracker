interface Props {
    children: React.ReactNode;
    onNewApplication?: () => void;
  }
  
  const Layout = ({ children }: Props) => {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
        <main style={{ padding: '28px 28px', maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </main>
      </div>
    );
  };
  
  export default Layout;