import cn from 'classnames';
import Image from 'next/image';
import ReactLoading from 'react-loading';

import styles from './loader.module.scss';

function Loader({ isHomePage = false }: { isHomePage?: boolean }) {
  return (
    <div
      className={cn(styles.preloader, 'dark:bg-color-bg-primary bg-color-light-bg-primary')}
      data-testid="sis-loader"
    >
      {isHomePage ? (
        <div className="relative w-[100px] h-[100px] flex justify-center items-center">
          <Image
            width={165}
            height={165}
            className="absolute object-cover w-[120px]"
            src="/img/loading.gif"
            priority
            alt="logo"
          />
        </div>
      ) : (
        <ReactLoading type="bubbles" color="#00AAE6" />
      )}
    </div>
  );
}

export default Loader;
