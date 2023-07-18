import classes from './ErrorBoundaryFallback.module.css';

const ErrorBoundaryFallback = ({
  resetErrorBoundary,
  error,
}: {
  resetErrorBoundary: () => void;
  error: Error;
}) => {
  console.log(error);
  return (
    <div className={classes.container}>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
};

export default ErrorBoundaryFallback;
