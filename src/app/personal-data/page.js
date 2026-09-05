import LegalPage from '@/components/LegalPage';
import { personalData } from '@/data/legal';

export const metadata = {
  title: 'Обработка персональных данных',
  description:
    'Условия обработки персональных данных, которые вы оставляете в форме записи на сайте студии LAMI LAB в Караганде.',
  alternates: { canonical: '/personal-data' },
  openGraph: { title: 'Обработка персональных данных — LAMI LAB', url: '/personal-data' },
};

export default function PersonalDataPage() {
  return <LegalPage document={personalData} />;
}
