import styles from './Tile.module.css';
import classNames from "classnames";
import type { TileEntity } from "./TileEntity";


type TileProps = {
  onClick: () => void;
  tileEntity?: TileEntity;
  isSelected: boolean;
};

export const Tile: React.FC<TileProps> = ({ onClick, tileEntity, isSelected }) => {


  return (
    <div className={classNames(
      styles.tile,
      { [styles.selected]: isSelected }
    )}
      onClick={onClick}
    >
      <div className={styles.tileOperation}>{tileEntity?.tileOperationDisplay}</div>
      <div className={styles.tileValue}>{tileEntity?.value}</div>
    </div>
  );
}