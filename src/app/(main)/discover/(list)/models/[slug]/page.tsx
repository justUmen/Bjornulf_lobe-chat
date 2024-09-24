import urlJoin from 'url-join';

import StructuredData from '@/components/StructuredData';
import { DEFAULT_LANG } from '@/const/locale';
import { Locales } from '@/locales/resources';
import { ldModule } from '@/server/ld';
import { metadataModule } from '@/server/metadata';
import { DiscoverService } from '@/server/services/discover';
import { translation } from '@/server/translation';
import { AssistantCategory } from '@/types/discover';
import { isMobileDevice } from '@/utils/responsive';

import List from '../features/List';

type Props = { params: { slug: AssistantCategory }; searchParams: { hl?: Locales } };

export const generateMetadata = async ({ params, searchParams }: Props) => {
  const { t, locale } = await translation('metadata', searchParams?.hl);

  const discoverService = new DiscoverService();
  const list = await discoverService.getProviderList(locale);
  const cate = list.find((cate) => cate.identifier === params.slug);

  return metadataModule.generate({
    alternate: true,
    description: t('discover.models.description'),
    locale,
    title: [cate?.meta.title, t('discover.models.title')].join(' · '),
    url: urlJoin('/discover/models', params.slug),
  });
};

const Page = async ({ params, searchParams }: Props) => {
  const { t, locale } = await translation('metadata', searchParams?.hl);
  const mobile = isMobileDevice();

  const discoverService = new DiscoverService();
  const list = await discoverService.getProviderList(locale);
  const cate = list.find((cate) => cate.identifier === params.slug);
  const items = await discoverService.getModelCategory(locale, params.slug);

  const ld = ldModule.generate({
    description: t('discover.models.description'),
    title: [cate?.meta.title, t('discover.models.title')].join(' · '),
    url: urlJoin('/discover/models', params.slug),
    webpage: {
      enable: true,
      search: '/discover/search',
    },
  });

  return (
    <>
      <StructuredData ld={ld} />
      <List category={params.slug} items={items} mobile={mobile} />
    </>
  );
};

export const generateStaticParams = async () => {
  const discoverService = new DiscoverService();
  const cates = await discoverService.getProviderList(DEFAULT_LANG);
  return cates.map((cate) => ({
    slug: cate.identifier,
  }));
};

Page.DisplayName = 'DiscoverModelsCategory';

export default Page;
