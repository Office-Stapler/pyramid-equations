import styles from './Tile.module.css';
import classNames from "classnames";
import type { TileEntity } from "./TileEntity";
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';

export type TileHandle = {
  triggerTilesValidMove: () => void;
  triggerTilesInvalidMove: () => void;
  getTileEntity: () => TileEntity | undefined;
}

type TileProps = {
  onClick: () => void;
  tileEntity?: TileEntity;
  isSelected: boolean;
  ref?: Ref<TileHandle | null>;
};


export const Tile: React.FC<TileProps> = ({ onClick, tileEntity, isSelected, ref }) => {
  const [isValidMove, setIsValidMove] = useState(false);
  const [isInvalidMove, setIsInvalidMove] = useState(false);
  const timeoutIdRef = useRef<number | undefined>(undefined);

  useImperativeHandle(ref, () => {
    return {
      triggerTilesValidMove: () => {
        setIsValidMove(true);
        const timeoutId = setTimeout(() => setIsValidMove(false), 500)
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
        timeoutIdRef.current = timeoutId;
      },
      triggerTilesInvalidMove: () => {
        setIsInvalidMove(true);
        const timeoutId = setTimeout(() => setIsInvalidMove(false), 500);
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
        timeoutIdRef.current = timeoutId;
      },
      getTileEntity: () => tileEntity,
    }
  })

  useEffect(() => {
    return () => clearTimeout(timeoutIdRef.current);
  }, [])

  return (
    <div className={classNames(
      styles.tile,
      {
        [styles.selected]: isSelected,
        [styles.validMoveFound]: isValidMove,
        [styles.invalidMoveFound]: isInvalidMove,
      }
    )}
      onClick={onClick}
    >
      <div>{tileEntity?.tileOperationDisplay}</div>
      <div>{tileEntity?.value}</div>
    </div>
  );
};