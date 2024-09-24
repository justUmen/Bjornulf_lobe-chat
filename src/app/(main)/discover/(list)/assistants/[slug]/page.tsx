import urlJoin from 'url-join';

import StructuredData from '@/components/StructuredData';
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
  const { t: td } = await translation('discover', searchParams?.hl);

  return metadataModule.generate({
    alternate: true,
    description: t('discover.assistants.description'),
    locale,
    title: [td(`category.assistant.${params.slug}`), t('discover.assistants.title')].join(' · '),
    url: urlJoin('/discover/assistants', params.slug),
  });
};

const Page = async ({ params, searchParams }: Props) => {
  const { t, locale } = await translation('metadata', searchParams?.hl);
  const { t: td } = await translation('discover', searchParams?.hl);
  const mobile = isMobileDevice();

  const discoverService = new DiscoverService();
  const items = await discoverService.getAssistantCategory(locale, params.slug);

  const ld = ldModule.generate({
    description: t('discover.assistants.description'),
    title: [td(`category.assistant.${params.slug}`), t('discover.assistants.title')].join(' · '),
    url: urlJoin('/discover/assistants', params.slug),
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
  const cates = Object.values(AssistantCategory);
  return cates.map((cate) => ({
    slug: cate,
  }));
};

Page.DisplayName = 'DiscoverAssistantsCategory';

export default Page;
