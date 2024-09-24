'use client';

import { ModelIcon } from '@lobehub/icons';
import { Button } from 'antd';
import { createStyles } from 'antd-style';
import Link from 'next/link';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { DiscoverModelItem } from '@/types/discover';

import ModelFeatureTags from '../../../../features/ModelFeatureTags';
import Back from '../../../features/Back';

export const useStyles = createStyles(({ css, token }) => ({
  tag: css`
    color: ${token.colorTextSecondary};
    background: ${token.colorFillSecondary};
    border: none;
  `,
  time: css`
    font-size: 12px;
    color: ${token.colorTextDescription};
  `,
  title: css`
    margin-block: 0;
    font-size: 18px;
    font-weight: bold;
    line-height: 1.2;
  `,
}));

interface HeaderProps {
  data: DiscoverModelItem;
  identifier: string;
  mobile?: boolean;
}

const Header = memo<HeaderProps>(({ identifier, data, mobile }) => {
  const { styles, theme } = useStyles();
  const { t } = useTranslation(['discover', 'models']);

  return (
    <Flexbox gap={12} width={'100%'}>
      {!mobile && <Back href={'/discover/models'} />}
      <Flexbox align={'center'} gap={8} horizontal justify={'space-between'} width={'100%'}>
        <Flexbox align={'center'} gap={16} horizontal justify={'flex-start'}>
          <ModelIcon model={identifier} size={48} type={'avatar'} />
          <Flexbox gap={2}>
            <h1 className={styles.title}>{data.meta.title}</h1>
            <Flexbox
              align={'center'}
              gap={12}
              horizontal
              style={{ color: theme.colorTextSecondary }}
            >
              <div>{identifier}</div>
              <time className={styles.time} dateTime={new Date(data.createdAt).toISOString()}>
                {data.createdAt}
              </time>
            </Flexbox>
          </Flexbox>
        </Flexbox>
        {!mobile && (
          <Flexbox align={'center'} gap={4} horizontal justify={'flex-end'}>
            <Link href={'/discover/models'}>
              <Button className={styles.tag} shape={'round'} size={'small'}>
                {t('tab.models')}
              </Button>
            </Link>
          </Flexbox>
        )}
      </Flexbox>
      {data.meta.description && <div>{t(`${identifier}.description`, { ns: 'models' })}</div>}
      <ModelFeatureTags
        functionCall={data.meta.functionCall}
        tokens={data.meta.tokens}
        vision={data.meta.vision}
      />
    </Flexbox>
  );
});

export default Header;
