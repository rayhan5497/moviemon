import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  useEffect(() => {
    document.title = 'Terms of Use - MovieMon';
  }, []);

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-primary">Terms of Use</h1>
      <p className="text-secondary mt-2">Effective date: 2026-02-28</p>

      <section className="mt-6 space-y-4 text-secondary">
        <p>
          MovieMon is provided for educational purposes only. By using the app,
          you acknowledge and agree to the following terms.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>The service is provided “as is” without warranties.</li>
          <li>Features may change or be removed at any time.</li>
          <li>Access may be suspended or removed without notice.</li>
          <li>Data may be reset or deleted without notice.</li>
          <li>Use the app at your own risk.</li>
        </ul>

        <p>
          If you do not agree to these terms, please do not use the application.
        </p>
      </section>

      <div className="mt-8">
        <Link to="/agreements" className="text-link underline">
          Back to agreements
        </Link>
      </div>
    </div>
  );
};

export default Terms;
