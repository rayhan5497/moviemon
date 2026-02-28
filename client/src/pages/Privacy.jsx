import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  useEffect(() => {
    document.title = 'Privacy Policy - MovieMon';
  }, []);

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-primary">Privacy Policy</h1>
      <p className="text-secondary mt-2">Effective date: 2026-02-28</p>

      <section className="mt-6 space-y-4 text-secondary">
        <p>
          This Privacy Policy explains how MovieMon collects, uses, and protects
          information when you use the application.
        </p>

        <h2 className="text-xl font-semibold text-primary">Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Account information (email, display name, avatar)</li>
          <li>Saved items, watch later items, and watch history</li>
          <li>Basic usage and request data (IP address, user agent, timestamps)</li>
        </ul>

        <h2 className="text-xl font-semibold text-primary">How We Use Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide core features and account services</li>
          <li>Maintain performance, reliability, and security</li>
          <li>Respond to support requests</li>
        </ul>

        <h2 className="text-xl font-semibold text-primary">Third-Party Services</h2>
        <p>
          MovieMon uses third-party services for movie data, email delivery,
          media storage, and hosting infrastructure. These services may process
          limited data required to provide their functions.
        </p>

        <h2 className="text-xl font-semibold text-primary">Data Retention</h2>
        <p>
          We retain data only as long as needed to provide the service. You can
          request account deletion to remove personal data.
        </p>

        <h2 className="text-xl font-semibold text-primary">Your Rights</h2>
        <p>
          Depending on your location, you may have the right to access, update,
          or delete your data.
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

export default Privacy;
