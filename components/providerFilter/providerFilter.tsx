import React, { memo } from 'react';
import { Listbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { ArrowRight2 } from 'iconsax-react';

import { useTranslation } from '@/base/config/i18next';
import { GameProviderDetail } from '@/base/types/common';
import { titleCase } from '@/base/libs/utils';

type providerFilterProps = {
  listProvider: GameProviderDetail[];
  selectedProvider: string[];
  selectProvider: (id?: string | undefined) => void;
};

const ProviderFilter = ({ listProvider, selectedProvider, selectProvider }: providerFilterProps) => {
  const { t } = useTranslation('');
  return (
    <div className="flex items-center gap-[10px] grow sm-grow-0">
      <div className="hidden sm:block">{t('casino:provider')}</div>
      <Listbox
        multiple
        as="div"
        className="relative w-full sm:w-[172px] text-left rounded flex text-[14px] dark:text-[#98a7b5] h-[36px] sm:h-[40px] text-[#000] dark:bg-[#1D1E22] bg-[#F6F7FA]"
      >
        <Listbox.Button className="px-[20px] w-full text-left">
          <div className="flex items-center justify-between">
            <div className="truncate">{selectedProvider.length || t('casino:allProviders')}</div>
            <ArrowRight2 size="16" color="#98a7b5" />
          </div>
        </Listbox.Button>
        <Listbox.Options className="absolute sm:mr-0 fixed right-0 z-[1] mt-12 w-full max-w-full origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 rounded-md dark:bg-[#1c1c20] bg-white sm:w-auto shadow-gray-900 shadow">
            <div className="py-1 max-h-[65vh] overflow-y-auto px-[6px] w-full">
              <div
                onClick={() => selectProvider()}
                className="text-[14px] dark:text-[#98a7b5] cursor-pointer h-[32px] flex items-center justify-center border-b border-solid border-[#3b3f4a]"
              >
                {t('casino:clearAll')}
              </div>
              {listProvider.map((provider) => (
                <Listbox.Option key={provider.id} value={provider.id}>
                  <div
                    onClick={() => selectProvider(provider.id)}
                    className={`text-[14px] dark:text-[#98a7b5] cursor-pointer px-[10px] my-[4px] h-[32px] flex items-center gap-[10px]`}
                  >
                    <div className="flex items-center justify-center rounded-[4px] border border-solid border-[#2d3035] w-4 h-4 bg-[#2d303580]">
                      {provider?.isSelect && <CheckIcon className="w-[20px] text-[#f59e0b]" />}
                    </div>
                    <span className="truncate flex-1">{titleCase(provider.name || '')}</span>
                    <span className="text-[#f59e0b]">{provider.totalGames}</span>
                  </div>
                </Listbox.Option>
              ))}
            </div>
          </div>
        </Listbox.Options>
      </Listbox>
    </div>
  );
};

export default memo(ProviderFilter);
