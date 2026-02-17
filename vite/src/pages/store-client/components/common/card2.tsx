import { Barcode, Layers, ShoppingCart, Star, Tag } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStoreClient } from '../context';

interface ICard2Props {
  badge?: boolean;
  logo: string;
  title: string;
  total: string;
  star: string;
  label?: string;
  sku?: string;
  category1?: string;
  category2?: string;
}

export function Card2({
  badge,
  logo,
  title,
  total,
  star,
  label,
  sku,
  category1,
  category2,
}: ICard2Props) {
  const { showCartSheet, showProductDetailsSheet } = useStoreClient();

  return (
    <Card className="group h-full">
      <CardContent className="flex flex-col gap-3 p-3 sm:p-4">
        <div className="relative overflow-hidden rounded-xl bg-accent/50">
          {badge && (
            <Badge
              size="sm"
              variant="destructive"
              className="absolute top-2 left-2 uppercase z-10"
            >
              save 40%
            </Badge>
          )}

          <div className="flex items-center justify-center aspect-[4/3]">
            <img
              onClick={() => showProductDetailsSheet('productid')}
              src={toAbsoluteUrl(`/media/store/client/600x600/${logo}`)}
              className="h-[140px] sm:h-[170px] cursor-pointer object-contain transition-transform duration-300 group-hover:scale-105"
              alt="image"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div
            onClick={() => showProductDetailsSheet('productid')}
            className="hover:text-primary text-xs font-normal text-secondary-foreground sm:text-sm sm:font-medium sm:text-mono leading-5.5 cursor-pointer"
          >
            {title}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge
              size="sm"
              variant="warning"
              shape="circle"
              className="rounded-full gap-1"
            >
              <Star
                className="text-white -mt-0.5"
                style={{ fill: 'currentColor' }}
              />{' '}
              {star}
            </Badge>

            {sku && (
              <div className="flex items-center gap-1 rounded-full bg-muted/60 px-2 py-1">
                <Barcode className="h-3.5 w-3.5" />
                <span className="text-foreground font-medium">{sku}</span>
              </div>
            )}

            {category1 && (
              <div className="flex items-center gap-1 rounded-full bg-muted/60 px-2 py-1">
                <Tag className="h-3.5 w-3.5" />
                <span className="text-foreground font-medium">{category1}</span>
              </div>
            )}

            {category2 && (
              <div className="flex items-center gap-1 rounded-full bg-muted/60 px-2 py-1">
                <Layers className="h-3.5 w-3.5" />
                <span className="text-foreground font-medium">{category2}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {label && (
              <span className="text-xs font-normal text-secondary-foreground line-through pt-[1px]">
                {label}
              </span>
            )}
            <span className="text-sm font-medium text-mono">${total}</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="shrink-0"
            onClick={showCartSheet}
          >
            <ShoppingCart /> Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
