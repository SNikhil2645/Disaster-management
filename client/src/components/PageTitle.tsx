import { Helmet } from 'react-helmet-async';

const BASE = 'Emergency Alerts';

interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => (
  <Helmet>
    <title>{title} — {BASE}</title>
  </Helmet>
);

export default PageTitle;
