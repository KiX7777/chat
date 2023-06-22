import classes from './Layout.module.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={classes.layout}>
      <header className={classes.header}>
        <img src='/logo.webp' alt='Chatter logo' />
      </header>
      {children}
    </div>
  );
};

export default Layout;
