
import cn from 'classnames';
import ReactLoading from "react-loading";

import styles from "./loader.module.scss";

function Loader() {
  return (
    <div
      className={
        cn(
          styles.preloader,
          "dark:bg-color-bg-primary bg-color-light-bg-primary"
        )
      }
      data-testid="sis-loader"
    >
      <ReactLoading type="bubbles" color="#50C627" delay={50}/>
    </div>
  );
}

export default Loader;
