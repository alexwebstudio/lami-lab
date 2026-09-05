import LegalPage from '@/components/LegalPage';
import { privacyPolicy } from '@/data/legal';

export const metadata = {
  title: 'Политика конфиденциальности',
  description:
    'Как студия LAMI LAB в Караганде обращается с данными, которые вы оставляете при записи на ламинирование ресниц и бровей.',
  alternates: { canonical: '/privacy-policy' },
  openGraph: { title: 'Политика конфиденциальности — LAMI LAB', url: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return <LegalPage document={privacyPolicy} />;
}
