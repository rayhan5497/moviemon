export const ResponsiveH2 = ({ children }) => {
  return (
    <h2
      className={`mb-4 text-[clamp(1rem,7vw,2.2rem)] font-bold leading-tight`}
    >
      {children}
    </h2>
  );
};

export const ResponsiveH3 = ({ children }) => {
  return (
    <h3
      className={`mb-2 text-[clamp(0.9rem,7vw,1.2rem)] font-semibold leading-tight wrap-break-word`}
    >
      {children}
    </h3>
  );
};

// export default LandingHeading;
